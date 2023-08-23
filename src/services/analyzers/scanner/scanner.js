import {isCommand, isDefinition} from '../definitions/dictionary.js';
import {validateComparison} from "../parsing/validateConditional";

/*
    Analisador léxico
    Verifica se o token é um definição/comando conhecido com base no dicionário da linguagem
 */
export function lexicalAnalyze(token, codeDefinitions) {

    // se o token iniciar com '#' e não for uma definição, então é uma definição desconhecida
    if(startsWithHash(token) && !isDefinition(token)){
        throw new Error('Erro léxico | Definição desconhecida: ' + token);
    }

    // verifica se o token é a instrução 'para'
    // se for, então transforma em um enquanto
    if(token.replaceAll(' ', '').startsWith('para(')){
        const teste = token.split('(')[1];
        const teste1 = teste.split(')')[0];
        const teste2 = teste1.split(';');

        validateFirstPartPara(teste2[0], codeDefinitions);
        validateComparison(teste2[1]);
        validateSecondPartPara(teste2[2]);

        return transformParaEmEnquanto(teste2, token)
    }

    // verifica se o token é um comando
    if(!startsWithHash(token) && !isCommand(token) && !codeDefinitions.includes(getVariableName(token))) {
        throw new Error('Erro léxico | Comando desconhecido: ' + token);
    }

    return null
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

/*
 * Analisador da primeira parte do comando 'para'
 * Verifica se é uma declaração, atribuição ou vazio - caso contrário, é um erro
 * @param token: token a ser analisado
 * @param codeDefinitions: definições do código
 *
 * @return: true se for uma declaração, atribuição ou vazio
 */
function validateFirstPartPara(token, codeDefinitions){
    if(token === ''){
        return true;
    }

    if(!startsWithHash(token) && !isCommand(token) && !codeDefinitions.includes(getVariableName(token))) {
        throw new Error('Erro léxico | Comando desconhecido: ' + token);
    }
}

/*
 * Analisador da segunda parte do comando 'para'
 * Verifica se é uma iteração
 * @param token: token a ser analisado
 *
 * @return: true se for uma iteração
 */

// TODO: implementar isso aqui
function validateSecondPartPara(token){
    return true;
}

/*
 * Transforma o código para em um códido enquanto
 * @param token: token a ser transformado
 *
 * @return: código transformado
 */

function transformParaEmEnquanto(arrayTokens, token){
    const content = token.substring(token.indexOf('{'), token.length - 1);
    const newTokens = [];

    newTokens.push(arrayTokens[0]);
    newTokens.push('enquanto(' + arrayTokens[1] + ')' + content + arrayTokens[2] + ';}');

    return newTokens;
}