import Header from "./Pages/header";
import React from "react";
import logo512 from "../assets/logo512.png";
import lighBulb from "../assets/lightBulb.png";
import task from "../assets/task.png";
import documentation from "../assets/documentation.png";
import Typewriter from 'typewriter-effect';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom";
// import firebase from "firebase";

function Main(height, width) {
    const navigate = useNavigate();

    function openFreeMode() {
        navigate('/livre');
    }

    function openTaskMode() {
        navigate('/atividade');
    }

    function openDocumentation() {
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
                    <img src={image} alt="logo" width='50' height='50' style={{marginTop: 10}}/>
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
        <div>
            <Header showIcon={false} showButtonLogin={true} redirectUrl={'/'}/>
            <div style={{height: height.height - 70, width: width, background: '#263238'}}>
                <div style={{display: 'flex', flexDirection: 'column', marginRight: 20, marginLeft: 20}}>
                    <img src={logo512} alt="logo" width='175' height='175'
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

                    </div>
                </div>
            </div>
        </div>
    );

}

export default Main;