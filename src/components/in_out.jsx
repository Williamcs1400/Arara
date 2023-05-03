import React, {useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import '../styles/in_out.css';
import {executor} from '../services/analyzers/executor.js'
import {ExecutableActionType} from "../services/analyzers/definitions/actionTypes";


export default function InOut({height, width, closeTerminal, executableCode}) {
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

    function isClear(){
        return text === '' && input === '' && lastInput === '' && readingEnabled === false && valueVariables.length === 0 && lastVariable === '' && pauseOrder === 0;
    }

    // Executa o código - para e retoma de onde parou quando encontra um comando de leitura
    function executeCode() {
        let aux = '';
        let i = pauseOrder !== 0 ? pauseOrder + 1 : 0;

        if (executableCode !== undefined && executableCode.length > 0) {
            for (; i < executableCode.length; i++) {
                // Somente permite a leitura se o terminal quando cair no comando de leitura
                if (readingEnabled) {
                    setReadingEnabled(false);
                }
                const response = executor(executableCode[i]);

                // Escrita no terminal
                if (response.actionType === ExecutableActionType.writing) {
                    // Verifica se o valor é uma string ou uma variável
                    if(response.type === 'string') {
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
                    }else if(response.type === 'variable'){
                        for (let i = 0; i < valueVariables.length; i++) {
                            if (valueVariables[i].name === response.value) {
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
                        if (valueVariables[i].name === response.variable) {
                            valueVariables[i].value = response.value;
                            exists = true;
                        }
                    }

                    if (!exists) {
                        valueVariables.push({name: response.variable, value: response.value});
                    }
                }

                if(i === executableCode.length - 1){
                    setFinalized(true);
                    // setText(text + '\n\n' + 'PROGRAMA FINALIZADO');
                }
            }
        } else {
            setText('');
        }
    }

    useEffect(() => {
        if(isClear()){
            executeCode();
        }else{
            clear();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executableCode, att]);

    useEffect(() => {
        if (lastInput !== '') {

            // Verifica se a variável já existe, se sim, atualiza o valor, se não, cria uma nova
            let exists = false;
            for (let i = 0; i < valueVariables.length; i++) {
                if (valueVariables[i].name === lastVariable) {
                    valueVariables[i].value = lastInput;
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
        if(finalized){
            setText(`${text}\n\nPROGRAMA FINALIZADO`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finalized]);

    return (
        <div style={{width: width - 64, height: height, background: '#2F2F2F'}}>
            <div style={{
                width: width - 64,
                height: 40,
                background: '#272727',
                display: 'flex',
                justifyContent: "flex-end"
            }}>
                <IconButton aria-label="delete" style={{marginLeft: 'auto', marginRight: 0}}
                            onClick={() => closeTerminal()}>
                    <CloseOutlinedIcon color='error'/>
                </IconButton>
            </div>
            <text className="textOut">
                {text}
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
    );
}