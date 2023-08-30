
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