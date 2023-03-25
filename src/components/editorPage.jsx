import React, {useEffect} from 'react';
import {setCodeFromEditor} from '../services/analyzers/compiler.js';
import {defaultCode} from '../services/utils/definitions.js';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

export default function EditorPage() {
    const [value, setValue] = React.useState(defaultCode);
    const [height, setHeight] = React.useState(document.querySelector("#height"));
    const [width, setWidth] = React.useState(document.querySelector("#width"));

    function updateSize() {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        updateSize();
    }, []);

    useEffect(() => {
        onChange(defaultCode);
    }, [defaultCode]);

    window.addEventListener("resize", updateSize);

    function onChange(newValue) {
        setCodeFromEditor(newValue);
        setValue(newValue);
    }

    return (
        <AceEditor
            mode="java"
            theme="monokai"
            value={value}
            onChange={onChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{$blockScrolling: true}}
            height={height - 71}
            width={width - 64}
            fontSize={20}
        />
    );
}