export function semanticAnalyzer(code, variables){
    findBeginAndEnd(code);
    findDuplicatedVariables(variables);
}

function findBeginAndEnd(code){
    const begin = code.indexOf('#INICIOPROGRAMA;');
    const end = code.indexOf('#FIMPROGRAMA;');

    if(begin === -1){
        throw new Error('Erro semântico | Não foi encontrado o comando #INICIOPROGRAMA');
    }

    if(end === -1){
        throw new Error('Erro semântico | Não foi encontrado o comando #FIMPROGRAMA');
    }

    if(begin > end){
        throw new Error('Erro semântico | O comando #INICIOPROGRAMA deve vir antes do comando #FIMPROGRAMA');
    }
}

function findDuplicatedVariables(variables){
    const duplicated = variables.filter((item, index) => variables.indexOf(item) !== index);
    if(duplicated.length > 0){
        throw new Error('Erro semântico | Variavel declarada mais de uma vez: ' + duplicated + '.');
    }
}