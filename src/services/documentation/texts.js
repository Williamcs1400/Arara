
// Opções de documentação
import {
    condicionalOperadoresLogicos,
    condicionalSe, condicionalSenaoSe,
    divisao,
    entradaDados, forLoop,
    helloWorld,
    multiplicacao,
    soma,
    subtracao,
    tiposDados, vetorAcesso, vetorDeclaracao, whileLoop
} from "../utils/definitions";

export const options = [
    'Visão geral',
    'Entrada e saída',
    'Operações aritméticas',
    'Condicionais',
    'Laços de repetição',
    'Vetores'
];

// Subopções de documentação
export const subOptions = [
    ['O que é algoritmo? ', 'Como o Arara funciona?'],
    ['Olá mundo', 'Entrada de dados', 'Tipagem de dados'],
    ['Adição', 'Subtração', 'Multiplicação', 'Divisão'],
    ['Se e senão', 'Senão se', 'Operadores lógicos'],
    ['Enquanto', 'Para'],
    ['Declaração', 'Acesso']
];

// Textos de documentação
export const texts = [
    ['Algoritmo é uma sequência de passos que resolve um problema. Na computação são instruções para realizar uma derminada tarefa.', 'O Arara é um editor e juiz online de algoritmos. Ele permite que você escreva algoritmos em português e os execute para ver o resultado, Além disso, ele também permite que você crie tarefas para seus alunos e os avalie automaticamente com base na suas entradas e saídas cadastradas.'],
    [helloWorld, entradaDados, tiposDados],
    [soma, subtracao, multiplicacao, divisao],
    [condicionalSe, condicionalSenaoSe, condicionalOperadoresLogicos],
    [whileLoop, forLoop],
    [vetorDeclaracao, vetorAcesso]
];
