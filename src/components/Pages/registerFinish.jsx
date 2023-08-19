import React, {useEffect} from "react";
import Header from "./header";
import {useLocation} from "react-router-dom";
import Typography from "@mui/material/Typography";
import accept from "../../assets/accept.png";
import copy from "../../assets/copy.png";
import Tooltip from '@mui/material/Tooltip';


function RegisterFinish(props) {
    const [height, setHeight] = React.useState(null);
    const [width, setWidth] = React.useState(null);

    const [textCopy, setTextCopy] = React.useState('Clique para copiar');
    const location = useLocation();

    useEffect(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }, []);

    function getLink() {
        if (location.state) {
            return window.location.host + '/atividade/' + location.state.taskId;
        }
        return '/';
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(getLink());
        setTextCopy('Link copiado!');
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function setDefaultText() {
        await sleep(500);
        setTextCopy('Clique para copiar');
    }

    return (
        <React.Fragment id='registerFinish'>
            <div
                style={{
                    minHeight: height - 70,
                    height: 'fit-content',
                    width: width,
                    background: '#DCDCDC',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div style={{marginTop: 120}}>
                    <Typography sx={{fontWeight: '50px', fontFamily: 'Poppins', color: '#4fc123', fontSize: 48}}>
                        <img src={accept} alt="logo" width='35' height='35'
                             style={{alignSelf: 'center', marginRight: 5}}/>
                        Tarefa cadastrada com sucesso!
                    </Typography>

                    <div style={{
                        backgroundColor: '#17202A',
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingRight: 15,
                        paddingLeft: 15,
                        borderRadius: 10,
                        marginBottom: 15
                    }}>
                        <Typography sx={{fontWeight: '50px', fontFamily: 'Poppins', color: '#fff', fontSize: 32}}>
                            {getLink()}
                            <Tooltip
                                title={
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            fontFamily: 'Poppins',
                                            fontSize: 16,
                                            textAlign: 'center'
                                        }}>
                                        {textCopy}
                                    </Typography>
                                }
                                onMouseOut={setDefaultText}
                            >
                                <img
                                    src={copy}
                                    alt="logo"
                                    width='25'
                                    height='25'
                                    style={{alignSelf: 'center', marginRight: 5, marginLeft: 15}}
                                    onClick={copyToClipboard}
                                />
                            </Tooltip>
                        </Typography>
                    </div>
                    <Typography
                        sx={{fontWeight: 'thin', fontFamily: 'Poppins', fontSize: 16, textAlign: 'center'}}>
                        Compartilhe o link com seus alunos para a realização da tarefa!
                        <br/>
                        Os dados de submissões estarão disponíveis na aba de tarefas do seu perfil.
                    </Typography>
                </div>
            </div>
        </React.Fragment>
    );
}

export default RegisterFinish;