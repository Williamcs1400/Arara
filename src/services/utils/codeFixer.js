// Remover a expressão de código definido na linguagem para verificar se o código é válido
export function removeCodeExpression(token){
    if(token.startsWith('variavel')){
        return 'variavel';
    }
    return token.split('(')[0];
}