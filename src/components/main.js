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
        navigate('/ide');
    }

    function openTaskMode() {
        navigate('/registerTask');
    }

    function openDocumentation() {
    }

    return (
        <div>
            <Header showIcon={false} showButtonLogin={true} redirectUrl={'/'}/>
            <div style={{height: height.height - 70, width: width, background: '#263238'}}>
                <div style={{display: 'flex', flexDirection: 'column', marginRight: 20, marginLeft: 20}}>
                    <img src={logo512} alt="logo" width='175' height='175'
                         style={{alignSelf: 'center', marginLeft: 15, marginTop: 25}}/>
                    <h7 style={{
                        color: '#ff4155',
                        fontSize: 32,
                        marginTop: 10,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontFamily: 'Poppins',
                        textShadow: '0px 4px 4px rgba(0, 0, 0, 0.80)'
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

                        <Box
                            sx={{
                                width: 170,
                                height: 100,
                                backgroundColor: '#17202A',
                                '&:hover': {
                                    backgroundColor: '#17202A',
                                    boxShadow: 'inset 0 0 100px 100px rgba(255, 244, 66, 0.5)',
                                    cursor: 'pointer'
                                },
                                borderRadius: 5
                            }}
                            style={{alignSelf: 'center', textAlign: 'center', marginTop: 25, marginRight: 15}}
                            onClick={() => openFreeMode()}
                        >
                            <div
                                style={{flexDirection: 'column', marginRight: 20, marginLeft: 20, textAlign: 'center'}}>
                                <img src={lighBulb} alt="logo" width='50' height='50' style={{marginTop: 10}}/>
                                <br/>
                                <h7 style={{
                                    color: '#ffffff',
                                    fontSize: 18,
                                    marginTop: 10,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins',
                                    textShadow: '0px 3px 3px rgba(0, 0, 0, 0.50)'
                                }}>
                                    Modo livre
                                </h7>
                            </div>

                        </Box>

                        <Box
                            sx={{
                                width: 170,
                                height: 100,
                                backgroundColor: '#17202A',
                                '&:hover': {
                                    backgroundColor: '#17202A',
                                    boxShadow: 'inset 0 0 100px 100px rgba(255, 244, 66, 0.5)',
                                    cursor: 'pointer'
                                },
                                borderRadius: 5
                            }}
                            style={{alignSelf: 'center', textAlign: 'center', marginTop: 25, marginRight: 15}}
                            onClick={() => openTaskMode()}
                        >
                            <div
                                style={{flexDirection: 'column', marginRight: 20, marginLeft: 20, textAlign: 'center'}}>
                                <img src={task} alt="logo" width='50' height='50' style={{marginTop: 10}}/>
                                <br/>
                                <h7 style={{
                                    color: '#ffffff',
                                    fontSize: 18,
                                    marginTop: 10,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins',
                                    textShadow: '0px 3px 3px rgba(0, 0, 0, 0.50)'
                                }}>
                                    Modo tarefa
                                </h7>
                            </div>

                        </Box>

                        <Box
                            sx={{
                                width: 170,
                                height: 100,
                                backgroundColor: '#17202A',
                                '&:hover': {
                                    backgroundColor: '#17202A',
                                    boxShadow: 'inset 0 0 100px 100px rgba(255, 244, 66, 0.5)',
                                    cursor: 'pointer'
                                },
                                borderRadius: 5
                            }}
                            style={{alignSelf: 'center', textAlign: 'center', marginTop: 25}}
                            onClick={() => openDocumentation()}
                        >
                            <div
                                style={{flexDirection: 'column', marginRight: 20, marginLeft: 20, textAlign: 'center'}}>
                                <img src={documentation} alt="logo" width='50' height='50' style={{marginTop: 10}}/>
                                <br/>
                                <h7 style={{
                                    color: '#ffffff',
                                    fontSize: 18,
                                    marginTop: 10,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins',
                                    textShadow: '0px 3px 3px rgba(0, 0, 0, 0.50)'
                                }}>
                                    Documentação
                                </h7>
                            </div>
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Main;