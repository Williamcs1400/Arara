import React, {useEffect, useState} from "react";
import CustomRadioGroup from "./subComponents/customRadioGroup";
import Typography from "@mui/material/Typography";
import {options, subOptions, texts} from "../../services/documentation/texts";
import AceEditor from "react-ace";
import CustomAraraMode from "../../services/utils/CustomAraraMode";
import CodeTeste from "./subComponents/codeEditorTeste";
import {getCodeExample, setCodeExample} from "../../services/analyzers/compiler";
import {Button} from "@mui/material";

function Documentation(props) {
    const [chosen, setChosen] = useState({selected: -1, subSelected: -1});

    function setOptions(chosen) {
        setChosen(chosen);
    }

    const textByChosen = (obj) => {
        return texts[obj.selected][obj.subSelected];
    }

    useEffect(() => {
        const customMode = new CustomAraraMode();
        // aceEditor.editor.getSession().setMode(customMode);
    })

    const showCodeEditor = (chosenAux) => {
        setCodeExample(textByChosen(chosenAux));
        return (
            <div>
                <CodeTeste value={getCodeExample()} width={1000} height={550}/>
            </div>
        )
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(getCodeExample());
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <div style={{width: '17%'}}>
                <CustomRadioGroup options={options} subOptions={subOptions} setChosen={setOptions}/>
            </div>
            <div style={{borderLeft: '1px solid #fff', marginLeft: 50, paddingLeft: 20}}/>
            <div style={{marginLeft: 10, marginTop: 20, textAlign: 'center', width: '100%', flexDirection: 'column'}}>
                {(chosen.selected === -1 && chosen.subSelected === -1) ?
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Poppins',
                            fontSize: 16,
                            textAlign: 'center',
                            color: '#9e9e9e'
                        }}>
                        Selecione uma opção para visualizar a documentação
                    </Typography>
                    :
                    (chosen.selected === 0) ?
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontFamily: 'Poppins',
                                fontSize: 16,
                                textAlign: 'center',
                                color: '#fff'
                            }}>
                            {texts[chosen.selected][chosen.subSelected]}
                        </Typography>
                        :
                        <div>
                            {showCodeEditor(chosen)}

                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#17202a',
                                    fontFamily: 'Poppins',
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    width: 200,
                                    height: 50,
                                    borderRadius: 5,
                                    marginTop: 15,
                                    textTransform: 'none',
                                    alignSelf: 'center'
                                }}
                                onClick={copyToClipboard}
                            >
                                Copiar código
                            </Button>
                        </div>
                }
            </div>
        </div>
    );
}

export default Documentation;