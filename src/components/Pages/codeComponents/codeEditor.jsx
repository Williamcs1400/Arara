import React from 'react';
import AceEditor from 'react-ace';
import CustomAraraMode from '../../../services/utils/CustomAraraMode.js';
import {getCodeFromEditor, setCodeFromEditor} from "../../../services/analyzers/compiler";

class App extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: getCodeFromEditor(),
            height: props.height,
            width: props.width
        }
        setCodeFromEditor(getCodeFromEditor());
    }

    componentDidMount() {
        const customMode = new CustomAraraMode();
        this.refs.aceEditor.editor.getSession().setMode(customMode);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.height !== this.props.height || prevProps.width !== this.props.width) {
            this.setState({
                height: prevProps.height,
                width: prevProps.width
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
                    height={this.props.height ? this.props.height - 70 : 500}
                    width={this.props.width ? this.props.width - 64 : 500}
                    fontSize={21}
                />
            </div>
        );
    }
}

export default App;