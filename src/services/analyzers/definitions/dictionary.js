import {removeCodeExpression} from '../../utils/codeFixer';

// Descrição: Este arquivo contém o dicionário da linguagem
const knownDefinitions = [
    '#VARIAVEIS',
    '#INICIO_PROGRAMA',
    '#FIM_PROGRAMA',
];

const knownCommands = [
    'escreva',
    'leia',
    'variavel'
];


const knownInstructions = {
    'escreva': {
        'description': 'Escreve na tela o que está entre aspas simples',
        'syntax': "escreva('')",
        'example': 'escreva(\'Olá mundo!\')',
        'constructionInOrder': ['escreva', '(', '\'', '\'', ')'],
        'obs': ''
    },
    'leia': {
        'description': 'Lê um valor do teclado e armazena na variável',
        'syntax': "leia()",
        'example': 'leia(x)',
        'constructionInOrder': ['leia', '(', ')'],
    },
    'variavel': {
        'description': 'Declara uma variável',
        'syntax': "variavel",
        'example': 'variavel x',
        'constructionInOrder': ['variavel', 'name'],
        'obs': 'As variáveis têm que ser declaradas antes de serem utilizadas\n' +
            'A variável deve ser declarada apenas uma vez\n' +
            'A variável deve ser declarada com um nome válido (não pode conter espaços, acentos, caracteres especiais, começar com números, etc.)',
    }
}

export function isDefinition(word) {
    return knownDefinitions.includes(word);
}

export function isCommand(word) {
    return knownCommands.includes(removeCodeExpression(word));
}

export function getKnownDefinitions() {
    return knownDefinitions;
}

export function getInstructionByToken(token) {
    return knownInstructions[token];
}

export function getNotAcceptedSpecialCharacters() {
    return /[ `´!@#$%^&*()+\-=\]{};':"\\|,.<>?~]/;
}
