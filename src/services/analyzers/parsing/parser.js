import {
    getInstructionByToken,
    getKnownDeclarations,
    getNotAcceptedSpecialCharacters,
    validateTyping
} from '../definitions/dictionary.js';
import {validateComparison, validateSeInstruction} from "./validateConditional";
import {ConditionalType} from "../definitions/actionTypes";
import {compilerFromScope, generateTokens} from "../compiler";
import {getPointerOfArray, getSizeOfArray, removeStringForWriteCommand} from "../../utils/util";

let lastInstruction = '';

/*
    Analisador sintático
    Verifica se a construção da instrução está correta
 */
export function syntacticAnalyze(instruction, pastInstructions) {

    setLastInstruction(instruction);

    // verificação para declaração de variáveis
    if (instruction.startsWith('inteiro') || instruction.startsWith('real') || instruction.startsWith('texto') || instruction.startsWith('logico') || instruction.startsWith('caractere')) {
        const token = instruction.split(' ')[0];
        if(instruction.split(token).length - 1 !== 1){
            throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
        }
        return validateAssignmentInstruction(instruction, token);
    }

    // TODO: comparação do 'se' de uma forma melhor
    // verificação para atribuição de valor fora da declaração
    else if(instruction.indexOf('=') !== -1 && instruction.indexOf('se(') === -1 && instruction.indexOf('senao se(') === -1 && instruction.indexOf('senao(') === -1 && instruction.indexOf('enquanto(') === -1){
        return validateAssignmentWithDeclarationInstruction(instruction);
    }

    // verificação para instrução de escrita
    if (instruction.startsWith('escreva')) {
        if(instruction.split('escreva').length - 1 !== 1){
            throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
        }
        return validateEscrevaInstruction(instruction);
    }

    // verificação para instrução de leitura
    if (instruction.startsWith('leia')) {
        if(instruction.split('leia').length - 1 !== 1){
            throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
        }
        return validateLeiaInstruction(instruction);
    }

    // verificação para instrução enquanto
    if (instruction.startsWith('enquanto')) {
        if(instruction.split('enquanto').length - 1 !== 1){
            throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
        }
        return validateEnquantoInstruction(instruction, pastInstructions);
    }

    // verificação para instrução **se**
    if (instruction.startsWith('se') && instruction.indexOf('senao se') === -1 && instruction.indexOf('senao') === -1){
        if(instruction.split('se').length - 1 !== 1){
            throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
        }
        return validateSeInstruction(instruction, ConditionalType.se);
    }

    // verificação para instrução **senao se**
    if (instruction.startsWith('senao se')) {
        if(instruction.split('senao se').length - 1 !== 1){
            throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
        }
        if(lastInstruction.indexOf('se') === -1){
            throw new Error('Erro sintático | Não há uma instrução **se** anterior para a instrução **senao se**.');
        }
        return validateSeInstruction(instruction, ConditionalType.senao);
    }

    // verificação para instrução **senao**
    if (instruction.startsWith('senao') && instruction.indexOf('senao se') === -1) {
        if(instruction.split('senao').length - 1 !== 1){
            throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
        }
        if(lastInstruction.indexOf('se') === -1){
            throw new Error('Erro sintático | Não há uma instrução **se** anterior para a instrução **senao**.');
        }
        return {'action': 'else'};
    }

    if(instruction === 'para'){

    }
}

// atualiza a última instrução
export function setLastInstruction(instruction){
    lastInstruction = instruction;
}

// recupera a última instrução
export function getLastInstruction(){
    return lastInstruction;
}

// TODO: verificar o pq de tirar o ; do final da atribuição não gera erro
function validateAssignmentWithDeclarationInstruction(instruction){
    const split = instruction.split('='); // separa a instrução em duas partes, antes e depois do '='
    const name = split[0].trim(); // nome da variável
    const value = split[1].trim(); // valor da variável
    return {'name': name, 'value': value, 'action': 'assignment'};
}

// Validação da instrução de atribuição
function validateAssignmentInstruction(instruction, token) {
    // verifica se há a quantidade correta de cada componente da instrução
    if (instruction.split(token).length - 1 !== 1 ||
        instruction.split(' ').length - 1 < 1
    ) {
        getErrorAssignmentExample(token);
    }

    // verifica se a definição do nome está correta
    let name = instruction.substring(instruction.indexOf(token) + token.length, instruction.length).trim();
    if(name === undefined || name === ''){
        getErrorAssignmentExample(token);
    }

    let isArray = false;
    // verifica se há atribuição de valor e se o valor é válido
    if(name.indexOf('=') !== -1){
        isArray = name.split('=')[0].split('[').length - 1 === 1 && name.split('=')[0].split(']').length - 1 === 1;
        if(isArray){
            const values = name.replaceAll('[', '').replaceAll(']', '').split('=')[1].trim().split(',');
            const nameAndSize = name.split('=')[0].trim();
            if(values.length !== Number(getPointerOfArray(nameAndSize))){
                getErrorArraySizeExample(nameAndSize, values.length);
            }

            values.forEach(value => {
                if (validateTyping(token, value.trim())) {
                    name = name.split('=')[0].trim().replaceAll('[', '').replaceAll(']', '');
                } else {
                    getErrorTypingExample(name.split('=')[0].trim(), value.trim(), token);
                }
            });
        }else {
            if (validateTyping(token, name.split('=')[1].trim())) {
                name = name.split('=')[0].trim();
            } else {
                getErrorTypingExample(name.split('=')[0].trim(), name.split('=')[1].trim(), token);
            }
        }
    }else{
        isArray = name.split('[').length - 1 === 1 && name.split(']').length - 1 === 1;
        if(isArray){
            name = name.replaceAll('[', '').replaceAll(']', '');
        }
    }

    // verifica se o nome da variável é válido
    if(!isArray && (getNotAcceptedSpecialCharacters().test(name) || name.indexOf(' ') !== -1)){
        getErrorAssignmentObs(token);
    }

    // verifica se o nome da variável é válido - array
    if(isArray && (getKnownDeclarations(name) || name.indexOf(' ') !== -1)){
        getErrorAssignmentObs(token);
    }

    return name === '' ? null : {'name': name, 'action': 'declaration', space: isArray ? name.substring(name.indexOf('['), name.indexOf(']') + 1) : ''};
}

// Validação da instrução de escrita
function validateEscrevaInstruction(instruction) {
    const definition = getInstructionByToken('escreva');
    const syntax = definition.syntax;
    let name = '';

    // remover trecho entre ' ' da instrução ou o valor se não houver ' '
    if(instruction.indexOf('\'') === -1 || instruction.indexOf(',') !== -1){
        // recupera o valor da variável para ser impresso
        name = instruction.substring(instruction.indexOf('(') + 1, instruction.lastIndexOf(')'));
        instruction = instruction.replace(instruction.substring(instruction.indexOf('(') + 1, instruction.lastIndexOf(')')), '');
    }

    const aux = instruction.substring(instruction.indexOf('\'') + 1, instruction.lastIndexOf('\''));
    if(aux.indexOf('\'') !== -1){
        getErrorWriteExample();
    }

    // substitui o trecho entre ' ' por '' na instrução
    const pos = instruction.lastIndexOf(aux);
    instruction = instruction.substring(0, pos) + instruction.substring(pos + aux.length, instruction.length);

    // verifica se há a quantidade correta de cada componente da instrução
    if (instruction.split('escreva').length - 1 !== 1 ||
        instruction.split('(').length - 1 !== 1 ||
        instruction.split(')').length - 1 !== 1
    ) {
        getErrorWriteExample();
    }

    // remove trechos entre ' ' da instrução
    name = removeStringForWriteCommand(name);

    // Verifica se a instrução está correta
    if(name !== '' && name.indexOf(',') !== -1){
        const values = name.split(',');
        if(values.length < 2){
            getErrorWriteExample();
        }
        for(let i = 0; i < values.length; i++){
            if(values[i].indexOf("'") !== -1 && values[i].split("'").length - 1 !== 2){
                getErrorWriteExample();
            }
        }
        name = name.split(',')[1].replaceAll(' ', '');
    }


    else if(instruction !== syntax[0] && instruction !== syntax[1]){
        getErrorWriteExample();
    }

    return {name: name, action: 'write'};
}

// Validação da instrução de leitura
function validateLeiaInstruction(instruction) {
    const definition = getInstructionByToken('leia');
    const syntax = definition.syntax;

    // verifica se há a quantidade correta de cada componente da instrução
    if (instruction.split('leia').length - 1 !== 1 ||
        instruction.split('(').length - 1 !== 1 ||
        instruction.split(')').length - 1 !== 1
    ) {
        getErrorReadExample();
    }

    // recuperar o nome da variável e remover da instrução
    const name = instruction.substring(instruction.indexOf('(') + 1, instruction.indexOf(')'));
    // replace last occurrence of name
    instruction = instruction.replace(instruction.substring(instruction.lastIndexOf(name), instruction.lastIndexOf(')') + 1), '') + ')';

    // Verifica se a instrução está correta
    if(instruction !== syntax){
        getErrorReadExample();
    }

    return {'name': name, 'action': 'read'};
}

// Validação da instrução enquanto
function validateEnquantoInstruction(instruction, pastInstructions) {
    const definition = getInstructionByToken('enquanto');
    const syntax = definition.syntax;

    const content = instruction.substring(instruction.indexOf('{') + 1, instruction.lastIndexOf('}'));
    instruction = instruction.replace(content, '');

    // verifica se há a quantidade correta de cada componente da instrução
    if (instruction.split('enquanto').length - 1 !== 1 ||
        instruction.split('(').length - 1 !== 1 ||
        instruction.split(')').length - 1 !== 1
    ) {
        throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
    }

    const condition = instruction.substring(instruction.indexOf('(') + 1, instruction.indexOf(')'));
    instruction = instruction.replace(condition, '').replaceAll(' ', '');

    // Verifica se a instrução está correta
    if(instruction !== syntax){
        throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
    }

    const resultComparison = validateComparison(condition);

    // TODO: tratar erros do conteudo
    const tokens = generateTokens(content);
    let fullContent = JSON.parse(JSON.stringify(pastInstructions));
    fullContent.tokens.push(...tokens)
    fullContent.tokens.push('#FIM_PROGRAMA')
    fullContent.preProcessingCode = fullContent.tokens;
    const result = compilerFromScope(fullContent);
    if(!result.sucess){
        throw new Error(result.message);
    }

    return {'condition': condition, 'action': 'while', 'content': content, variables: resultComparison};

}

// Erros de atribuição
// TODO: fazer erros aparecerem no terminal em vemelho
function getErrorTypingExample(name, value, type){
    throw new Error('Erro semântico | O valor ' + value + ' atribuído à variável ' + name + ' não é compatível com o tipo ' + type + '.');
}

function getErrorAssignmentExample(token) {
    throw new Error('Erro sintático | A instrução ' + token + ' está incorreta - deve ser da seguinte forma: ' + getInstructionByToken(token).example);
}

function getErrorAssignmentObs(token){
    throw new Error('Erro sintático | O nome ' + token + ' é inválido - deve ser da seguinte forma: ' + getInstructionByToken(token).obs);
}

// Erros de escrita
function getErrorWriteExample(){
    throw new Error('Erro sintático | A instrução escreva está incorreta - deve ser da seguinte forma: ' + getInstructionByToken('escreva').example);
}
// Erros de leitura
function getErrorReadExample(){
    throw new Error('Erro sintático | A instrução leia está incorreta - deve ser da seguinte forma: ' + getInstructionByToken('leia').example);
}

// Erros de tamanho de array
function getErrorArraySizeExample(token, value){
    throw new Error('Erro sintático | O tamanho do array declarado ' + token + ' é diferente da quantidade de valores atribuídos - <' + value + '>.');
}
