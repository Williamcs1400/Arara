export function semanticAnalyzer(code){
    findBeginAndEnd(code);
}

function findBeginAndEnd(code){
    const begin = code.indexOf('#INICIOPROGRAMA;');
    const end = code.indexOf('#FIMPROGRAMA;');

    if(begin === -1){
        throw 'Erro semântico | Não foi encontrado o comando #INICIOPROGRAMA';
    }

    if(end === -1){
        throw 'Erro semântico | Não foi encontrado o comando #FIMPROGRAMA';
    }

    if(begin > end){
        throw 'Erro semântico | O comando #INICIOPROGRAMA deve vir antes do comando #FIMPROGRAMA';
    }
}