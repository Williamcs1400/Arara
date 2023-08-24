import {ExecutableActionType} from "./definitions/actionTypes";
import {containsOperator, isDeclaration, isOperator} from "./definitions/dictionary";

// executa o código gerado pelo compilador linha a linha
export function executor(token, valueVariables, lastComparison) {
    return execute(token.token, token.content, valueVariables, lastComparison);
}

function execute(token, content, valueVariables, lastComparison) {
    if (token.startsWith('escreva')) {
        const response = getValueOfWriting(token);
        return {actionType: ExecutableActionType.writing, value: response.value, type: response.type};
    }

    else if (token.startsWith('leia')) {
        // TODO: implementar a verificação de tipo de variável para leitura
        return {actionType: ExecutableActionType.reading, value: getValueOfReading(token)};
    }


    else if (
        (token.indexOf('=') !== -1 || token.indexOf('++') !== -1 || token.indexOf('--') !== -1)
        && token.indexOf('se(') === -1
        && token.indexOf('enquanto(') === -1
    ) {
        if (containsOperator(token)) {
            return {
                actionType: ExecutableActionType.operation,
                value: getOperationForAssignment(token),
                order: getOrderOfOperation(token),
                variable: getVariableForOperation(token)
            };
        } else {
            return {
                actionType: ExecutableActionType.assignment,
                value: getValueOfAssignment(token),
                type: isAssignment(token),
                variable: getVariableOfAssignment(token)
            };
        }

    } else if (isDeclaration(token)) {
        return {actionType: ExecutableActionType.assignment, value: getDefaultValueOfTyping(token), type: isAssignment(token), variable: getVariableOfDeclarationWithoutAssignment(token)};
    }

    else if (token.startsWith('se') && !token.startsWith('senao se') && !token.startsWith('senao')) {
        return {actionType: ExecutableActionType.comparison, value: executeComparison(token, valueVariables), subCode: content};
    }

    else if (token.startsWith('senao se')){
        const result = executeComparison(token, valueVariables);

        if(lastComparison === null){
            throw new Error('Erro semântico | Não há uma instrução **se** anterior para a instrução **senao se**.');
        }else if(!lastComparison.value && result) {
            return {actionType: ExecutableActionType.comparison, value: result, subCode: content};
        }else{
            return {actionType: ExecutableActionType.comparison, value: false, subCode: content};
        }
    }

    else if (token.startsWith('senao')) {
        if(lastComparison === null){
            throw new Error('Erro semântico | Não há uma instrução **se** ou senão se anterior para a instrução **senao**.');
        }else if(!lastComparison.value) {
            return {actionType: ExecutableActionType.comparison, value: true, subCode: content};
        }else{
            return {actionType: ExecutableActionType.comparison, value: false, subCode: content};
        }
    }

    else if (token.startsWith('enquanto')) {
        const result = executeComparison(token, valueVariables);
        if(result){
            return {actionType: ExecutableActionType.loop, value: result, subCode: content, tokenLoop: {token, content}};
        }else{
            return {actionType: ExecutableActionType.loop, value: result, subCode: null, tokenLoop: null};
        }
    }

    else {
        return {actionType: null, value: null};
    }
}

// retorna o valor entre (' e ') para escrever na tela
function getValueOfWriting(token) {
    // recuperar o valor entre (' e ') ou entre ( e )
    if (token.indexOf('\'') === -1) {
        return {value: token.substring(token.indexOf('(') + 1, token.lastIndexOf(')')), type: 'variable'};
    } else {
        return {value: token.substring(token.indexOf('\'') + 1, token.lastIndexOf('\'')), type: 'string'};
    }
}

// recupera o nome da variável para ler o valor do teclado
function getValueOfReading(token) {
    return token.substring(token.indexOf('(') + 1, token.indexOf(')'));
}

// recupera o valor da variável para atribuição
function getValueOfAssignment(token) {
    const value = token.split('=')[1].trim();
    if (value.indexOf('\'') !== -1) {
        return value.replaceAll('\'', '');
    }
    return value;
}

// recupera o nome da variável para atribuição de operação
function getVariableForOperation(token) {
    if(token.indexOf('++') !== -1 || token.indexOf('--') !== -1){
        return token.substring(0, token.indexOf('++') !== -1 ? token.indexOf('++') : token.indexOf('--')).trim();
    }
    return token.substring(0, token.indexOf('=')).trim();
}

// recupera operação para atribuição
function getOperationForAssignment(token) {
    // regex para os operadores: + - * / ++ --
    if(token.indexOf('++') !== -1){
        return token.split('++')[0].replaceAll(' ', '').split(/\+|-|\*|\/|\+\+|--/);
    }
    if(token.indexOf('--') !== -1){
        return token.split('--')[0].replaceAll(' ', '').split(/\+|-|\*|\/|\+\+|--/);
    }
    return token.split('=')[1].replaceAll(' ', '').split(/[+\-*\/]/);
}

// recupera ordem das operações para atribuição
function getOrderOfOperation(token) {
    const array = token.replaceAll(' ', '').split('');
    const response = [];
    array.forEach((item) => {
        if (isOperator(item)) {
            response.push(item);
        }
    });
    return response;
}

// recupera o nome da variável para atribuição
function getVariableOfAssignment(token) {
    return token.substring(token.indexOf(isAssignment(token)) + isAssignment(token).length, token.indexOf('=')).trim();
}

// recupera o nome da variável na declaração sem atribuição
function getVariableOfDeclarationWithoutAssignment(token) {
    return token.substring(token.indexOf(isAssignment(token)) + isAssignment(token).length, token.length).trim();
}

// verifica se o token é uma declaração de variável
function isAssignment(token) {
    if (token.startsWith('inteiro'))
        return 'inteiro'
    else if (token.startsWith('real'))
        return 'real'
    else if (token.startsWith('texto'))
        return 'texto'
    else if (token.startsWith('logico'))
        return 'logico'
    else if (token.startsWith('caractere'))
        return 'caractere'
    else
        return ''
}

// retorna o valor padrão de uma variável - quando a declaração não possui valor
function getDefaultValueOfTyping(token) {
    if (token.startsWith('inteiro'))
        return '0'
    else if (token.startsWith('real'))
        return '0.0'
    else if (token.startsWith('texto'))
        return ''
    else if (token.startsWith('logico'))
        return 'false'
    else if (token.startsWith('caractere'))
        return ''
    else
        return ''
}

// executa a operação matemática
// TODO: implementar a ordem de precedência dos operadores
export function executeOperation(operands, operators) {

    // verifica se é uma operação de incremento ou decremento
    if(operators.length === 2){
        if(operators[0] === '+' && operators[1] === '+'){
            return parseFloat(operands[0]) + 1;
        }else if(operators[0] === '-' && operators[1] === '-'){
            return parseFloat(operands[0]) - 1;
        }
    }

    for (let i = 0; i < operands.length; i++) {
        if (operators[i] === '+') {
            operands[i + 1] = parseFloat(operands[i]) + parseFloat(operands[i + 1]);
        } else if (operators[i] === '-') {
            operands[i + 1] = parseFloat(operands[i]) - parseFloat(operands[i + 1]);
        } else if (operators[i] === '*') {
            operands[i + 1] = parseFloat(operands[i]) * parseFloat(operands[i + 1]);
        } else if (operators[i] === '/') {
            operands[i + 1] = parseFloat(operands[i]) / parseFloat(operands[i + 1]);
        }
    }

    return operands[operands.length - 1];
}

export function executeComparison(instruction, valueVariables) {
    // regex para os simbolos de comparação: == != > < >= <= && ||
    let regex = /==|!=|>=|<=|>|<|&&|\|\|/;

    // verifica se a instrução possui algum símbolo de comparação
    if (instruction.match(regex) === null) {
        const comparison = instruction.substring(instruction.indexOf('(') + 1, instruction.indexOf(')')).replaceAll(' ', '');
        for (let i = 0; i < valueVariables.length; i++) {
            if (valueVariables[i].name === comparison && valueVariables[i].type === 'logico') {
                return valueVariables[i].value !== 'falso';
            } else if ('!' + valueVariables[i].name === comparison && valueVariables[i].type === 'logico') {
                return valueVariables[i].value === 'falso';
            }
        }
        return false;
    } else {
        // recupera o símbolo de comparação: == != > < >= <= && ||
        const symbol = instruction.match(regex)[0];

        // recupera os nomes das variáveis para comparação
        const comparison = instruction.substring(instruction.indexOf('(') + 1, instruction.indexOf(')')).replaceAll(' ', '').split(symbol);
        let value1 = comparison[0];
        let value2 = comparison[1];

        // verificar se o valor inicia com número
        if(value1.match(/^\d/)){
            value1 = parseFloat(value1);
        }
        if(value2.match(/^\d/)){
            value2 = parseFloat(value2);
        }

        // verifica se o valor é uma variável e substitui pelo valor da variável
        // se for um número, transforma a string em número
        valueVariables.map(variable => {
            // comparações para inteiro e real
            if (value1 === variable.name && variable.type !== 'logico') {
                if (variable.type === 'inteiro' || variable.type === 'real') {
                    value1 = parseFloat(variable.value);
                }
                else {
                    value1 = variable.value;
                }
            }
            if (value2 === variable.name && variable.type !== 'logico') {
                if (variable.type === 'inteiro' || variable.type === 'real') {
                    value2 = parseFloat(variable.value);
                } else {
                    value2 = variable.value;
                }
            }

            // comparações para lógico com negação ou não
            if(value1 === variable.name && variable.type === 'logico'){
                value1 = variable.value !== 'falso';
            }

            if(value2 === variable.name && variable.type === 'logico'){
                value2 = variable.value !== 'falso';
            }

            if('!' + value1 === variable.name && variable.type === 'logico'){
                value1 = variable.value === 'falso';
            }

            if('!' + value2 === variable.name && variable.type === 'logico'){
                value2 = variable.value === 'falso';
            }
        });

        return comparisonAux(value1, value2, symbol);
    }
}

/*
 * Função auxiliar para comparação de valores
 * @param value1: primeiro operando
 * @param value2: segundo operando
 * @param operator: operador de comparação
 * @return: true ou false
 */
function comparisonAux(value1, value2, operator) {
    if (operator === '==') {
        return value1 === value2;
    } else if (operator === '!=') {
        return value1 !== value2;
    } else if (operator === '>') {
        return value1 > value2;
    } else if (operator === '<') {
        return value1 < value2;
    } else if (operator === '>=') {
        return value1 >= value2;
    } else if (operator === '<=') {
        return value1 <= value2;
    }else if (operator === '&&') {
        return value1 && value2;
    }else if (operator === '||') {
        return value1 || value2;
    }
}
