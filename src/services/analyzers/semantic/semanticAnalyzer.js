export function semanticAnalyzer(code, variables, usages){
    findBeginAndEnd(code);
    findDuplicatedVariables(variables);
    findOrderDeclarationAndUsage(variables, usages);
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
    variables.forEach(variable => {
        usages.forEach(usage => {
            if(usage.name === variable.name && usage.order < variable.order){
                throw new Error('Erro semântico | Variavel utilizada antes de ser declarada: ' + usage.name + '.');
            }
        });
    });
}