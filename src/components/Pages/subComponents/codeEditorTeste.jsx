import React from 'react';
import AceEditor from 'react-ace';
import CustomAraraMode from '../../../services/utils/CustomAraraMode.js';
import {getCodeExample, setCodeFromEditor, setCodeExample} from "../../../services/analyzers/compiler";

class CodeTeste extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            height: props.height,
            width: props.width
        }
        setCodeExample(props.value);
    }

    componentDidMount() {
        const customMode = new CustomAraraMode();
        this.refs.aceEditor.editor.getSession().setMode(customMode);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.height !== this.props.height || prevProps.width !== this.props.width || prevProps.value !== this.props.value) {
            this.setState({
                height: this.props.height,
                width: this.props.width,
                value: getCodeExample()
            });
        }
    }

    onChange(newValue) {
        this.setState({
            value: getCodeExample()
        });
        setCodeExample(newValue);
    }

    render() {
        return (
            <div className="App">
                <AceEditor
                    ref="aceEditor"
                    mode="text"
                    theme="monokai"
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                    height={this.state.height ? this.state.height - 70 : 500}
                    width={this.state.width ? this.state.width - 64 : 500}
                    fontSize={20}
                />
            </div>
        );
    }
}

export default CodeTeste;