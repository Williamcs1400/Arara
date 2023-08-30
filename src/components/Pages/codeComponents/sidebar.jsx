import React, {useEffect} from 'react';
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav';
import '../../../styles/sidebar.css';
import {compilerFromCodeEditor} from '../../../services/analyzers/compiler.js'
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import playButton from '../../../assets/playButton.png';
import terminalButton from '../../../assets/terminal.png';
import judge from '../../../assets/judge.png';
import infoTask from '../../../assets/infoTask.png';
import personRed from '../../../assets/personRed.png';
import logo512 from '../../../assets/logo512.png';
import {useNavigate} from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Sidebar({executeCode, executeCodeError, openTerminal, isTask, openTaskInfo, startTestSolution}) {
    const [open, setOpen] = React.useState(false);
    const [result, setResult] = React.useState({});
    const [message, setMessage] = React.useState('');
    const [typeOfAlert, setTypeOfAlert] = React.useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (result.sucess === undefined && result.message === undefined)
            return;

        result.sucess === true ? setTypeOfAlert('success') : setTypeOfAlert('error');
        setMessage(result.sucess ? 'Código compilado com sucesso!' : 'Erro ao compilar o código!');

        if (result.sucess === true) {
            executeCode(result.executableCode);
        }else{
            executeCodeError(result.message);
        }
        handleClick();
    }, [result]);


    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <SideNav
                onSelect={(selected) => {
                    if (selected === 'execute') {
                        setResult(compilerFromCodeEditor());
                    }
                    if (selected === 'terminal') {
                    }
                    if (selected === 'judge') {
                        startTestSolution();
                    }
                    if (selected === 'infoTask') {
                        openTaskInfo();
                    }
                    if (selected === 'login') {
                        window.location.href = '/#/entrar';
                    }
                    if (selected === 'home') {
                        navigate('/');
                    }
                }}
            >
                <SideNav.Toggle/>
                <SideNav.Nav>

                    <NavItem eventKey="execute">
                        <NavIcon style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src={playButton} width="20" height="20" alt="play button"/>
                        </NavIcon>
                        <NavText>
                            {isTask ? 'Testar' : 'Executar'}
                        </NavText>
                    </NavItem>

                    <NavItem eventKey="terminal">
                        <NavIcon style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src={terminalButton} width="28" height="28" alt="terminal button"/>
                        </NavIcon>
                        <NavText>
                            Abrir terminal
                        </NavText>
                    </NavItem>

                    {isTask &&
                        <NavItem eventKey="judge">
                            <NavIcon style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <img src={judge} width="28" height="28" alt="terminal button"/>
                            </NavIcon>
                            <NavText>
                                Submter para avaliação
                            </NavText>
                        </NavItem>
                    }

                    {isTask &&
                        <NavItem eventKey="infoTask">
                            <NavIcon style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <img src={infoTask} width="28" height="28" alt="terminal button"/>
                            </NavIcon>
                            <NavText>
                                Descrição da tarefa
                            </NavText>
                        </NavItem>
                    }

                    <NavItem eventKey="login">
                        <NavIcon style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src={personRed} width="28" height="28" alt="loggin button"/>
                        </NavIcon>
                        <NavText>
                            Entrar no Arara
                        </NavText>
                    </NavItem>

                    <NavItem eventKey="home">
                        <NavIcon style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src={logo512} width="28" height="28" alt="loggin home"/>
                        </NavIcon>
                        <NavText>
                            Voltar para o início
                        </NavText>
                    </NavItem>




                </SideNav.Nav>

            </SideNav>
            <Stack spacing={2} sx={{width: '100%'}}>
                <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}
                          anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                    <Alert onClose={handleClose} severity={typeOfAlert} sx={{width: '100%'}}>
                        {message}
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    )
        ;
}
