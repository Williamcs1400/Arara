import {isCommand, isDefinition} from '../definitions/dictionary.js';

/*
    Analisador léxico
    Verifica se o token é um definição/comando conhecido com base no dicionário da linguagem
 */
export function lexicalAnalyze(token, codeDefinitions) {

    // se o token iniciar com '#' e não for uma definição, então é uma definição desconhecida
    if(startsWithHash(token) && !isDefinition(token)){
        throw new Error('Erro léxico | Definição desconhecida: ' + token);
    }

    // verifica se o token é um comando
    if(!startsWithHash(token) && !isCommand(token) && !codeDefinitions.includes(getVariableName(token))) {
        throw new Error('Erro léxico | Comando desconhecido: ' + token);
    }
}

// verifica se o token inicia com '#' (definição)
function startsWithHash(token) {
    return token.substring(0,1) === '#';
}

// remove o restante da atribuição de valor
function getVariableName(token){
    if(token.indexOf('=') !== -1){
        return token.split('=')[0].trim();
    }
    return token;
}