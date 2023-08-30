import {executeOperation, executor} from "../analyzers/executor";
import {ExecutableActionType} from "../analyzers/definitions/actionTypes";
import {compilerFromCodeEditor} from "../analyzers/compiler";
import {removeArrayDeclaration} from "../analyzers/definitions/dictionary";
import {getElementsOfArray, getPointerOfArray, isArrayDeclaration} from "../utils/util";

/*
 * Este método é o resposnável por iniciar o teste de uma solução de um aluno
 * com base nos casos de teste cadastrados pelo professor.
 * @param testCases: Casos de teste cadastrados pelo professor
 * @param studentCode: Código fonte da solução do aluno
 */
export async function startTest(testCases) {
    const compilerResult = compilerFromCodeEditor();

    let qtdHits = 0;
    let flagHit = false;
    const qtdTests = testCases.length;
    const results = [];

    testCases.forEach((testCase, index) => {
        flagHit = false;
        let testCaseInputs = [...testCase.inputs]

        let result = executeCode(testCaseInputs, compilerResult.executableCode)

        if (result === testCase.output) {
            qtdHits++;
            flagHit = true;
        }
        results.push(buildResults(testCase.inputs, testCase.output, result, flagHit));
    });

    if(qtdHits === qtdTests) {
        return {success: true, detail: 100}
    }else{
        const percent = (qtdHits * 100) / qtdTests;
        return {success: false, detail: Number(percent.toFixed(2)), results: results}
    }

}

/*
    * Este método é o resposnável por executar o código fonte de uma solução de um aluno
    * com base nos casos de teste cadastrados pelo professor.
    * @param inputArray: Entrada do caso de teste
    * @param executableCode: Código fonte da solução do aluno
 */
function executeCode(inputArray, executableCode) {
    let aux = '';
    let valueVariables = [];
    let result = '';
    let response;
    let lastResponse = null;
    let flagCondition = false;

    if (executableCode !== undefined && executableCode.length > 0) {
        for (let i = 0; i < executableCode.length; i++) {

            if (i > 0) {
                response = executor(executableCode[i], valueVariables, lastResponse);
            } else {
                response = executor(executableCode[i], valueVariables, null);
            }

            if(executableCode[i].token.startsWith('se(') || executableCode[i].token.startsWith('senao se(') || executableCode[i].token.startsWith('senao(')) {
                // lastResponse = response;
            }else if(lastResponse !== null && lastResponse.subCode.includes(executableCode[i].token)){
                flagCondition = true;
            }else{
                lastResponse = null;
            }

            // Escrita no terminal
            if (response.actionType === ExecutableActionType.writing) {
                // Verifica se o valor é uma string ou uma variável
                if (response.type === 'string') {
                    if (response.value.indexOf('\\n') !== -1) {
                        for (let i = 0; i < response.value.length; i++) {
                            if (response.value[i] === '\\' && response.value[i + 1] === 'n') {
                                aux += '\n';
                                i++;
                            } else {
                                aux += response.value[i];
                            }
                        }
                    } else {
                        aux += response.value;
                    }
                    // Verifica se o valor é uma variável
                } else if (response.type === 'variable') {
                    // Verifica se a variável é um array
                    if(isArrayDeclaration(response.value)){
                        for(let i = 0; i < valueVariables.length; i++){
                            if(removeArrayDeclaration(valueVariables[i].name) === response.value.split('[')[0]){
                                const index = response.value.replaceAll(' ', '').split('[')[1].split(']')[0];
                                const array = valueVariables[i].value.replace('[', '').replace(']', '').split(',');

                                // verifica se o index é uma variável ou um número
                                if(isNaN(index)){
                                    for(let j = 0; j < valueVariables.length; j++){
                                        if(valueVariables[j].name === index){
                                            aux += array[Number(valueVariables[j].value)];
                                        }
                                    }
                                }else{
                                    aux += array[index];
                                }
                            }
                        }
                    }
                    for (let i = 0; i < valueVariables.length; i++) {
                        if (valueVariables[i].name === response.value) {
                            aux += valueVariables[i].value;
                        }
                    }
                }
                result += aux;
            }

            // Leitura do terminal
            if (response.actionType === ExecutableActionType.reading) {
                let exists = false;
                for (let i = 0; i < valueVariables.length; i++) {
                    if (removeArrayDeclaration(valueVariables[i].name) === removeArrayDeclaration(response.value)) {
                        if(isArrayDeclaration(inputArray[0])) {
                            const index = getPointerOfArray(inputArray[0]);
                            const array = getElementsOfArray(valueVariables[i].value);

                            if(isNaN(index)){
                                for(let j = 0; j < valueVariables.length; j++){
                                    if(valueVariables[j].name === index){
                                        aux = array[Number(valueVariables[j].value)];
                                    }
                                }
                            }else{
                                aux = array[index];
                            }

                            valueVariables[i].value = '[' + array + ']';
                            inputArray.shift()
                        }else {
                            valueVariables[i].value = inputArray[0];
                            inputArray.shift()
                        }
                        exists = true;
                    }
                }

                if (!exists) {
                    valueVariables.push({name: response.value, value: inputArray[0]});
                    inputArray.shift()
                }
            }

            // Atribuição de valor a variável
            if (response.actionType === ExecutableActionType.assignment) {
                let exists = false;
                for (let i = 0; i < valueVariables.length; i++) {
                    if (removeArrayDeclaration(valueVariables[i].name) === removeArrayDeclaration(response.variable)) {
                        if(isArrayDeclaration(valueVariables[i].value) || isArrayDeclaration(response.variable)){
                            let index = getPointerOfArray(response.variable);
                            const array = getElementsOfArray(valueVariables[i].value);

                            if(isNaN(index)){
                                for(let j = 0; j < valueVariables.length; j++){
                                    if(valueVariables[j].name === index){
                                        index = valueVariables[j].value;
                                    }
                                }
                            }

                            // verifica se o index é uma variável ou um número
                            array[index] = response.value;
                            valueVariables[i].value = '[' + array + ']';
                        }else {
                            valueVariables[i].value = response.value;
                        }
                        exists = true;
                    }
                }

                if (!exists) {
                    valueVariables.push({name: response.variable, value: response.value, type: response.type});
                }
            }

            // Operações matemáticas
            if (response.actionType === ExecutableActionType.operation) {
                const operations = response.value;
                operations.forEach((operation, index) => {
                    valueVariables.forEach((variable) => {
                        if (operation === variable.name) {
                            if (variable.value === undefined || variable.value === '') {
                                operations[index] = 0;
                            } else {
                                operations[index] = variable.value;
                            }
                        }else if(removeArrayDeclaration(operation) === removeArrayDeclaration(variable.name)){
                            if (variable.value === undefined || variable.value === '') {
                                operations[index] = 0;
                            } else {
                                const values = getElementsOfArray(variable.value);
                                let index = getPointerOfArray(operation);

                                if(isNaN(index)){
                                    for(let j = 0; j < valueVariables.length; j++){
                                        if(valueVariables[j].name === index){
                                            index = valueVariables[j].value;
                                        }
                                    }
                                }
                                operations[index] = values[index];
                            }
                        }
                    });
                });
                const value = executeOperation(operations, response.order);
                for (let i = 0; i < valueVariables.length; i++) {
                    if (valueVariables[i].name === response.variable) {
                        valueVariables[i].value = value;
                    }
                }
            }

            // Condicional
            if (response.actionType === ExecutableActionType.loop) {
                if(!flagCondition)
                    lastResponse = response;
                if(response.value){
                    // Se a condição for verdadeira, executa o código dentro do if
                    const executableCodeAux = []
                    // monta o código que será executado
                    response.subCode.forEach((code) => {
                        executableCodeAux.push({token: code, content: null, subContent: true});
                    });

                    // remove a instrução se já processada
                    const part1 = executableCode.slice(0, i);
                    const part2 = executableCode.slice(i + 1, executableCode.length);

                    // insere o código que será executado no ponto onde o se estava
                    const exeAux = [{token: null, content: null}];
                    part1.push(...exeAux);
                    part1.push(...executableCodeAux);
                    part1.push(...part2);

                    executableCode = part1;
                }
            }

            // Repetição
            if (response.actionType === ExecutableActionType.loop) {
                if(response.value){
                    const executableCodeAux = []
                    // monta o código que será executado
                    response.subCode.forEach((code) => {
                        executableCodeAux.push({token: code, content: null, subContent: true});
                    });

                    // remove a instrução se já processada
                    const part1 = executableCode.slice(0, i);
                    const part2 = executableCode.slice(i + 1, executableCode.length);

                    // insere o código que será executado no ponto onde o se estava
                    const exeAux = [{token: null, content: null}];
                    part1.push(...exeAux);
                    part1.push(...executableCodeAux);
                    part1.push(response.tokenLoop)
                    part1.push(...part2);

                    executableCode = part1;
                }
            }

        }
    }
    return result;
}

function buildResults(inputs, expectedOutput, output, hit) {
    return {
        input: inputs,
        expectedOutput: expectedOutput,
        output: output,
        ok: hit
    }
}