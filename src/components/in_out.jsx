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

    function onChange(newValue) {
        setInput(newValue);
    }

    useEffect(() => {
        let aux = '';
        if(executableCode !== undefined && executableCode.length > 0) {
            executableCode.forEach((command) => {
                const response = executor(command);

                // Escrita no terminal
                if(response.actionType === ExecutableActionType.writing){
                    if(response.value.indexOf('\\n') !== -1){
                        for(let i = 0; i < response.value.length; i++){
                            if(response.value[i] === '\\' && response.value[i+1] === 'n'){
                                aux += '\n';
                                i++;
                            }else{
                                aux += response.value[i];
                            }
                        }
                    }else {
                        aux += response.value;
                    }
                    setText(aux);
                }

            });
        }else{
            setText('');
        }
    }, [executableCode]);

    return (
        <div style={{width: width - 64, height: height, background: '#2F2F2F'}}>
            <div style={{width: width - 64, height: 40, background: '#272727', display:'flex', justifyContent: "flex-end"}}>
                <IconButton aria-label="delete" style={{marginLeft: 'auto', marginRight: 0}} onClick={() => closeTerminal()}>
                    <CloseOutlinedIcon color='error'/>
                </IconButton>
            </div>
            <text className="textOut">
                {text}
            </text>
            <input
                className="textIn"
                autoFocus={true}
                type="text"
                value={input}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        setText(text + e.target.value + '\n');
                        setInput('');
                    }
                }}
                style={{visibility: readingEnabled ? 'visible' : 'hidden'}}
            />
        </div>
    );
}