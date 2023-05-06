import {
    getInstructionByToken,
    getNotAcceptedSpecialCharacters,
    isDeclaration,
    validateTyping
} from '../definitions/dictionary.js';

/*
    Analisador sintático
    Verifica se a construção da instrução está correta
 */
export function syntacticAnalyze(instruction) {

    // verificação para declaração de variáveis
    if (instruction.startsWith('inteiro') || instruction.startsWith('real') || instruction.startsWith('texto') || instruction.startsWith('logico') || instruction.startsWith('caractere')) {
        const token = instruction.split(' ')[0];
        if(instruction.split(token).length - 1 !== 1){
            throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
        }
        return validateAssignmentInstruction(instruction, token);
    }
    // verificação para atribuição de valor fora da declaração
    else if(instruction.indexOf('=') !== -1){
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
}

// TODO: verificar o pq de tirar o ; do final da atribuição não gera erro
function validateAssignmentWithDeclarationInstruction(instruction){
    const split = instruction.split('='); // separa a instrução em duas partes, antes e depois do '='
    const name = split[0].trim(); // nome da variável
    const value = split[1].trim(); // valor da variável
    return {'name': name, 'value': value, 'action': 'assignment'};
}


function validateAssignmentInstruction(instruction, token) {
    const definition = getInstructionByToken(token);

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

    // verifica se há atribuição de valor e se o valor é válido
    if(name.indexOf('=') !== -1){
        if(validateTyping(token, name.split('=')[1].trim())){
            name = name.split('=')[0].trim();
        }else{
            getErrorTypingExample(name.split('=')[0].trim(), name.split('=')[1].trim(),  token);
        }
    }

    // verifica se o nome da variável é válido
    if(getNotAcceptedSpecialCharacters().test(name) || name.indexOf(' ') !== -1){
        getErrorAssignmentObs(token);
    }

    return name === '' ? null : {'name': name, 'action': 'declaration'};
}

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
    instruction = instruction.replace(aux, '');

    // verifica se há a quantidade correta de cada componente da instrução
    if (instruction.split('escreva').length - 1 !== 1 ||
        instruction.split('(').length - 1 !== 1 ||
        instruction.split(')').length - 1 !== 1
    ) {
        getErrorWriteExample();
    }

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
    }
    else if(instruction !== syntax[0] && instruction !== syntax[1]){
        getErrorWriteExample();
    }

    return {name: name, action: 'write'};
}

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
    instruction = instruction.replace(name, '');

    // Verifica se a instrução está correta
    if(instruction !== syntax){
        getErrorReadExample();
    }

    return {'name': name, 'action': 'read'};
}

// Erros de atribuição
function getErrorTypingExample(name, value, type){
    throw new Error('Erro semântico | O valor ' + value + ' atribuído à variável ' + name + ' não é compatível com o tipo ' + type + '.');
}

function getErrorAssignmentExample(token) {
    throw new Error('Erro sintático | A instrução ' + token + ' está incorreta - deve ser da seguinte forma: ' + getInstructionByToken(token).example);
}

function getErrorAssignmentObs(token){
    throw new Error('Erro sintático | O nome da ' + token + ' é inválido - deve ser da seguinte forma: ' + getInstructionByToken(token).obs);
}

// Erros de escrita
function getErrorWriteExample(){
    throw new Error('Erro sintático | A instrução escreva está incorreta - deve ser da seguinte forma: ' + getInstructionByToken('escreva').example);
}
// Erros de leitura
function getErrorReadExample(){
    throw new Error('Erro sintático | A instrução leia está incorreta - deve ser da seguinte forma: ' + getInstructionByToken('leia').example);
}
