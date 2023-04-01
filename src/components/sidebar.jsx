import React, {useEffect} from 'react';
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav';
import '../styles/sidebar.css';
import playButton from '../assets/playButton.png';
import {Compiler} from '../services/analyzers/compiler.js'
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Sidebar({openTerminal}) {
    const [open, setOpen] = React.useState(false);
    const [result, setResult] = React.useState({});
    const [message, setMessage] = React.useState('');
    const [typeOfAlert, setTypeOfAlert] = React.useState('');

    const [openInOut, setOpenInOut] = React.useState(true);

    useEffect(() => {
        if(result.sucess === undefined && result.message === undefined)
            return;

        result.sucess === true ? setTypeOfAlert('success') : setTypeOfAlert('error');
        setMessage(result.message);
        handleClick();
    }, [result]);


    const handleClick = () => {
        setOpen(true);
        setOpenInOut(!openInOut);
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
                    if (selected === 'home') {
                        setResult(Compiler());
                        openTerminal();
                    }
                }}
            >
                <SideNav.Toggle/>
                <SideNav.Nav>
                    <NavItem eventKey="home">
                        <NavIcon>
                            <img src={playButton} width="20" height="20" alt="play button"/>
                        </NavIcon>
                        <NavText>
                            Executar
                        </NavText>
                    </NavItem>
                    {/*<NavItem eventKey="charts">*/}
                    {/*    <NavIcon>*/}
                    {/*        <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />*/}
                    {/*    </NavIcon>*/}
                    {/*    <NavText>*/}
                    {/*        TESTE*/}
                    {/*    </NavText>*/}
                    {/*    <NavItem eventKey="charts/linechart">*/}
                    {/*        <NavText>*/}
                    {/*            Line Chart*/}
                    {/*        </NavText>*/}
                    {/*    </NavItem>*/}
                    {/*    <NavItem eventKey="charts/barchart">*/}
                    {/*        <NavText>*/}
                    {/*            Bar Chart*/}
                    {/*        </NavText>*/}
                    {/*    </NavItem>*/}
                    {/*</NavItem>*/}
                </SideNav.Nav>
            </SideNav>
            <Stack spacing={2} sx={{width: '100%'}}>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                    <Alert onClose={handleClose} severity={typeOfAlert} sx={{width: '100%'}}>
                        {message}
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    );
}
