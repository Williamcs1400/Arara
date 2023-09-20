import {lexicalAnalyze} from './scanner/scanner.js';
import {semanticAnalyzer} from './semantic/semanticAnalyzer.js';
import {getKnownDefinitions, isDeclaration} from './definitions/dictionary.js';
import {syntacticAnalyze} from "./parsing/parser";
import {removeCodeExpression} from "../utils/codeFixer";
import {cleanWhiteSpacesAllowed, removeStringForWriteCommand} from "../utils/util";
import {defaultCode} from "../utils/definitions";

let codeEditor = '';

let codeExample;

// redefine o código do editor
export function setCodeFromEditor(c) {
    codeEditor = c;
}

// retorna o código do editor - se estiver vazio, retorna o código padrão
export function getCodeFromEditor() {
    if(codeEditor === undefined || codeEditor === ''){
        return defaultCode;
    }
    return codeEditor;
}

// redefine o código do exemplo - documentação
export function setCodeExample(c) {
    codeExample = c;
}

// retorna o código do exemplo - documentação
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
    const preProcessingResult = isScope ? code : preProcessing(code);

    // retirando quebras de linha
    let tokens = isScope ? code.preProcessingCode : generateTokens(preProcessingResult.preProcessingCode);

    // array de declarações de variáveis
    const declarationVariables = [];
    const useVariables = [];
    try {

        let result;
        let arrayTemp = [];
        // analise léxica completa
        for(let i = 0; i < tokens.length; i++){
            if (tokens[i] !== '') {
                try {
                    result = lexicalAnalyze(tokens[i], preProcessingResult.definitions);
                    // utilizada somente para a transformação do 'para' em 'enquanto'
                    if (result !== null && result !== undefined) {
                        const part1 = tokens.slice(0, i);
                        const part2 = tokens.slice(i + 1, tokens.length);

                        part1.push(...result);
                        arrayTemp.push(...result);
                        part1.push(...part2);

                        tokens = part1;
                    }
                } catch (error) {
                    // para nao capturar erros falsos do 'para' transformado em 'enquanto'
                    if(!isScope)
                        throw new Error(error.message);
                }
            }
        }

        // atualiza o código pre processado com o 'para' transformado em 'enquanto'
        if(arrayTemp.length > 0)
            preProcessingResult.preProcessingCode = paraToEnqunto(arrayTemp, preProcessingResult.preProcessingCode);

        // syntactic analyze
        let order = 0;
        const previousTokens= preProcessingResult;
        previousTokens.tokens = [];
        tokens.forEach(token => {
            if (token !== '') {
                const response = syntacticAnalyze(token, previousTokens);
                previousTokens.tokens.push(token);

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

                    // se for while, adiciona no array de uso com a condição
                    else if(response.action === 'while'){
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
        if(isScope)
            return {sucess: true, message: 'Compilação realizada com sucesso!', executableCode: null};
        return {sucess: true, message: 'Compilação realizada com sucesso!', executableCode: exportExecutableCode(preProcessingResult.preProcessingCode)};

    } catch (error) {
        return {sucess: false, message: '' + error, executableCode: null};
    }
}

/*
 * Função que gera um array de instruções a serem interpretadas pelo o executor
 * @param code: código a ser compilado
 * retorna um array de objetos com o token e o conteúdo (se houver)
 */
function exportExecutableCode(code) {
    const executableCode = [];

    // retirando quebras de linha e fazendo a string resultante virar um array de tokens (separados por ';')
    const tokens = generateTokens(code);

    tokens.forEach(token => {
        if (token !== '' && !getKnownDefinitions().includes(token)) {
            // se for concatenação, retorna um array de "escrevas" na tela, removeStringForWriteCommand para
            // ignorar vírgulas entre aspas simples
            if(token.startsWith('escreva') && removeStringForWriteCommand(token).indexOf(",") !== -1) {
                const newObject = dismemberEscrevaConcat(token);
                newObject.forEach(object => {
                    executableCode.push({token: object, content: null});
                });
            }
            // se for uma instrução com escopo, retorna o token e o conteúdo
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
 * Função que transforma o comando 'para' em um 'enquanto'
 * @param tokens: array de tokens do comando 'para'
 * @param code: código a ser compilado
 * @return: código com o comando 'para' transformado em 'enquanto'
 */
function paraToEnqunto(tokens, code){
    let newCode = '';
    for(let i = 0; i < tokens.length; i = i + 2){
        const part1 = code.substring(0, code.indexOf('para('));
        const part2 = code.substring(code.indexOf('para(') + 5, code.length);
        const part3 = part2.substring(code.indexOf('}') + 1, code.length);

        if(newCode === '') {
            newCode += part1 + tokens[i] + ';' + tokens[i + 1];
        }else
            newCode += tokens[i] + ';' + tokens[i + 1] + part3;
    }

    if(newCode.indexOf('#FIM_PROGRAMA;') === -1){
        newCode += '#FIM_PROGRAMA;';
    }

    return newCode.replaceAll('\n', '');
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

/*
 * Função que desmembra o comando escreva com concatenação
 * Retorna um array de "escreva" na tela
 * @param object: comando escreva com concatenação
 * Exemplo: escreva('Valor inteiro: ', num);
 * Retorna: ['escreva('Valor inteiro: ')', 'escreva(num)']
 */
function dismemberEscrevaConcat(object){
    const name = object.substring(object.indexOf('(') + 1, object.lastIndexOf(')'));
    // split por virgula, mas não dentro de aspas simples
    const parts = name.split(/,(?=(?:(?:[^']*'){2})*[^']*$)/);
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
export function generateTokens(code) {
    const preTokens = code.replaceAll('\n', '');

    const aux = preTokens.split('');
    let tokens = [];
    let token = '';
    let flagBracesOpen = false;
    aux.forEach((char) => {
        if(char === '{'){
            flagBracesOpen = true;
        }
        if(char === ';' && !flagBracesOpen){
            tokens.push(token + ';');
            token = '';
        }
        else if(char === '}'){
            tokens.push(token + char + ';');
            token = '';
            flagBracesOpen = false;
        }
        else{
            token += char;
        }
    });

    // agrupar a instrução 'para' caso exista, além de remover ';' do final
    for(let i = 0; i < tokens.length; i++) {
        try {

            if (tokens[i].startsWith('para')) {
                // agrupa os tokens do escopo
                const part1 = tokens.slice(0, i);
                const part2 = tokens.slice(i, i + 3);
                const part3 = tokens.slice(i + 3, tokens.length);

                // insere o código que será executado no ponto onde o se estava
                let forInstruction = '';
                part2.forEach(p => {
                    forInstruction += p;
                });
                forInstruction = forInstruction.substring(0, forInstruction.length - 1);
                part1.push(forInstruction);
                part1.push(...part3);

                tokens = part1;
            } else {
                // remove o ';' do final
                tokens[i] = tokens[i].substring(0, tokens[i].length - 1);
            }

        } catch (error) {
            console.log(error)
        }
    }

    return tokens;
}
