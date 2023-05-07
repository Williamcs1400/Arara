import {ExecutableActionType} from "./definitions/actionTypes";
import {containsOperator, isOperator} from "./definitions/dictionary";

// executa o código gerado pelo compilador linha a linha
export function executor(token) {
    if (token.startsWith('escreva')) {
        const response = getValueOfWriting(token);
        return {actionType: ExecutableActionType.writing, value: response.value, type: response.type};
    } else if(token.startsWith('leia')) {
        // TODO: implementar a verificação de tipo de variável para leitura
        return {actionType: ExecutableActionType.reading, value: getValueOfReading(token)};
    } else if(token.indexOf('=') !== -1) {
        if(containsOperator(token)){
            return {actionType: ExecutableActionType.operation, value: getOperationForAssignment(token), order: getOrderOfOperation(token), variable: getVariableForOperation(token)};
        }else{
            return {actionType: ExecutableActionType.assignment, value: getValueOfAssignment(token), type: isAssignment(token), variable: getVariableOfAssignment(token)};
        }
    }
    else {
        return {actionType: null, value: null};
    }
}

// retorna o valor entre (' e ') para escrever na tela
function getValueOfWriting(token) {
    // recuperar o valor entre (' e ') ou entre ( e )
    if(token.indexOf('\'') === -1){
        return {value: token.substring(token.indexOf('(') + 1, token.lastIndexOf(')')), type: 'variable'};
    }
    else {
        return {value: token.substring(token.indexOf('\'') + 1, token.lastIndexOf('\'')), type: 'string'};
    }
}

// recupera o nome da variável para ler o valor do teclado
function getValueOfReading(token) {
    return token.substring(token.indexOf('(') + 1, token.indexOf(')'));
}

// recupera o valor da variável para atribuição
function getValueOfAssignment(token) {
    const value =  token.split('=')[1].trim();
    if(value.indexOf('\'') !== -1){
        return value.replaceAll('\'', '');
    }
    return value;
}

// recupera o nome da variável para atribuição de operação
function getVariableForOperation(token){
    return token.substring(0, token.indexOf('=')).trim();
}

// recupera operação para atribuição
function getOperationForAssignment(token){
    return token.split('=')[1].replaceAll(' ', '').split(/[\+\-\*\/]/);
}

// recupera ordem das operações para atribuição
function getOrderOfOperation(token){
    const array = token.replaceAll(' ', '').split('');
    const response = [];
    array.forEach((item) => {
        if(isOperator(item)) {
            response.push(item);
        }
    });
    return response;
}

// recupera o nome da variável para atribuição
function getVariableOfAssignment(token) {
    return token.substring(token.indexOf(isAssignment(token)) + isAssignment(token).length, token.indexOf('=')).trim();
}

function isAssignment(token){
    if(token.startsWith('inteiro'))
        return 'inteiro'
    else if(token.startsWith('real'))
        return 'real'
    else if(token.startsWith('texto'))
        return 'texto'
    else if(token.startsWith('logico'))
        return 'logico'
    else if(token.startsWith('caractere'))
        return 'caractere'
    else
        return ''
}

// executa a operação matemática
// TODO: implementar a ordem de precedência dos operadores
export function executeOperation(operands, operators){
    for(let i = 0; i < operands.length; i++){
        if(operators[i] === '+') {
            operands[i+1] = parseFloat(operands[i]) + parseFloat(operands[i+1]);
        }
        else if(operators[i] === '-') {
            operands[i+1] = parseFloat(operands[i]) - parseFloat(operands[i+1]);
        }
        else if(operators[i] === '*') {
            operands[i+1] = parseFloat(operands[i]) * parseFloat(operands[i+1]);
        }
        else if(operators[i] === '/') {
            operands[i+1] = parseFloat(operands[i]) / parseFloat(operands[i+1]);
        }
    }

    return operands[operands.length - 1];
}
