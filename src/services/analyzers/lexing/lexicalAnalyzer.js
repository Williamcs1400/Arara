import {isCommand} from '../dictionary.js';

export function lexicalAnalyze(token) {
    if(!isCommand(token)){
        throw new Error('Erro léxico | Comando desconhecido: ' + token);
    }
}