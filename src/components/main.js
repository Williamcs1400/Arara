import React, {useEffect} from 'react';
import logo512 from '../assets/logo512.png';
import lighBulb from '../assets/lightBulb.png';
import task from '../assets/task.png';
import documentation from '../assets/documentation.png';
import Typewriter from 'typewriter-effect';
import Box from '@mui/material/Box';
import {useNavigate} from 'react-router-dom';
import Documentation from "./Pages/documentation";
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';

function Main() {
    const [height, setHeight] = React.useState(null);
    const [width, setWidth] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function openFreeMode() {
        navigate('/livre');
    }

    function openTaskMode() {
        navigate('/atividade');
    }

    function openDocumentation() {
        handleClickOpen();
    }

    const boxOptions = (image, text, call) => {
        return (
            <Box
                sx={{width: 170, height: 100, backgroundColor: '#17202A', borderRadius: 5,
                    '&:hover': {
                        backgroundColor: '#17202A',
                        boxShadow: 'inset 0 0 100px 100px rgba(255, 244, 66, 0.5)',
                        cursor: 'pointer'
                    },

                }}
                style={{alignSelf: 'center', textAlign: 'center', marginTop: 25, marginRight: 15}}
                onClick={() => call()}
            >
                <div
                    style={{flexDirection: 'column', marginRight: 20, marginLeft: 20, textAlign: 'center'}}>
                    <img src={image} alt='logo' width='50' height='50' style={{marginTop: 10}}/>
                    <br/>
                    <h7 style={{
                        color: '#ffffff', fontSize: 18, marginTop: 10, textAlign: 'center',
                        fontFamily: 'Poppins', textShadow: '0px 3px 3px rgba(0, 0, 0, 0.50)'
                    }}>
                        {text}
                    </h7>
                </div>
            </Box>
        )
    }

    return (
        <React.Fragment id='main'>
            <div style={{height: height - 70, width: width, background: '#263238'}}>
                <div style={{display: 'flex', flexDirection: 'column', marginRight: 20, marginLeft: 20}}>
                    <img src={logo512} alt='logo' width='175' height='175'
                         style={{alignSelf: 'center', marginLeft: 15, marginTop: 25}}/>
                    <h7 style={{
                        color: '#ff4155', fontSize: 32, marginTop: 10, textAlign: 'center', fontWeight: 'bold',
                        fontFamily: 'Poppins', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.80)'
                    }}>
                        <Typewriter
                            options={{
                                strings: ['Arara - Editor e juiz online', 'Saber português é tudo que você precisa!', 'Professor, avalie seus alunos com o nosso juiz online!'],
                                autoStart: true,
                                loop: true,
                                delay: 50,
                                deleteSpeed: 25,
                            }}
                        />
                    </h7>

                    <div style={{display: 'flex', flexDirection: 'row', alignSelf: 'center'}}>

                        {boxOptions(lighBulb, 'Modo livre', openFreeMode)}
                        {boxOptions(task, 'Modo tarefa', openTaskMode)}
                        {boxOptions(documentation, 'Documentação', openDocumentation)}

                        <Modal
                            aria-labelledby="modal-doc"
                            aria-describedby="modal-desc"
                            open={open}
                            onClose={() => setOpen(false)}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%',}}
                        >
                            <Sheet
                                variant="solid"
                                sx={{
                                    width: '80%',
                                    height: '80%',
                                    borderRadius: 'md',
                                    p: 3,
                                    boxShadow: 'md',
                                    bgcolor: '#17202A',

                                }}
                            >
                                <ModalClose
                                    variant="outlined"
                                    sx={{
                                        top: 'calc(-1/4 * var(--IconButton-size))',
                                        right: 'calc(-1/4 * var(--IconButton-size))',
                                        boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
                                        borderRadius: '50%',
                                        bgcolor: 'background.surface',
                                    }}
                                />
                                <Documentation/>
                            </Sheet>
                        </Modal>

                    </div>
                </div>
            </div>
        </React.Fragment>
    );

}

export default Main;