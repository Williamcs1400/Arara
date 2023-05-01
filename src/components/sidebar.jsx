import React, {useEffect} from 'react';
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav';
import '../styles/sidebar.css';
import {Compiler} from '../services/analyzers/compiler.js'
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import playButton from '../assets/playButton.png';
import terminalButton from '../assets/terminal.png';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Sidebar({executeCode, openTerminal}) {
    const [open, setOpen] = React.useState(false);
    const [result, setResult] = React.useState({});
    const [message, setMessage] = React.useState('');
    const [typeOfAlert, setTypeOfAlert] = React.useState('');

    useEffect(() => {
        if(result.sucess === undefined && result.message === undefined)
            return;

        result.sucess === true ? setTypeOfAlert('success') : setTypeOfAlert('error');
        setMessage(result.message);

        if(result.sucess === true)
            executeCode(result.executableCode);

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
                        setResult(Compiler());
                    }
                    if (selected === 'terminal') {
                        openTerminal();
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
                            Executar
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

                </SideNav.Nav>
            </SideNav>
            <Stack spacing={2} sx={{width: '100%'}}>
                <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                    <Alert onClose={handleClose} severity={typeOfAlert} sx={{width: '100%'}}>
                        {message}
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    );
}
