import React, {useEffect} from "react";
import Sidebar from "./sidebar";
import CodeEditor from "./codeEditor";
import InOut from "./in_out";
import Swal from "sweetalert2";
import {startTest} from "../../../services/judge/judge";

function Ide(props) {
    const [openTerminal, setOpenTerminal] = React.useState(false);
    const [executedCode, setExecutedCode] = React.useState([]);
    const [height, setHeight] = React.useState(null);
    const [width, setWidth] = React.useState(null);
    const [isTask, setIsTask] = React.useState(false);
    const [flagTaskInfo, setFlagTaskInfo] = React.useState(false);
    const [terminalHeight, setTerminalHeight] = React.useState(0);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [colorOutput, setColorOutput] = React.useState('#fff');

    // Atualiza o tamanho da tela
    useEffect(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }, []);

    // Abre ou fecha o terminal e executa o código - adequando o tamanho da tela
    function executeCode(message) {
        setErrorMessage('');
        if (message !== undefined) {
            setExecutedCode(message);
            setTerminalHeight((height / 3) + 150)
            setOpenTerminal(true);
        } else {
            setExecutedCode(message);
            setTerminalHeight(0)
            setOpenTerminal(false);
        }
    }

    // Abre ou fecha o terminal e mostra o erro - adequando o tamanho da tela
    function executeCodeError(message) {
        setExecutedCode('');
        setColorOutput('#FF2E44');
        if (message !== undefined) {
            setErrorMessage(message)
            setTerminalHeight((height / 3) + 150)
            setOpenTerminal(true);
        } else {
            setErrorMessage(message)
            setTerminalHeight(0)
            setOpenTerminal(false);
        }
    }

    // Abre ou fecha o terminal sem executar o código - adequando o tamanho da tela
    function handleTerminal() {
        setTerminalHeight((height / 3) + 150)
        setOpenTerminal(true);
    }

    function openTaskInfo() {
        Swal.fire({
            title: '<label style="color: #FFFFFF; font-family: Poppins; font-size: 32px; text-align: center">Informações da atividade</label>',
            background: '#2F2F2F',
            html: '<div style="color: #FFFFFF; font-family: Poppins; font-size: 24px; text-align: justify">' +
                '<label style="font-weight: bold">Nome: </label><label>' + props.dataTask.name + '</label>' +
                '<br/>' +
                '<label style="font-weight: bold">Descrição: </label><label>' + props.dataTask.description + '</label>' +
                '<hr style="border: 1px solid #FFFFFF"/>' +
                '<label style="font-weight: bold">Formato de entrada: </label><label>' + props.dataTask.inputFormat + '</label>' +
                '<br/>' +
                '<label style="font-weight: bold">Formato de saída: </label><label>' + props.dataTask.outputFormat + '</label>' +
                '<hr style="border: 1px solid #FFFFFF"/>' +
                '<label style="font-weight: bold">Exemplo: </label><label>' + props.dataTask.outputExample + '</label></div>',
            showCloseButton: true,
            showConfirmButton: false,
            width: '45%'
        });
    }

    function startTestSolution() {
        Swal.fire({
            title: '<label style="color: #FFFFFF; font-family: Poppins; font-size: 32px; text-align: center">Avaliação</label>',
            html: '<div style="color: #FFFFFF; font-family: Poppins; font-size: 24px; text-align: justify; text-align: center">' +
                '<label style="font-weight: bold; text-align: center;">Gostaria de submeter a solução ao juiz online?</label></div>',
            background: '#2F2F2F',
            showCancelButton: true,
            confirmButtonText: 'Submeter',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#85d249',
            cancelButtonColor: '#ff4155',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '<label style="color: #FFFFFF; font-family: Poppins; font-size: 32px; text-align: center">Avaliação</label>',
                    html: '<div style="color: #FFFFFF; font-family: Poppins; font-size: 24px; text-align: justify; text-align: center">' +
                        '<label style="font-weight: bold; text-align: center;">Analisando...</label></div>',
                    background: '#2F2F2F',
                });
                Swal.showLoading();
                const save = JSON.parse(JSON.stringify(props.tests));
                startTest(save).then(async (response) => {
                    if (response.success) {
                        await props.saveAttempt(response).then((response) => {
                            Swal.fire({
                                title: '<label style="color: #FFFFFF; font-family: Poppins; font-size: 32px; text-align: center">Resposta aceita!</label>',
                                html: '<div style="color: #FFFFFF; font-family: Poppins; font-size: 24px; text-align: justify; text-align: center">' +
                                    '<label style="font-weight: bold; text-align: center;">Sua submissão foi salva.</label></div>',
                                icon: 'success',
                                background: '#2F2F2F'
                            });
                        });
                    } else {
                        props.saveAttempt(response).then((res) => {
                            Swal.fire({
                                title: '<label style="color: #FFFFFF; font-family: Poppins; font-size: 32px; text-align: center">Resposta Recusada!</label>',
                                html: '<div style="color: #FFFFFF; font-family: Poppins; font-size: 24px; text-align: justify; text-align: center">' +
                                    '<label style="font-weight: thin;">Sua solução está: </label>' +
                                    '<label style="font-weight: bold;">' + response.detail + '</label>' +
                                    '<label style="font-weight: thin;">% correta.</label></div>',
                                icon: 'error',
                                background: '#2F2F2F'
                            });
                        });
                    }
                }).catch((error) => {
                    Swal.close();
                });
            }
        })
    }

    useEffect(() => {
        if (props.isTask !== undefined) {
            setIsTask(props.isTask);
            if (props.isTask && props.dataTask.name !== undefined && !flagTaskInfo) {
                openTaskInfo();
                setFlagTaskInfo(true);
            }
        }
    }, [props]);

    return (
        <React.Fragment id='ide'>
            <div style={{
                display: 'flex',
                flex: 1,
                justifyItems: 'start',
                alignItems: 'start',
                flexDirection: 'column',
                position: 'absolute'
            }}>
                <div>
                    <Sidebar executeCode={executeCode} executeCodeError={executeCodeError} openTerminal={handleTerminal} isTask={isTask}
                             openTaskInfo={openTaskInfo} startTestSolution={startTestSolution}/>
                </div>

                <div style={{marginLeft: 64}}>
                    <CodeEditor height={height - terminalHeight} width={width}/>
                    {openTerminal ? <InOut height={terminalHeight} width={width} closeTerminal={executeCode}
                                           executableCode={executedCode} errorMessage={errorMessage}/> : null}
                </div>
            </div>
        </React.Fragment>
    );

}

export default Ide;