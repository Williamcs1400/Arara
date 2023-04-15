import {useState} from "react";
import {ExecutableActionType} from "./definitions/actionTypes";

//
export function executor(token) {
    if (token.startsWith('escreva')) {
        const response = getValueOfWriting(token);
        return {actionType: ExecutableActionType.writing, value: response.value, type: response.type};

    } else if(token.startsWith('leia')) {
        return {actionType: ExecutableActionType.reading, value: getValueOfReading(token)};
    }
    else {
        return {actionType: null, value: null};
    }
}

// retorna o valor entre (' e ') para escrever na tela
function getValueOfWriting(token) {
    // recuperar o valor entre (' e ') ou entre ( e )
    if(token.indexOf('\'') === -1){
        return {value: token.substring(token.indexOf('(') + 1, token.lastIndexOf(')')), type: 'variable'};
    }
    else {
        return {value: token.substring(token.indexOf('\'') + 1, token.lastIndexOf('\'')), type: 'string'};
    }
}

// recupera o nome da variável para ler o valor do teclado
function getValueOfReading(token) {
    return token.substring(token.indexOf('(') + 1, token.indexOf(')'));
}
