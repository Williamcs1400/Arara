import 'brace/mode/java';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';

window.ace = require('ace-builds/src-noconflict/ace');
export class CustomHighlightRules extends window.ace.acequire("ace/mode/text_highlight_rules").TextHighlightRules {
    constructor() {
        super();
        this.$rules = {
            "start": [{
                token: "constant.numeric",
                regex: "#INICIO_PROGRAMA;"
            }, {
                token: "constant.numeric",
                regex : "#FIM_PROGRAMA;"
            }, {
                token: "string",
                regex : "'.*?'"
            }, {
                token: "entity.name.function",
                regex: "variavel"
            }, {
                token: "entity.name.function",
                regex: "leia"
            }, {
                token: "entity.name.function",
                regex: "escreva"
            }
            ]
        };
    }
}

export default class CustomAraraMode extends window.ace.acequire('ace/mode/java').Mode {
    constructor() {
        super();
        this.HighlightRules = CustomHighlightRules;
    }
}