import {getKnownOperators} from "../analyzers/definitions/dictionary";

export function convertDateHour(seconds) {
    return new Date(seconds * 1000).toTimeString().split(' ')[0] + ' ' + new Date(seconds * 1000).toLocaleDateString('pt-BR');
}

/*
 * Remove os espaços em branco de um string com múltiplas linhas, mas não remove os espaços em branco entre as palavras
 * de uma string entre aspas simples
 * @param {string} code
 */
export function cleanWhiteSpacesAllowed(code){
    const newCode = code.split('\n');
    const newCodeWithoutSpaces = [];

    newCode.forEach(line => {
        if(line.indexOf('//') !== -1){
            line = line.substring(0, line.indexOf('//'));
            newCodeWithoutSpaces.push(line.trimStart().trimEnd());
        }else {
            newCodeWithoutSpaces.push(line.trimStart().trimEnd());
        }
    });

    return newCodeWithoutSpaces.join('\n');
}

export function isArrayDeclaration(token){
    if(token.indexOf('[') !== -1 &&  token.indexOf(']') !== -1)
        return token.split('[').length - 1 === 1 && token.split(']').length - 1 === 1;
    return false;
}

export function getElementsOfArray(token){
    return token.substring(token.indexOf('[') + 1, token.indexOf(']')).split(',');
}

export function getPointerOfArray(token){
    return token.replaceAll(' ', '').substring(token.indexOf('[') + 1, token.indexOf(']'));
}

export function getSizeOfArray(token){
    return Number(token.replaceAll(' ', '').substring(token.indexOf('['), token.indexOf(']') - 1));
}

// remove o conteúdo entre aspas simples
export function removeStringForWriteCommand(token){
    const regex = /'[^']*'/g;
    return token.replaceAll(regex, '');
}

// retorna quantidade de vezes que um token aparece em uma instrução
export function getLengthTokenInInstruction(token, instruction){
    const regex = new RegExp('\\b' + token + '\\b', 'g');
    return instruction.match(regex).length;
}

// retorna quantidade de operadores na instrução
export function validateLengthOperatorsInInstruction(instruction){
    // regex para encontrar os operadores na instrução + - * /
    if(instruction.indexOf('+') === -1 && instruction.indexOf('-') === -1 && instruction.indexOf('*') === -1 && instruction.indexOf('/') === -1)
        return 0;

    const regex = /([+\-*/])/g;
    return instruction.match(regex).length;
}