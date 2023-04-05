import {lexicalAnalyze} from './lexing/lexicalAnalyzer.js';
import {semanticAnalyzer} from './semantic/semanticAnalyzer.js';
import {getKnownDefinitions} from './definitions/dictionary.js';
import {syntacticAnalyze} from "./parsing/parser";

let code;

export function setCodeFromEditor(c) {
    code = c;
}

export function Compiler() {

    // analise léxica para saber se o código está vazio
    if(code === undefined){
        return {sucess: false, message: 'Erro léxico | O código não foi definido'};
    }

    // retirando quebras de linha e fazendo a string resultante virar um array de tokens (separados por ';')
    const tokens = code.replaceAll('\n', '').split(';')
    try {

        // analise léxica completa
        tokens.forEach(token => {
            if (token !== '') {
                lexicalAnalyze(token);
            }
        });

        // syntactic analyze
        tokens.forEach(token => {
            if (token !== '') {
                syntacticAnalyze(token);
            }
        });

        // semantic analyze
        semanticAnalyzer(code);
        return {sucess: true, message: 'Compilação realizada com sucesso!', executableCode: exportExecutableCode(code)};

    } catch (error) {
        return {sucess: false, message: '' + error, executableCode: null};
    }
}

function exportExecutableCode(code) {
    const executableCode = [];

    // retirando quebras de linha e fazendo a string resultante virar um array de tokens (separados por ';')
    const tokens = code.replaceAll('\n', '').split(';')

    tokens.forEach(token => {
        if (token !== '' && !getKnownDefinitions().includes(token)) {
            executableCode.push(token);
        }
    });

    return executableCode;
}
