import {getInstructionByToken, knownCommands, getNotAcceptedSpecialCharacters} from '../definitions/dictionary.js';

/*
    Analisador sintático
    Verifica se a construção da instrução está correta
 */
export function syntacticAnalyze(instruction) {
    if (instruction.startsWith('escreva')) {
        validateEscrevaInstruction(instruction);
    }
    if (instruction.startsWith('variavel')) {
        return validateVariavelInstruction(instruction);
    }
}

function validateEscrevaInstruction(instruction) {
    const definition = getInstructionByToken('escreva');
    const syntax = definition.syntax;

    // remover trecho entre ' ' da instrução
    const aux = instruction.substring(instruction.indexOf('\'') + 1, instruction.lastIndexOf('\''));
    if(aux.indexOf('\'') !== -1){
        throw new Error('Erro sintático | A instrução escreva está incorreta - deve ser da seguinte forma: ' + definition.example);
    }
    instruction = instruction.replace(aux, '');

    // verifica se há a quantidade correta de cada componente da instrução
    if (instruction.split('escreva').length - 1 !== 1 ||
        instruction.split('(').length - 1 !== 1 ||
        instruction.split(')').length - 1 !== 1 ||
        instruction.split('\'').length - 1 !== 2
    ) {
        throw new Error('Erro sintático | A instrução escreva está incorreta - deve ser da seguinte forma: ' + definition.example);
    }

    // Verifica se a instrução está correta
    if(instruction !== syntax){
        throw new Error('Erro sintático | A instrução escreva está incorreta - deve ser da seguinte forma: ' + definition.example);
    }
}

function validateVariavelInstruction(instruction) {
    const definition = getInstructionByToken('variavel');
    const syntax = definition.syntax;

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

    return name;
}

