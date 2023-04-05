import {useState} from "react";
import {ExecutableActionType} from "./definitions/actionTypes";
export function executor(token) {
    if (token.startsWith('escreva')) {
        return {actionType: ExecutableActionType.writing, value: getValueOfWriting(token)};

    } else {
        return {actionType: null, value: null};
    }
}

function getValueOfWriting(token) {
    // recuperar o valor entre (' e ')
    return token.substring(token.indexOf("('") + 2, token.lastIndexOf("')"));
}