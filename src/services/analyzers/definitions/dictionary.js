import {removeCodeExpression} from '../../utils/codeFixer';
import {getElementsOfArray, getSizeOfArray, isArrayDeclaration} from "../../utils/util";

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
    'caractere',
    'se',
    'senao se',
    'senao',
    'enquanto',
    'para',
];

const knownOperators = [
    '+',
    '-',
    '*',
    '/',
]

const knownComparisons = [
    '<',
    '>',
    '==',
    '!=',
    '>=',
    '<=',
]

const knownConditions = [
    'se',
    'senao se',
    'senao',
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
    'se': {
        'description': 'Executa um bloco de código se a condição for verdadeira',
        'syntax': "se(){}",
        'example': 'se(x > 0)',
        'constructionInOrder': ['se', '(', ')'],
    },
    'senao se': {
        'description': 'Executa um bloco de código se a condição for verdadeira, desde que a condição do se anterior seja falsa',
        'syntax': "senaose(){}",
        'example': 'senao se(x > 0)',
        'constructionInOrder': ['senao se', '(', ')'],
    },
    'senao': {
        'description': 'Executa um bloco de código se a condição do se e do senao_se anterior forem falsas',
        'syntax': "senao{}",
        'example': 'senao{}',
        'constructionInOrder': ['senao', '{', '}'],
    },
    'enquanto': {
        'description': 'Executa um bloco de código enquanto a condição for verdadeira',
        'syntax': "enquanto(){}",
        'example': 'enquanto(x > 0)',
        'constructionInOrder': ['enquanto', '(', ')'],
    },
    'para': {
        'description': 'Executa um bloco de código enquanto a condição for verdadeira',
        'syntax': "para(;;){}",
        'example': 'para(i = 0; i < 10; i++)',
        'constructionInOrder': ['para', '(', ')', '{', '}'],
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

export function getKnownOperators() {
    return knownOperators;
}

/*
    * Verifica se a instrução é uma operação entre variáveis ou números
    * @param instruction: instrução a ser verificada
    *
    * @return booleano que indica se a instrução é válida ou não
 */
export function containsOperator(instruction) {
    // regex para verificar se a instrução contém um operador entre variáveis ou números
    const regexVariableOperationVariable = /^[a-zA-Z0-9_\[\]]+[+\-*/][a-zA-Z0-9_\[\]]+$/;

    // usar apenas o lado direito da atribuição
    if(instruction.indexOf('=') !== -1){
        const tmp = instruction.split('=')[1].replaceAll(' ', '');
        return regexVariableOperationVariable.test(tmp);
    }

    // verificar se a instrução é uma operação de incremento ou decremento
    if(instruction.indexOf('--') !== -1 || instruction.indexOf('++') !== -1){
        // regex para verificar se a instrução contém uma variável seguida de ++ ou --
        const regexVariableOperation = /^[a-zA-Z0-9_\[\]]+[+\-]{2}$/;
        return regexVariableOperation.test(instruction.replaceAll(' ', ''));
    }

    return regexVariableOperationVariable.test(instruction.replaceAll(' ', ''));
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

export function getNotAcceptedSpecialCharactersExceptSquareBrackets() {
    return /[ `´!@#$%^&*()+\-=\}{};':"\\|,.<>?~]/;
}

/*
 * Testa se a palavra contém caracteres especiais não aceitos - exceto colchetes no caso de arrays
 * @param token: palavra a ser testada
 *
 * @return booleano que indica se a palavra é válida ou não
 */
export function getKnownDeclarations(token) {
    if(token.split('[').length - 1 === 1 && token.split(']').length - 1 === 1){
        return getNotAcceptedSpecialCharactersExceptSquareBrackets().test(token);
    }
    return getNotAcceptedSpecialCharacters().test(token);
}

/*
 * Remove declaração de array de uma variável []
 * @param token: token a ter [] removido
 *
 * @return token sem []
 */
export function removeArrayDeclaration(token) {
    if(token.indexOf('=') !== -1){
        if(token.split('[').length - 1 === 1 && token.split(']').length - 1 === 1){
            const subToken = token.substring(token.indexOf('['), token.indexOf(']') + 1);
            return token.replace(subToken, '');
        }
    }else if(token.split('[').length - 1 === 1 && token.split(']').length - 1 === 1){
        const subToken = token.substring(token.indexOf('['), token.indexOf(']') + 1);
        return token.replace(subToken, '');
    }
    return token;
}

/*
 * Verifica se existe uma definição com o nome da variável
 */
export function isKnownDefinition(codeDefinitions, variableName) {
    for(let i = 0; i < codeDefinitions.length; i++){
        const dName = removeArrayDeclaration(codeDefinitions[i]).replaceAll(' ', '');
        const vName = variableName.split('=')[0].replaceAll(' ', '');
        if(dName === vName){
            return false;
        }
        if(dName.split('[')[0] === vName.split('[')[0]){
            return false;
        }
    }
    return true;
}

/*
 * Função que verifica se a palavra começa com um número ou é apenas um número
 * @param word: palavra a ser verificada
 * @return booleano que indica se a palavra é válida ou não
 */
export function startsWithOrOnlyNumber(word) {
    return word.match(/^[0-9]+$/) !== null;
}

/*
 * Função que verifica se o nome da variável é válido para uma possível declaração
 * @param word: palavra a ser verificada
 * @return booleano que indica se a palavra é válida ou não
 */
export function isPossibleNameOfVariable(word) {
    return (
        !knownCommands.includes(word) &&
        !knownDefinitions.includes(word) &&
        !knownOperators.includes(word) &&
        !knownComparisons.includes(word) &&
        !getNotAcceptedSpecialCharacters().test(word) &&
        !startsWithOrOnlyNumber(word));
}

export function isDeclaration(token) {
    return token.startsWith('inteiro') || token.startsWith('real') || token.startsWith('texto') || token.startsWith('logico') || token.startsWith('caractere');
}

export function validateTyping(declaration, value) {

    // se for uma declaração de array chama a função recursivamente para cada elemento do array
    if(isArrayDeclaration(value)){
        const elements = getElementsOfArray(value);
        elements.forEach(element => {
            if(!validateTyping(declaration, element)){
                return false;
            }
        });
        return true;
    }

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
