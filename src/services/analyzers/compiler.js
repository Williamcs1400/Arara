import {lexicalAnalyze} from './scanner/scanner.js';
import {semanticAnalyzer} from './semantic/semanticAnalyzer.js';
import {getKnownDefinitions, isDeclaration} from './definitions/dictionary.js';
import {syntacticAnalyze} from "./parsing/parser";
import {removeCodeExpression} from "../utils/codeFixer";
import {cleanWhiteSpacesAllowed} from "../utils/util";
import {defaultCode} from "../utils/definitions";

let codeEditor = '';

let codeExample;

export function setCodeFromEditor(c) {
    codeEditor = c;
}

export function getCodeFromEditor() {
    if(codeEditor === undefined || codeEditor === ''){
        return defaultCode;
    }
    return codeEditor;
}

export function setCodeExample(c) {
    codeExample = c;
}

export function getCodeExample() {
    return codeExample;
}

/*
 * função que compila o código do editor
 */
export function compilerFromCodeEditor() {
    return compiler(codeEditor, false)
}

/*
 * função que compila subtrecho de código (escopo)
 * @param code: código a ser compilado (subtrecho)
 */
export function compilerFromScope(code) {
    return compiler(code, true)
}

/*
 * Função que compila o código
 * Retorna um objeto com a mensagem de sucesso ou erro
 * @param code: código a ser compilado
 * @param isScope: booleano que indica se é um subtrecho de código (escopo) ou não - usado para ignorar algumas verificações
*/
export function compiler(code, isScope) {
    // analise léxica para saber se o código está vazio
    if(code === undefined){
        return {sucess: false, message: 'Erro | O código não foi definido'};
    }

    // pre processa o código para retirar comentários e salvar as definições
    const preProcessingResult = preProcessing(code);

    // retirando quebras de linha
    const tokens = generateTokens(preProcessingResult.preProcessingCode);

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
                    // se for declaração, adiciona no array de declarações
                    if(response.action === 'declaration'){
                        const name = response.name;
                        declarationVariables.push({name, order});
                    }

                    // se for leitura ou escrita, adiciona no array de uso
                    else if(response.action === 'read' || response.action === 'write'){
                        const name = response.name;
                        if(name !== undefined && name !== '') {
                            useVariables.push({name, order});
                        }
                    }

                    // se for atribuição, adiciona no array de uso com o novo valor
                    else if(response.action === 'assignment'){
                        const name = response.name;
                        if(name !== undefined && name !== '') {
                            useVariables.push({name, order, value: response.value});
                        }
                    }

                    // se for if, adiciona no array de uso com a condição
                    else if(response.action === 'if'){
                        response.variables.forEach(variable => {
                            useVariables.push({name: variable, order});
                        });
                    }
                }
                order++;
            }
        });

        // semantic analyze
        semanticAnalyzer(preProcessingResult.preProcessingCode, declarationVariables, useVariables, preProcessingResult.defAndTypes, isScope);
        return {sucess: true, message: 'Compilação realizada com sucesso!', executableCode: exportExecutableCode(preProcessingResult.preProcessingCode)};

    } catch (error) {
        return {sucess: false, message: '' + error, executableCode: null};
    }
}

function exportExecutableCode(code) {
    const executableCode = [];

    // retirando quebras de linha e fazendo a string resultante virar um array de tokens (separados por ';')
    const tokens = generateTokens(code);

    tokens.forEach(token => {
        if (token !== '' && !getKnownDefinitions().includes(token)) {
            // se for concatenação, retorna um array de "escrevas" na tela
            if(token.startsWith('escreva') && token.indexOf(",") !== -1) {
                const newObject = dismemberEscrevaConcat(token);
                newObject.forEach(object => {
                    executableCode.push({token: object, content: null});
                });
            }
            else if(token.indexOf('{') !== -1 && token.indexOf('}') !== -1){
                const content = token.substring(token.indexOf('{') + 1, token.lastIndexOf('}'));
                const resp = exportExecutableCode(content);
                const final = [];
                resp.forEach(r => {
                    final.push(r.token);
                });
                executableCode.push({token: token.substring(0, token.indexOf('{') + 1), content: final});
            }
            else {
                executableCode.push({token: token, content: null});
            }
        }
    });

    return executableCode;
}

/*
 * Função que pre processa o código
 * Retorna um objeto com o código sem comentários e um array de definições
 * Remove espaços em branco desnecessários
 * @param code: código a ser compilado
 */
function preProcessing(code){
    code = cleanWhiteSpacesAllowed(code);
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

/*
 * Função que gera um array de tokens a partir do código
 * Cada token é uma instrução
 * Instruções simples terminam com ';' (não vai ter ';' dentro do token)
 * Instruções com escopo terminam com '}' (vai ter '}' dentro do token)
*/
function generateTokens(code) {
    const preTokens = code.replaceAll('\n', '');

    const aux = preTokens.split('');
    const tokens = [];
    let token = '';
    let flagBracesOpen = false;
    aux.forEach((char) => {
        if(char === '{'){
            flagBracesOpen = true;
        }
        if(char === ';' && !flagBracesOpen){
            tokens.push(token);
            token = '';
        }
        else if(char === '}'){
            tokens.push(token + char);
            token = '';
            flagBracesOpen = false;
        }
        else{
            token += char;
        }
    });

    return tokens;
}
