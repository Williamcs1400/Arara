// export const defaultCode =
//     '#INICIO_PROGRAMA;' +
//     '\n\n//Programa para testes' +
//     '\ntexto x; // teste comentário' +
//     '\ninteiro num = 10;' +
//     '\nreal num_rel = 10.5;' +
//     '\ntexto txt = \'Texto de teste\';' +
//     '\ncaractere char = \'A\';' +
//     '\nlogico lgc = verdadeiro;' +
//     '\n\nleia(x);' +
//     '\nx = \'novo valor de x\';' +
//     '\ntxt = \'Teste dois\';' +
//     '\nnum = 10 * 5;' +
//     '\nnum_rel = 10.5 + num_rel;' +
//     '\n\nescreva(\'Valor inteiro: \', num);' +
//     '\nescreva(\'\\n\');' +
//     '\n\nescreva(\'Valor real: \', num_rel);' +
//     '\nescreva(\'\\n\');' +
//     '\n\nescreva(\'Valor texto: \', txt);' +
//     '\nescreva(\'\\n\');' +
//     '\n\nescreva(\'Valor caractere: \', char);' +
//     '\nescreva(\'\\n\');' +
//     '\n\nescreva(\'Valor lógico: \', lgc);' +
//     '\nescreva(\'\\n\');' +
//     '\n\nescreva(\'Valor x: \', x);' +
//     '\nescreva(\'\\n\');' +
//     '\n\n#FIM_PROGRAMA;';

export const defaultCode =
    '#INICIO_PROGRAMA;' +
    '\n\n//Escreva seu programa aqui!' +
    '\n\n#FIM_PROGRAMA;';

export const helloWorld =
    '#INICIO_PROGRAMA;' +
    "\n\nescreva('Olá, mundo!');" +
    '\n\n#FIM_PROGRAMA;';

export const entradaDados  =
    '#INICIO_PROGRAMA;' +
    "\n\ninteiro numero;" +
    "\n\nescreva('Digite um número: ');" +
    "\n\nleia(numero);" +
    "\n\nescreva('O número digitado foi: ', numero);" +
    '\n\n#FIM_PROGRAMA;';

export const tiposDados =
    '#INICIO_PROGRAMA;' +
    '\n\n// No Arara, as variáveis podem ser inicializadas ou não' +
    '\n// As variáveis podem ser declaradas em qualquer parte do código' +
    '\n// As variáveis devem ser declaradas apenas uma vez' +
    '\n// As variáveis devem ser declaradas com um nome válido' +
    '\n// (não pode conter espaços, acentos, caracteres especiais, começar com números, etc.)' +
    "\n\ninteiro numero_inteiro = 10;" +
    "\n\n// número real sempre deve ser declarado com um . seguido de um algarismo" +
    "\nreal numero_real = 10.5;" +
    "\n\n// para atribuir o tipo texto deve-se usar aspas símples" +
    "\ntexto texto = 'Texto de teste'" +
    "\n\n// o tipo caractere funciona como o tipo texto com a limitação de apenas uma entrada" +
    "\ncaractere caractere = 'A';" +
    "\n\n// o tipo lógico pode assumir apenas os valores verdadeiro ou falso" +
    "\nlogico logico = verdadeiro;" +
    '\n\n#FIM_PROGRAMA;';

export const soma =
    '#INICIO_PROGRAMA;' +
    '\n\ninteiro x = 10;' +
    '\ninteiro y = 5;' +
    '\ninteiro resultado;' +
    '\n\nresultado = x + y;' +
    '\n\nescreva(\'O resultado da soma é: \', resultado);' +
    '\n\n#FIM_PROGRAMA;';

export const subtracao =
    '#INICIO_PROGRAMA;' +
    '\n\nreal x = 1.5;' +
    '\nreal y = 1.5;' +
    '\nreal resultado;' +
    '\n\nresultado = x - y;' +
    '\n\nescreva(\'O resultado da subtração é: \', resultado);' +
    '\n\n#FIM_PROGRAMA;';

export const multiplicacao =
    '#INICIO_PROGRAMA;' +
    '\n\ninteiro a = 10;' +
    '\ninteiro b = 5;' +
    '\ninteiro resultado;' +
    '\n\nresultado = a * b;' +
    '\n\nescreva(\'O resultado da multiplicação é: \', resultado);' +
    '\n\n#FIM_PROGRAMA;';

export const divisao =
    '#INICIO_PROGRAMA;' +
    '\n\ninteiro a = 10;' +
    '\ninteiro b = 5;' +
    '\ninteiro resultado;' +
    '\n\nresultado = a / b;' +
    '\n\nescreva(\'O resultado da divisão é: \', resultado);' +
    '\n\n#FIM_PROGRAMA;';
