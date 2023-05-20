import {Compiler, setCodeFromEditor} from "../analyzers/compiler";
import {examaple} from "./definitions";
import {executeOperation, executor} from "../analyzers/executor";
import {ExecutableActionType} from "../analyzers/definitions/actionTypes";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firabaseConfig";

// TODO:
// Apenas para salvar o mock da funcionalidade de correção
// Deve ser apagado depois da total implementação
export async function startTest() {
    // números inteiros positivos - isso vai ser definido pelo usuário
    let name = 'testeTriangulo';
    let scope = [1, 1000]
    let qtdCases = 100;
    let qtdVariables = 2;
    let testCases = [];

    for (let i = 0; i < qtdCases; i++) {
        let testCase = [];
        for (let j = 0; j < qtdVariables; j++) {
            testCase.push(Math.floor(Math.random() * (scope[1] - scope[0] + 1)) + scope[0]);
        }
        testCases.push(testCase);
    }

    setCodeFromEditor(examaple);

    const compilerResult = Compiler();
    const save = JSON.parse(JSON.stringify(testCases));
    const results = [];
    testCases.forEach((testCase, index) => {
        const result = executeCode(testCase, compilerResult.executableCode)
        console.log(JSON.stringify(save[index]) + ' -> ' + result);
        results.push(result);
    });

    const result = executeCode([5, 5], compilerResult.executableCode)
    console.log('result', result);

    for(let i = 0; i < results.length; i++){
        try {
            const docRef = await addDoc(collection(db, name), {
                inputs: Array.from(save[i]),
                output: results[i]
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

}

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