// Description: This file contains the dictionary of the language
const knownCommands = [
    '#VARIAVEIS;',
    '#INICIOPROGRAMA;',
    '#FIMPROGRAMA;',
];

const knownOperators = [];

export function isCommand(word){
    return knownCommands.includes(word);
}
