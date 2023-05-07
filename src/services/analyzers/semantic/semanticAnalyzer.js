import {
    containsOperator,
    getNotAcceptedSpecialCharacters,
    getOperator,
    isOperator,
    validateTyping
} from "../definitions/dictionary";

export function semanticAnalyzer(code, variables, usages, defAndTypes){
    findBeginAndEnd(code);
    findDuplicatedVariables(variables);
    findOrderDeclarationAndUsage(variables, usages);
    validateAssignmentAndTypes(defAndTypes, usages);
}

// verifica se há o comando #INICIO_PROGRAMA e #FIM_PROGRAMA e se estão na ordem correta
function findBeginAndEnd(code){
    const begin = code.indexOf('#INICIO_PROGRAMA;');
    const end = code.indexOf('#FIM_PROGRAMA;');

    if(begin === -1){
        throw new Error('Erro semântico | Não foi encontrado o comando #INICIO_PROGRAMA');
    }

    if(end === -1){
        throw new Error('Erro semântico | Não foi encontrado o comando #FIM_PROGRAMA');
    }

    if(begin > end){
        throw new Error('Erro semântico | O comando #INICIO_PROGRAMA deve vir antes do comando #FIM_PROGRAMA');
    }
}

// verifica se há variáveis declaradas mais de uma vez
function findDuplicatedVariables(variables){
    const duplicated = variables.filter((item, index) => variables.indexOf(item) !== index);
    if(duplicated.length > 0){
        throw new Error('Erro semântico | Variavel declarada mais de uma vez: ' + duplicated + '.');
    }
}

// verifica se as variáveis foram declaradas antes de serem utilizadas
function findOrderDeclarationAndUsage(variables, usages){
    let flag = false;

    // Verifica se a variável foi declarada
    usages.forEach(usage => {
        variables.forEach(variable => {
            if(getVariableFromConcat(usage.name) === variable.name){
                flag = true;
            }
        });
        if(!flag){
            throw new Error('Erro semântico | Variavel utilizada antes de ser declarada: ' + usage.name + '.');
        }
        flag = false;
    });

    // Verifica se a variável foi declarada antes de ser utilizada
    variables.forEach(variable => {
        usages.forEach(usage => {
            if(usage.name === variable.name && usage.order < variable.order){
                throw new Error('Erro semântico | Variavel utilizada antes de ser declarada: ' + usage.name + '.');
            }
        });
    });
}

function getVariableFromConcat(object){
    if(object.indexOf(',') !== -1) {
        const aux = object.split(',');
        aux.forEach(item => {
            if(item.indexOf("'") === -1){
                object = item.trimStart().trimEnd();
            }
        })
    }
    return object;
}

function validateAssignmentAndTypes(defAndTypes, usages){

    // recuperar as variáveis que possuem valor - ou seja - que foram atribuídas
    const usagesWithValue = usages.filter(usage => usage.value !== '' && usage.value !== undefined);

    usagesWithValue.forEach(usage => {
        defAndTypes.forEach(defAndType => {
            if(usage.name === defAndType.line){

                // se é feito um cálculo matemático com operadores
                if(containsOperator(usage.value)){
                    // cria um array com os operandos
                    const operands = usage.value.replaceAll(' ', '').split(/[\+\-\*\/]/);

                    // TODO: verificar se o operando é válido
                    operands.forEach(item => {
                        // se o operando é uma variável declarada
                        if(!getNotAcceptedSpecialCharacters(item.trim()) && !validateTyping(defAndType.declaration, item.trim())){
                            throw new Error('Erro semântico | O valor ' + item + ' atribuído à variável ' + usage.name + ' não é compatível com o tipo ' + defAndType.declaration + '.');
                        }
                    });
                }
                // se é feita uma atribuição simples
                else {
                    if (!validateTyping(defAndType.declaration, usage.value)) {
                        throw new Error('Erro semântico | O valor ' + usage.value + ' atribuído à variável ' + usage.name + ' não é compatível com o tipo ' + defAndType.declaration + '.');
                    }
                }
            }
        });
    });
}