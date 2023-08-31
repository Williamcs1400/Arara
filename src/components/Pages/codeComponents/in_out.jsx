import React, {useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import '../../../styles/in_out.css';
import {executeOperation, executor} from '../../../services/analyzers/executor.js'
import {ExecutableActionType} from "../../../services/analyzers/definitions/actionTypes";
import {getElementsOfArray, getPointerOfArray, isArrayDeclaration} from "../../../services/utils/util";
import {removeArrayDeclaration} from "../../../services/analyzers/definitions/dictionary";

export default function InOut({height, width, closeTerminal, executableCode, errorMessage}) {
    const [text, setText] = React.useState('');
    const [input, setInput] = React.useState('');
    const [readingEnabled, setReadingEnabled] = React.useState(false);

    const [valueVariables, setValueVariables] = React.useState([]); // Armazena as variáveis e seus valores
    const [lastVariable, setLastVariable] = React.useState(''); // Armazena a última variável lida
    const [lastInput, setLastInput] = React.useState(''); // Armazena o último input lido
    const [pauseOrder, setPauseOrder] = React.useState(0); // Armazena a ordem de execução do código para retomar de onde parou
    const [att, setAtt] = React.useState(false); // feito para atualizar o componente e chamar o useEffect
    const [finalized, setFinalized] = React.useState(false); // feito para atualizar o componente e chamar o useEffect
    const [focus, setFocus] = React.useState(false); // para dar foco no input quando uma leitura é solicitada

    function onChange(newValue) {
        setInput(newValue);
    }

    // Limpa o terminal e todas as variáveis para uma nova execução
    function clear() {
        setText('');
        setInput('');
        setLastInput('');
        setReadingEnabled(false);
        setValueVariables([]);
        setLastVariable('');
        setPauseOrder(0);
        setFinalized(false);
        setAtt(!att);
    }

    function isClear() {
        return text === '' && input === '' && lastInput === '' && readingEnabled === false && valueVariables.length === 0 && lastVariable === '' && pauseOrder === 0;
    }

    // Executa o código - para e retoma de onde parou quando encontra um comando de leitura
    function executeCode() {
        let aux = '';
        let i = pauseOrder !== 0 ? pauseOrder + 1 : 0;
        let response;
        let lastResponse = null;
        let flagCondition = false;

        try {
            let timeout = new Date().getTime() + 8000;
            if (executableCode !== undefined && executableCode.length > 0) {
                for (; i < executableCode.length; i++) {

                    // Verifica se o tempo de execução foi excedido
                    if (new Date().getTime() > timeout) {
                        throw new Error('Tempo de execução excedido');
                    }

                    // Somente permite a leitura se o terminal quando cair no comando de leitura
                    if (readingEnabled) {
                        setReadingEnabled(false);
                    }

                    if (i > 0) {
                        response = executor(executableCode[i], valueVariables, lastResponse);
                    } else {
                        response = executor(executableCode[i], valueVariables, null);
                    }

                    if(executableCode[i].token.startsWith('se(') || executableCode[i].token.startsWith('senao se(') || executableCode[i].token.startsWith('senao(')) {
                        // lastResponse = response;
                    }else if(lastResponse !== null && lastResponse.subCode.includes(executableCode[i].token)){
                        flagCondition = true;
                    }else{
                        lastResponse = null;
                    }

                    // Escrita no terminal
                    if (response.actionType === ExecutableActionType.writing) {
                        // Verifica se o valor é uma string ou uma variável
                        if (response.type === 'string') {
                            if (response.value.indexOf('\\n') !== -1) {
                                for (let i = 0; i < response.value.length; i++) {
                                    if (response.value[i] === '\\' && response.value[i + 1] === 'n') {
                                        aux += '\n';
                                        i++;
                                    } else {
                                        aux += response.value[i];
                                    }
                                }
                            } else {
                                aux += response.value;
                            }
                            // Verifica se o valor é uma variável
                        } else if (response.type === 'variable') {
                            // Verifica se a variável é um array
                            if(isArrayDeclaration(response.value)){
                                for(let i = 0; i < valueVariables.length; i++){
                                    if(removeArrayDeclaration(valueVariables[i].name) === response.value.split('[')[0]){
                                        const index = response.value.replaceAll(' ', '').split('[')[1].split(']')[0];
                                        const array = valueVariables[i].value.replace('[', '').replace(']', '').split(',');
                                        // verifica se o index é uma variável ou um número
                                        if(isNaN(index)){
                                            for(let j = 0; j < valueVariables.length; j++){
                                                if(valueVariables[j].name === index){
                                                    aux += array[Number(valueVariables[j].value)];
                                                }
                                            }
                                        }else{
                                            aux += array[index];
                                        }
                                    }
                                }
                            }
                            for (let i = 0; i < valueVariables.length; i++) {
                                if (valueVariables[i].name === response.value) {
                                    aux += valueVariables[i].value;
                                }else if(removeArrayDeclaration(valueVariables[i].name) === response.value){
                                    aux += valueVariables[i].value;
                                }
                            }
                        }
                        setText(text + aux);
                    }

                    // Leitura do terminal
                    if (response.actionType === ExecutableActionType.reading) {
                        setReadingEnabled(true);
                        setFocus(true);
                        setPauseOrder(i);
                        setLastVariable(response.value);

                        break;
                    }

                    // Atribuição de valor a variável
                    if (response.actionType === ExecutableActionType.assignment) {
                        let exists = false;
                        for (let i = 0; i < valueVariables.length; i++) {
                            if (removeArrayDeclaration(valueVariables[i].name) === removeArrayDeclaration(response.variable)) {
                                if(isArrayDeclaration(valueVariables[i].value) || isArrayDeclaration(response.variable)){
                                    let index = getPointerOfArray(response.variable);
                                    const array = getElementsOfArray(valueVariables[i].value);

                                    if(isNaN(index)){
                                        for(let j = 0; j < valueVariables.length; j++){
                                            if(valueVariables[j].name === index){
                                                index = Number(valueVariables[j].value);
                                            }
                                        }
                                    }

                                    // verifica se o index é uma variável ou um número
                                    array[index] = response.value;
                                    valueVariables[i].value = '[' + array + ']';
                                }else {
                                    valueVariables[i].value = response.value;
                                }
                                exists = true;
                            }
                        }

                        if (!exists) {
                            valueVariables.push({name: response.variable, value: response.value, type: response.type});
                        }
                    }

                    // Operações matemáticas
                    if (response.actionType === ExecutableActionType.operation) {
                        const operations = response.value;
                        operations.forEach((operation, index) => {
                            valueVariables.forEach((variable) => {
                                if (operation === variable.name) {
                                    if (variable.value === undefined || variable.value === '') {
                                        operations[index] = 0;
                                    } else {
                                        operations[index] = variable.value;
                                    }
                                }else if(removeArrayDeclaration(operation) === removeArrayDeclaration(variable.name)){
                                    if (variable.value === undefined || variable.value === '') {
                                        operations[index] = 0;
                                    } else {
                                        const values = getElementsOfArray(variable.value);
                                        operations[index] = values[getPointerOfArray(operation)];
                                    }
                                }
                            });
                        });
                        const value = executeOperation(operations, response.order);
                        for (let i = 0; i < valueVariables.length; i++) {
                            if (valueVariables[i].name === response.variable) {
                                valueVariables[i].value = value;
                            }
                        }
                    }

                    // Condicional
                    if (response.actionType === ExecutableActionType.comparison) {
                        if(!flagCondition)
                            lastResponse = response;
                        if (response.value) {
                            // Se a condição for verdadeira, executa o código dentro do if
                            const executableCodeAux = []
                            // monta o código que será executado
                            response.subCode.forEach((code) => {
                                executableCodeAux.push({token: code, content: null, subContent: true});
                            });

                            // remove a instrução se já processada
                            const part1 = executableCode.slice(0, i);
                            const part2 = executableCode.slice(i + 1, executableCode.length);

                            // insere o código que será executado no ponto onde o se estava
                            const exeAux = [{token: null, content: null}];
                            part1.push(...exeAux);
                            part1.push(...executableCodeAux);
                            part1.push(...part2);

                            executableCode = part1;
                        }
                    }

                    // Repetição
                    if (response.actionType === ExecutableActionType.loop) {
                        if(response.value){
                            const executableCodeAux = []
                            // monta o código que será executado
                            response.subCode.forEach((code) => {
                                executableCodeAux.push({token: code, content: null, subContent: true});
                            });

                            // remove a instrução se já processada
                            const part1 = executableCode.slice(0, i);
                            const part2 = executableCode.slice(i + 1, executableCode.length);

                            // insere o código que será executado no ponto onde o se estava
                            const exeAux = [{token: null, content: null}];
                            part1.push(...exeAux);
                            part1.push(...executableCodeAux);
                            part1.push(response.tokenLoop)
                            part1.push(...part2);

                            executableCode = part1;
                        }
                    }

                    // Verifica se o código chegou ao fim
                    if (i === executableCode.length - 1) {
                        setFinalized(true);
                    }
                }
            } else {
                setText('');
            }
        } catch (e) {
            setText(`${text}\n${e.message}`);
        }
    }

    useEffect(() => {
        if (isClear()) {
            executeCode();
        } else {
            clear();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executableCode, att]);

    useEffect(() => {
        if (lastInput !== '') {

            // Verifica se a variável já existe, se sim, atualiza o valor, se não, cria uma nova
            let exists = false;
            for (let i = 0; i < valueVariables.length; i++) {
                if (removeArrayDeclaration(valueVariables[i].name) === removeArrayDeclaration(lastVariable)) {
                    if(isArrayDeclaration(lastVariable)){
                        let index = getPointerOfArray(lastVariable);
                        const array = getElementsOfArray(valueVariables[i].value);

                        if(isNaN(index)){
                            for(let j = 0; j < valueVariables.length; j++){
                                if(valueVariables[j].name === index){
                                    index = Number(valueVariables[j].value);
                                }
                            }
                        }

                        // verifica se o index é uma variável ou um número
                        array[index] = lastInput.replace('\n', '');
                        valueVariables[i].value = '[' + array + ']';
                    }else {
                        valueVariables[i].value = lastInput;
                    }
                    exists = true;
                }
            }

            if (!exists) {
                valueVariables.push({name: lastVariable, value: lastInput});
            }
            executeCode();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastInput]);

    useEffect(() => {
        if (finalized) {
            setText(`${text}\n\n------------------ PROGRAMA FINALIZADO ------------------`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finalized]);

    return (
        <div style={{width: width - 64, maxHeight: height, background: '#0F1114'}}>
            <div style={{
                width: width - 64,
                height: 30,
                maxHeight: 30,
                background: '#111922',
                display: 'flex',
                justifyContent: 'flex-end',
                overflow: 'auto'
            }}>
                <IconButton aria-label="delete" style={{marginLeft: 'auto', marginRight: 0}}
                            onClick={() => closeTerminal()}>
                    <CloseOutlinedIcon color='error'/>
                </IconButton>
            </div>
            <div style={{height: height - 40, padding: 5, overflow: 'scroll'}}>
                <text className="textOut" style={{color: errorMessage ? '#FF2E44' : '#fff'}}>
                    {errorMessage ? errorMessage : text}
                </text>
                <input
                    ref={input => {
                        if (input !== null && focus) {
                            input.focus();
                            setFocus(false);
                        }
                    }}
                    className="textIn"
                    type="text"
                    value={input}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            setText(text + e.target.value + '\n');
                            setLastInput(e.target.value + '\n');
                            setInput('');
                        }
                    }}
                    style={{visibility: readingEnabled ? 'visible' : 'hidden'}}
                />
            </div>
        </div>
    );
}