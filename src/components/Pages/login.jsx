import React from 'react';
import TextField from '@mui/material/TextField';
import {style} from "../../styles/specificStyles/textFiledWhite";
import {Button} from "@mui/material";
import Card from '@mui/material/Card';
import {
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import {auth} from "../../services/firebase/firabaseConfig";
import Header from "./header";

import {useLocation, useNavigate} from 'react-router-dom';
import {GoogleLoginButton} from "react-social-login-buttons";

export default function Login(height, width, redirectUrl) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [name, setName] = React.useState('');

    const location = useLocation();
    const navigate = useNavigate();

    function doLogin(email, password) {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                navigate(location.state.redirectUrl ? location.state.redirectUrl : '/');

            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    return (
        <div>
            <Header showIcon={true}/>

            <div style={{height: height.height - 71, width: width, backgroundColor: '#263238'}}>
                <div style={{display: 'table', clear: 'both', content: '', alignItems: 'center'}}>
                    <div style={{float: 'left', width: 'fit-content', marginLeft: 150}}>
                        <Card style={{
                            backgroundColor: '#17202A',
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: 50,
                            marginRight: 150,
                            width: 'fit-content',
                            alignItems: 'center',
                            paddingTop: 15,
                            paddingLeft: 35,
                            paddingRight: 35,
                        }}>
                            <h7 style={{
                                color: '#ffffff',
                                fontSize: 22,
                                marginTop: 10,
                                textAlign: 'center',
                                fontFamily: 'Poppins',
                                textShadow: '0px 4px 4px rgba(0, 0, 0, 0.50)'
                            }}>
                                Não tem cadastro? Registre-se no Arara!
                            </h7>
                            <TextField
                                id="nameArara"
                                label="Nome completo"
                                variant="outlined"
                                sx={style}
                                style={{marginBottom: 20, marginTop: 20, width: 300}}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                id="emailArara"
                                label="E-mail"
                                variant="outlined"
                                sx={style}
                                style={{marginBottom: 20, width: 300}}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                id="passwordArara"
                                label="Senha"
                                variant="outlined"
                                sx={style}
                                style={{marginBottom: 20, width: 300}}
                                value={password}
                                type={'password'}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                id="confirmPasswordArara"
                                label="Confirme sua senha"
                                variant="outlined"
                                sx={style}
                                style={{marginBottom: 20, width: 300}}
                                value={password}
                                type={'password'}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#17202a',
                                    fontFamily: 'Poppins',
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    width: 300,
                                    height: 50,
                                    borderRadius: 5,
                                    textTransform: 'none'
                                }}
                                onClick={doLogin}
                                type={'submit'}
                            >
                                Entrar
                            </Button>

                            <hr style={{width: '75%', marginTop: 15}}/>

                            <GoogleLoginButton
                                text={'Entrar com o Google'}
                                style={{
                                    width: 300,
                                    height: 50,
                                    borderRadius: 5,
                                    marginBottom: 20,
                                    textTransform: 'none',
                                    fontFamily: 'Poppins',
                                    fontSize: 18,
                                    fontWeight: 'bold'
                                }}
                                onClick={() => alert("Hello")}/>

                        </Card>
                    </div>
                    <div style={{float: 'left', width: 'fit-content', marginLeft: 100}}>
                        <Card style={{
                            backgroundColor: '#17202A',
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: 50,
                            marginRight: 150,
                            width: 'fit-content',
                            alignItems: 'center',
                            paddingTop: 15,
                            paddingLeft: 35,
                            paddingRight: 35,
                        }}>
                            <h7 style={{
                                color: '#ffffff',
                                fontSize: 22,
                                marginTop: 10,
                                textAlign: 'center',
                                fontFamily: 'Poppins',
                                textShadow: '0px 4px 4px rgba(0, 0, 0, 0.50)'
                            }}>
                                Já tem cadastro? Entre no Arara!
                            </h7>
                            <TextField
                                id="emailArara"
                                label="E-mail"
                                variant="outlined"
                                sx={style}
                                style={{marginBottom: 20, marginTop: 20, width: 300}}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                id="passwordArara"
                                label="Senha"
                                variant="outlined"
                                sx={style}
                                style={{marginBottom: 20, width: 300}}
                                value={password}
                                type={'password'}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#17202a',
                                    fontFamily: 'Poppins',
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    width: 300,
                                    height: 50,
                                    borderRadius: 5,
                                    textTransform: 'none'
                                }}
                                onClick={doLogin}
                                type={'submit'}
                            >
                                Entrar
                            </Button>

                            <hr style={{width: '100%', marginTop: 15}}/>

                            <GoogleLoginButton
                                text={'Entrar com o Google'}
                                style={{
                                    width: 300,
                                    height: 50,
                                    borderRadius: 5,
                                    marginBottom: 20,
                                    textTransform: 'none',
                                    fontFamily: 'Poppins',
                                    fontSize: 18,
                                    fontWeight: 'bold'
                                }}
                                onClick={doLogin}/>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}