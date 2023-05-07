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
    'inteiro',
    'real',
    'texto',
    'logico',
    'caractere'
];

const knownOperators = [
    '+',
    '-',
    '*',
    '/',
]


const knownInstructions = {
    'escreva': {
        'description': 'Escreve na tela o que está entre aspas simples',
        'syntax': ["escreva('')", "escreva()"],
        'example': 'escreva(\'Olá mundo!\') ou escreva(x)',
        'constructionInOrder': ['escreva', '(', '\'', '\'', ')'],
        'obs': ''
    },
    'leia': {
        'description': 'Lê um valor do teclado e armazena na variável',
        'syntax': "leia()",
        'example': 'leia(x)',
        'constructionInOrder': ['leia', '(', ')'],
    },
    'inteiro': {
        'description': 'Declara uma variável do tipo inteiro',
        'syntax': "inteiro",
        'example': 'inteiro x',
        'constructionInOrder': ['inteiro', 'name'],
        'obs': 'As variáveis têm que ser declaradas antes de serem utilizadas\n' +
            'A variável deve ser declarada apenas uma vez\n' +
            'A variável deve ser declarada com um nome válido (não pode conter espaços, acentos, caracteres especiais, começar com números, etc.)',
    },
    'real': {
        'description': 'Declara uma variável do tipo real',
        'syntax': "real",
        'example': 'real x',
        'constructionInOrder': ['real', 'name'],
        'obs': 'As variáveis têm que ser declaradas antes de serem utilizadas\n' +
            'A variável deve ser declarada apenas uma vez\n' +
            'A variável deve ser declarada com um nome válido (não pode conter espaços, acentos, caracteres especiais, começar com números, etc.)',
    },
    'texto': {
        'description': 'Declara uma variável do tipo texto',
        'syntax': "texto",
        'example': 'texto x',
        'constructionInOrder': ['texto', 'name'],
        'obs': 'As variáveis têm que ser declaradas antes de serem utilizadas\n' +
            'A variável deve ser declarada apenas uma vez\n' +
            'A variável deve ser declarada com um nome válido (não pode conter espaços, acentos, caracteres especiais, começar com números, etc.)',
    },
    'logico': {
        'description': 'Declara uma variável do tipo lógico',
        'syntax': "logico",
        'example': 'logico x',
        'constructionInOrder': ['logico', 'name'],
        'obs': 'As variáveis têm que ser declaradas antes de serem utilizadas\n' +
            'A variável deve ser declarada apenas uma vez\n' +
            'A variável deve ser declarada com um nome válido (não pode conter espaços, acentos, caracteres especiais, começar com números, etc.)',
    },
    'caractere': {
        'description': 'Declara uma variável do tipo caractere',
        'syntax': "caractere",
        'example': 'caractere x',
        'constructionInOrder': ['caractere', 'name'],
        'obs': 'As variáveis têm que ser declaradas antes de serem utilizadas\n' +
            'A variável deve ser declarada apenas uma vez\n' +
            'A variável deve ser declarada com um nome válido (não pode conter espaços, acentos, caracteres especiais, começar com números, etc.)'
    }
}

export function isDefinition(word) {
    return knownDefinitions.includes(word);
}

export function isCommand(word) {
    return knownCommands.includes(removeCodeExpression(word));
}

export function isOperator(word) {
    return knownOperators.includes(word);
}

export function getOperator(instruction) {
    return knownOperators.find(operator => instruction.includes(operator));
}

export function containsOperator(instruction) {
    return knownOperators.some(operator => instruction.includes(operator));
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

export function isDeclaration(token) {
    return token.startsWith('inteiro') || token.startsWith('real') || token.startsWith('texto') || token.startsWith('logico') || token.startsWith('caractere');
}

export function validateTyping(declaration, value) {
    if (declaration.startsWith('inteiro')) {
        const number = Number(value);
        return Number.isInteger(number);
    }

    if (declaration.startsWith('real')) {
        const number = Number(value);
        return (Number.isInteger(number) || (Number(number) === number && number % 1 !== 0));
    }

    if (declaration.startsWith('texto')) {
        return value.indexOf("'") !== -1;
    }

    if (declaration.startsWith('logico')) {
        return value === 'verdadeiro' || value === 'falso';
    }

    if (declaration.startsWith('caractere')) {
        return value.indexOf("'") !== -1 && value.replaceAll("'", '').length === 1;
    }

    return false;
}
