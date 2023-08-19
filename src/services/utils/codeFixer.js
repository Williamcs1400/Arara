// Remover a expressão de código definido na linguagem para verificar se o código é válido
export function removeCodeExpression(token){
    if(token.startsWith('inteiro')){
        return 'inteiro';
    }

    if(token.startsWith('real')){
        return 'real';
    }

    if(token.startsWith('texto')){
        return 'texto';
    }

    if(token.startsWith('logico')) {
        return 'logico';
    }

    if(token.startsWith('caractere')) {
        return 'caractere';
    }
    if(token.replaceAll(' ', '').startsWith('se(')) {
        return 'se';
    }
    if(token.replaceAll(' ', '').startsWith('senaose(')) {
        return 'senao se';
    }
    if(token.replaceAll(' ', '').startsWith('senao')) {
        return 'senao';
    }

    return token.split('(')[0];
}