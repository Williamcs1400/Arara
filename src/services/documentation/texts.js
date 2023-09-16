
// Opções de documentação
import {
    algorithm, algoritmo, comandosAritmeticos, comandosCondicionais, comandosIO, comandosRepeticao, comandosVetor,
    condicionalOperadoresLogicos,
    condicionalSe, condicionalSenaoSe,
    divisao,
    entradaDados, forLoop, funcionalidades,
    helloWorld,
    multiplicacao, objetivo,
    soma,
    subtracao,
    tiposDados, vetorAcesso, vetorDeclaracao, whileLoop
} from "../utils/definitions";

// import {algoritm} from '../documentation/markdown/algoritm.md';

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
    ['Objetivo Geral', 'Funcionalidades'],
    ['Comandos', 'Olá mundo', 'Entrada de dados', 'Tipagem de dados'],
    ['Comandos', 'Adição', 'Subtração', 'Multiplicação', 'Divisão'],
    ['Comandos', 'Se e senão', 'Senão se', 'Operadores lógicos'],
    ['Comandos', 'Enquanto', 'Para'],
    ['Comandos', 'Declaração', 'Acesso']
];

// Textos de documentação
export const texts = [
    [objetivo, funcionalidades],
    [comandosIO, helloWorld, entradaDados, tiposDados],
    [comandosAritmeticos, soma, subtracao, multiplicacao, divisao],
    [comandosCondicionais, condicionalSe, condicionalSenaoSe, condicionalOperadoresLogicos],
    [comandosRepeticao, whileLoop, forLoop],
    [comandosVetor, vetorDeclaracao, vetorAcesso]
];
