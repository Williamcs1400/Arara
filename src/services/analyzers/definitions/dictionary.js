import {removeCodeExpression} from '../../utils/codeFixer';

// Descrição: Este arquivo contém o dicionário da linguagem
const knownDefinitions = [
    '#VARIAVEIS',
    '#INICIOPROGRAMA',
    '#FIMPROGRAMA',
];

const knownCommands = [
    'escreva',
    'leia',
];


const knownInstructions = {
    'escreva': {
        'description': 'Escreve na tela o que está entre aspas simples',
        'syntax': "escreva('')",
        'example': 'escreva(\'Olá mundo!\')',
        'constructionInOrder': ['escreva', '(', '\'', '\'', ')'],
    }
}

export function isDefinition(word){
    return knownDefinitions.includes(word);
}

export function isCommand(word) {
    return knownCommands.includes(removeCodeExpression(word));
}

export function getKnownDefinitions(){
    return knownDefinitions;
}

export function getInstructionByToken(token) {
    return knownInstructions[token];
}
