import {getInstructionByToken, getNotAcceptedSpecialCharacters} from '../definitions/dictionary.js';

/*
    Analisador sintático
    Verifica se a construção da instrução está correta
 */
export function syntacticAnalyze(instruction) {
    // verificação para declaração de variáveis
    if (instruction.startsWith('variavel')) {
        return validateVariavelInstruction(instruction);
    }
    // verificação para instrução de escrita
    if (instruction.startsWith('escreva')) {
        return validateEscrevaInstruction(instruction);
    }
    // verificação para instrução de leitura
    if (instruction.startsWith('leia')) {
        return validateLeiaInstruction(instruction);
    }
}

function validateVariavelInstruction(instruction) {
    const definition = getInstructionByToken('variavel');

    // verifica se há a quantidade correta de cada componente da instrução
    if (instruction.split('variavel').length - 1 !== 1 ||
        instruction.split(' ').length - 1 < 1
    ) {
        throw new Error('Erro sintático | A instrução variavel está incorreta - deve ser da seguinte forma: ' + definition.example);
    }

    // verifica se a definição do nome está correta
    const name = instruction.substring(instruction.indexOf('variavel') + 8, instruction.length).trim();

    if(name === undefined || name === ''){
        throw new Error('Erro sintático | A instrução variavel está incorreta - deve ser da seguinte forma: ' + definition.example);
    }

    // verifica se o nome da variável é válido
    if(getNotAcceptedSpecialCharacters().test(name) || name.indexOf(' ') !== -1){
        throw new Error('Erro sintático | O nome da variável é inválido - deve ser da seguinte forma: ' + definition.obs);
    }

    return name === '' ? null : {'name': name, 'action': 'declaration'};
}

function validateEscrevaInstruction(instruction) {
    const definition = getInstructionByToken('escreva');
    const syntax = definition.syntax;
    let name = '';

    // remover trecho entre ' ' da instrução ou o valor se não houver ' '
    if(instruction.indexOf('\'') === -1){
        // recupera o valor da variável para ser impresso
        name = instruction.substring(instruction.indexOf('(') + 1, instruction.lastIndexOf(')'));
        instruction = instruction.replace(instruction.substring(instruction.indexOf('(') + 1, instruction.lastIndexOf(')')), '');
    }
    const aux = instruction.substring(instruction.indexOf('\'') + 1, instruction.lastIndexOf('\''));
    if(aux.indexOf('\'') !== -1){
        throw new Error('Erro sintático | A instrução escreva está incorreta - deve ser da seguinte forma: ' + definition.example);
    }
    instruction = instruction.replace(aux, '');

    // verifica se há a quantidade correta de cada componente da instrução
    if (instruction.split('escreva').length - 1 !== 1 ||
        instruction.split('(').length - 1 !== 1 ||
        instruction.split(')').length - 1 !== 1
    ) {
        throw new Error('Erro sintático | A instrução escreva está incorreta - deve ser da seguinte forma: ' + definition.example);
    }

    // Verifica se a instrução está correta
    if(instruction !== syntax[0] && instruction !== syntax[1]){
        throw new Error('Erro sintático | A instrução escreva está incorreta - deve ser da seguinte forma: ' + definition.example);
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
        throw new Error('Erro sintático | A instrução leia está incorreta - deve ser da seguinte forma: ' + definition.example);
    }

    // recuperar o nome da variável e remover da instrução
    const name = instruction.substring(instruction.indexOf('(') + 1, instruction.indexOf(')'));
    instruction = instruction.replace(name, '');

    // Verifica se a instrução está correta
    if(instruction !== syntax){
        throw new Error('Erro sintático | A instrução leia está incorreta - deve ser da seguinte forma: ' + definition.example);
    }

    return {'name': name, 'action': 'read'};
}

