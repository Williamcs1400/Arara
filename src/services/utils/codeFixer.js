// Remover a expressão de código definido na linguagem para verificar se o código é válido
export function removeCodeExpression(token){
    return token.split('(')[0];
}