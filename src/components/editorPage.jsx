import React, {useEffect, useRef} from 'react';
import {setCodeFromEditor} from '../services/analyzers/compiler.js';
import {defaultCode} from '../services/utils/definitions.js';
import {c_cppHighlightRules} from '../services/utils/codeEditorCustomHighlightRules.js';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

// import 'ace/lib/oop';
// import 'ace/mode/text';
// import 'ace/mode/text_highlight_rules';

export default function EditorPage({height, width}) {
    const [value, setValue] = React.useState(defaultCode);

    useEffect(() => {
        onChange(defaultCode);
    }, []);

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