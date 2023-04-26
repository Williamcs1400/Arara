import {lexicalAnalyze} from './scanner/scanner.js';
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

    // array de declarações de variáveis
    const declarationVariables = [];
    const useVariables = [];
    try {

        // analise léxica completa
        tokens.forEach(token => {
            if (token !== '') {
                lexicalAnalyze(token);
            }
        });

        // syntactic analyze
        let order = 0;
        tokens.forEach(token => {
            if (token !== '') {
                const response = syntacticAnalyze(token);
                if (response !== null && response !== undefined) {
                    if(response.action === 'declaration'){
                        const name = response.name;
                        declarationVariables.push({name, order});
                    }else if(response.action === 'read' || response.action === 'write'){
                        const name = response.name;
                        if(name !== undefined && name !== '') {
                            useVariables.push({name, order});
                        }
                    }
                }
                order++;
            }
        });

        // semantic analyze
        semanticAnalyzer(code, declarationVariables, useVariables);
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
