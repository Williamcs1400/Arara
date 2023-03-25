import React, {useState} from 'react';

import {lexicalAnalyze} from './lexing/lexicalAnalyzer.js';
import {semanticAnalyzer} from './semantic/semanticAnalyzer.js';

let code;

export function setCodeFromEditor(c) {
    code = c;
}

export function Compiler() {

    // lexical analyze
    if(code === undefined){
        return {sucess: false, message: 'Erro léxico | O código não foi definido'};
    }

    const tokens = code.replaceAll('\n', '').split(';')
    try {
        tokens.forEach(token => {
            if (token !== '') {
                lexicalAnalyze(token + ';');
            }
        });

        // syntactic analyze
        // TODO: implement syntactic analyze

        // semantic analyze
        try {
            semanticAnalyzer(code);
            return {sucess: true, message: 'Compilação realizada com sucesso!'};

        } catch (error) {
            return {sucess: false, message: '' + error};
        }

    } catch (error) {
        return {sucess: false, message: '' + error};
    }
}

function callLexical(){

}
