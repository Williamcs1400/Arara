import {executeOperation, executor} from "../analyzers/executor";
import {ExecutableActionType} from "../analyzers/definitions/actionTypes";
import {Compiler} from "../analyzers/compiler";

/*
 * Este método é o resposnável por iniciar o teste de uma solução de um aluno
 * com base nos casos de teste cadastrados pelo professor.
 * @param testCases: Casos de teste cadastrados pelo professor
 * @param studentCode: Código fonte da solução do aluno
 */
export async function startTest(testCases) {
    const compilerResult = Compiler();

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

    if (executableCode !== undefined && executableCode.length > 0) {
        executableCode.forEach((executable, index) => {
            const response = executor(executable);

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
                    if (valueVariables[i].name === response.value) {
                        valueVariables[i].value = inputArray[0];
                        inputArray.shift()
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
                    if (valueVariables[i].name === response.variable) {
                        valueVariables[i].value = response.value;
                        exists = true;
                    }
                }

                if (!exists) {
                    valueVariables.push({name: response.variable, value: response.value});
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
        });
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