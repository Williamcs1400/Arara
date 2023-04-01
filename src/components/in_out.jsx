import React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import '../styles/in_out.css';

export default function InOut({height, width, closeTerminal}) {
    const [text, setText] = React.useState('Olá mundo!\nDigte algo: ');
    const [input, setInput] = React.useState('');

    function onChange(newValue) {
        setInput(newValue);
    }

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
            />
        </div>
    );
}