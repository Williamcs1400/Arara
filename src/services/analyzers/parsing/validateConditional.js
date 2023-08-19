import {
    getInstructionByToken,
    isPossibleNameOfVariable
} from "../definitions/dictionary";
import {compilerFromScope} from "../compiler";

// TODO: arrumar a validação para aceitar negação !
// TODO: aceitar variável booleana e o valor true ou false

export function validateSeInstruction(instruction) {
    const definition = getInstructionByToken('se');
    const syntax = definition.syntax;

    const content = instruction.substring(instruction.indexOf('{') + 1, instruction.lastIndexOf('}'));
    instruction = instruction.replace(content, '');

    // verifica se há a quantidade correta de cada componente da instrução
    if (instruction.split('se').length - 1 !== 1 ||
        instruction.split('(').length - 1 !== 1 ||
        instruction.split(')').length - 1 !== 1
    ) {
        throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
    }


    // recuperar o nome da variável e remover da instrução
    // TODO: remover conteúdo ente { }
    const condition = instruction.substring(instruction.indexOf('(') + 1, instruction.indexOf(')'));
    instruction = instruction.replace(condition, '').replaceAll(' ', '');

    // Verifica se a instrução está correta
    if(instruction !== syntax){
        throw new Error('Erro sintático | Instrução não conhecida: ' + instruction);
    }

    const resultComparison = validateComparison(condition);

    // TODO: tratar erros do conteudo
    compilerFromScope(content);

    return {'condition': condition, 'action': 'if', 'content': content, variables: resultComparison};

}

/*
 * Função que valida a condição de uma instrução
 * @param condition: condição a ser validada
 */
function validateComparison(condition) {
    condition = condition.replaceAll(' ', '');
    const operators = ['<', '>', '==', '!=', '>=', '<=', '&&', '||'];
    let operator = '';
    let parts = [];
    let flagContaisOperator = false;

    operators.forEach(op => {
        if(condition.indexOf(op) !== -1){
            operator = op;
            parts = condition.split(op);
            flagContaisOperator = true;
        }
    });

    // verifica se a condição possui um operador e se a quantidade de partes é par
    if(!flagContaisOperator && parts.length % 2 !== 0){
        throw new Error('Erro sintático | Condição inválida: ' + condition);
    }

    const aux = []
    parts.forEach(part => {
        if(isPossibleNameOfVariable(part)){
            aux.push(part);
        }
    });

    return aux;
}