import 'brace/mode/java';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
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
                regex: "leia"
            }, {
                token: "entity.name.function",
                regex: "escreva"
            }, {
                token: "keyword.operator",
                regex: "inteiro"
            }, {
                token: "keyword.operator",
                regex: "real"
            }, {
                token: "keyword.operator",
                regex: "texto"
            }, {
                token: "keyword.operator",
                regex: "logico"
            },{
                token: "keyword.operator",
                regex: "caractere"
            },{
                token: "constant.numeric",
                regex: "[0-9]+"
            }, {
                token: "constant.numeric",
                regex: "verdadeiro"
            }, {
                token: "constant.numeric",
                regex: "falso"
            }, {
                token: "comment",
                regex: "//.*$"
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