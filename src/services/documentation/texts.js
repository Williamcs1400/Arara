
// Opções de documentação
import {
    condicionalSe, condicionalSenaoSe,
    divisao,
    entradaDados,
    helloWorld,
    multiplicacao,
    soma,
    subtracao,
    tiposDados
} from "../utils/definitions";

export const options = [
    'Visão geral',
    'Entrada e saída',
    'Operações aritméticas',
    'Condicionais',
    'Laços de repetição'
];

// Subopções de documentação
export const subOptions = [
    ['O que é algoritmo? ', 'Como o Arara funciona?'],
    ['Olá mundo', 'Entrada de dados', 'Tipagem de dados'],
    ['Adição', 'Subtração', 'Multiplicação', 'Divisão'],
    ['Se e senão', 'Senão se', 'Operadores lógicos'],
];

// Textos de documentação
export const texts = [
    ['Algoritmo é uma sequência de passos que resolve um problema. Na computação são instruções para realizar uma derminada tarefa.', 'O Arara é um editor e juiz online de algoritmos. Ele permite que você escreva algoritmos em português e os execute para ver o resultado, Além disso, ele também permite que você crie tarefas para seus alunos e os avalie automaticamente com base na suas entradas e saídas cadastradas.'],
    [helloWorld, entradaDados, tiposDados],
    [soma, subtracao, multiplicacao, divisao],
    [condicionalSe, condicionalSenaoSe],
];
