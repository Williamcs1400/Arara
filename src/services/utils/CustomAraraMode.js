import 'brace/mode/java';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-json';

window.ace = require('ace-builds/src-noconflict/ace');
export class CustomHighlightRules extends window.ace.acequire('ace/mode/text_highlight_rules').TextHighlightRules {
    constructor() {
        super();
        this.$rules = {
            'start': [{
                token: 'constant.numeric',
                regex: '#INICIO_PROGRAMA;'
            }, {
                token: 'constant.numeric',
                regex : '#FIM_PROGRAMA;'
            }, {
                token: 'string',
                regex : "'.*?'"
            }, {
                token: 'entity.name.function',
                regex: '\\bleia\\b'
            }, {
                token: 'entity.name.function',
                regex: '\\bescreva\\b'
            }, {
                token: 'keyword.operator',
                regex: '\\binteiro\\b'
            }, {
                token: 'keyword.operator',
                regex: '\\breal\\b'
            }, {
                token: 'keyword.operator',
                regex: '\\btexto\\b'
            }, {
                token: 'keyword.operator',
                regex: '\\blogico\\b'
            },{
                token: 'keyword.operator',
                regex: '\\bse\\b'
            },{
                token: 'constant.numeric',
                regex: '\\b[0-9]\\b'
            }, {
                token: 'keyword.operator',
                regex: /!|==|!=|>|<|>=|<=|&&|\|\|/
            }, {
                token: 'constant.numeric',
                regex: '\\bverdadeiro\\b'
            }, {
                token: 'constant.numeric',
                regex: '\\bfalso\\b'
            }, {
                token: 'comment',
                regex: '//.*$'
            }, {
                // aceitar exatamente a palavra 'se' e não palavras que contenham 'se'
                token: 'keyword.operator',
                regex: '\\bse\\b'
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