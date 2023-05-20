import React from 'react';
import AceEditor from 'react-ace';
import CustomAraraMode from '../../services/utils/CustomAraraMode.js';
import {defaultCode} from '../../services/utils/definitions.js';
import {setCodeFromEditor} from "../../services/analyzers/compiler";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: defaultCode,
            height: props.height,
            width: props.width
        }
        setCodeFromEditor(defaultCode);
    }
    componentDidMount() {
        const customMode = new CustomAraraMode();
        this.refs.aceEditor.editor.getSession().setMode(customMode);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.height !== this.props.height || prevProps.width !== this.props.width) {
            this.setState({
                height: this.props.height,
                width: this.props.width
            });
        }
    }

    onChange(newValue) {
        this.setState({
            value: newValue
        });
        setCodeFromEditor(newValue);
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
                    height={this.state.height ? this.state.height - 71 : 500}
                    width={this.state.width ? this.state.width - 64 : 500}
                    fontSize={21}
                />
            </div>
        );
    }
}

export default App;