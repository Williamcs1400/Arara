import {useState} from "react";
import {ExecutableActionType} from "./definitions/actionTypes";

//
export function executor(token) {
    if (token.startsWith('escreva')) {
        return {actionType: ExecutableActionType.writing, value: getValueOfWriting(token)};

    } else if(token.startsWith('leia')) {
        return {actionType: ExecutableActionType.reading, value: getValueOfReading(token)};
    }
    else {
        return {actionType: null, value: null};
    }
}

// retorna o valor entre (' e ') para escrever na tela
function getValueOfWriting(token) {
    // recuperar o valor entre (' e ')
    return token.substring(token.indexOf("('") + 2, token.lastIndexOf("')"));
}

// recupera o nome da variável para ler o valor do teclado
function getValueOfReading(token) {
    return token.substring(token.indexOf('(') + 1, token.indexOf(')'));
}
