import {getInstructionByToken, knownCommands} from '../definitions/dictionary.js';

/*
    Analisador sintático
    Verifica se a construção da instrução está correta
 */
export function syntacticAnalyze(instruction) {
    if (instruction.startsWith('escreva')) {
        validateEscrevaInstruction(instruction);
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

