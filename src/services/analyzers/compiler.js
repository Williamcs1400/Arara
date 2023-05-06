import {lexicalAnalyze} from './scanner/scanner.js';
import {semanticAnalyzer} from './semantic/semanticAnalyzer.js';
import {getKnownDefinitions, isDeclaration} from './definitions/dictionary.js';
import {syntacticAnalyze} from "./parsing/parser";
import {removeCodeExpression} from "../utils/codeFixer";

let code;

export function setCodeFromEditor(c) {
    code = c;
}

export function Compiler() {

    // analise léxica para saber se o código está vazio
    if(code === undefined){
        return {sucess: false, message: 'Erro | O código não foi definido'};
    }

    // pre processa o código para retirar comentários e salvar as definições
    const preProcessingResult = preProcessing();

    // retirando quebras de linha e fazendo a string resultante virar um array de tokens (separados por ';')
    const tokens = preProcessingResult.preProcessingCode.replaceAll('\n', '').split(';')

    // array de declarações de variáveis
    const declarationVariables = [];
    const useVariables = [];
    try {

        // analise léxica completa
        tokens.forEach(token => {
            if (token !== '') {
                lexicalAnalyze(token, preProcessingResult.definitions);
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
                    }else if(response.action === 'assignment'){
                        const name = response.name;
                        if(name !== undefined && name !== '') {
                            useVariables.push({name, order, value: response.value});
                        }
                    }
                }
                order++;
            }
        });

        // semantic analyze
        semanticAnalyzer(preProcessingResult.preProcessingCode, declarationVariables, useVariables, preProcessingResult.defAndTypes);
        return {sucess: true, message: 'Compilação realizada com sucesso!', executableCode: exportExecutableCode(preProcessingResult.preProcessingCode)};

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
            // se for concatenação, retorna um array de "escrevas" na tela
            if(token.startsWith('escreva') && token.indexOf(",") !== -1) {
                const newObject = dismemberEscrevaConcat(token);
                newObject.forEach(object => {
                    executableCode.push(object);
                });
            }else {
                executableCode.push(token);
            }
        }
    });

    return executableCode;
}

function preProcessing(){
    const newCode = code.split('\n');
    const definitions = [];
    const defAndTypes = [];

    newCode.forEach((line, index) => {
       if(line.indexOf('//') !== -1){
           line = line.substring(0, line.indexOf('//'));
           newCode[index] = line.trimStart().trimEnd();
       }
       if(line !== '' && line !== undefined && isDeclaration(line)){
           const declaration = line.substring(0, line.indexOf(' ')).trim();

           if(line.indexOf('=') !== -1){
               line = line.split("=")[0].substring(removeCodeExpression(declaration).length + 1, line.length).trim();
           }else if(line.indexOf(';') !== -1){
               line = line.split(";")[0].substring(removeCodeExpression(declaration).length + 1, line.length).trim();
           }
           definitions.push(line);
           defAndTypes.push({declaration, line});
       }
    });

    return {preProcessingCode: newCode.join('\n'), definitions, defAndTypes};
}

// retorna um array de tokens para escrever na tela quando for concatenação
function dismemberEscrevaConcat(object){
    const name = object.substring(object.indexOf('(') + 1, object.lastIndexOf(')'));
    const parts = name.split(',');
    const newObject = [];

    parts.forEach(part => {
        if(part !== ''){
            part = part.indexOf("'") !== -1 ? part : part.trimStart().trimEnd();
            newObject.push('escreva(' + part + ')');
        }
    });

    return newObject;
}
