import React from 'react';
import TextField from '@mui/material/TextField';
import {styleWhite} from "../../styles/specificStyles/textFieldStyles";
import {Button} from "@mui/material";
import Card from '@mui/material/Card';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";
import {auth} from "../../services/firebase/firabaseConfig";
import Header from "./header";
import {useLocation, useNavigate} from 'react-router-dom';
import {GoogleLoginButton} from "react-social-login-buttons";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from "@mui/material/Typography";
import Swal from 'sweetalert2';
import {db} from "../../services/firebase/firabaseConfig";
import {browserSessionPersistence, browserLocalPersistence, setPersistence} from "firebase/auth";
import {collection, addDoc, setDoc, doc, getDoc} from "firebase/firestore";

export default function Login(height, width, redirectUrl) {
    const [email, setEmail] = React.useState('');
    const [emailLogin, setEmailLogin] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordLogin, setPasswordLogin] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [name, setName] = React.useState('');
    const [isTeacher, setIsTeacher] = React.useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    async function register() {
        Swal.fire({
            title: 'Cadastrando usuário...',
        });
        Swal.showLoading();

        // verificar se possui registro com o email
        const docRef = doc(db, "users", "SF");
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user;
                addDoc(collection(db, "users"), {
                    name: name,
                    email: email,
                    isTeacher: isTeacher,
                    uid: user.uid
                }).then(async (docRef) => {
                    await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                        const user = userCredential.user;
                        persistLogin();
                        Swal.close()
                        navigate(location.state.redirectUrl ? location.state.redirectUrl : '/');
                    }).catch((error) => {
                        const errorMessage = error.message;
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Erro ao entrar: ' + errorMessage,
                        });
                    });
                }).catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Erro ao cadastrar: ' + error,
                    });
                });
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Erro ao cadastrar: ' + errorMessage,
                });
            });
        }
    }

    async function loginEmailPassword() {
        Swal.fire({
            title: 'Entrando...',
        });
        Swal.showLoading();
        await signInWithEmailAndPassword(auth, emailLogin, passwordLogin).then((userCredential) => {
            const user = userCredential.user;
            Swal.close();
            persistLogin();
            navigate(location.state.redirectUrl ? location.state.redirectUrl : '/');
        }).catch((error) => {
            const errorMessage = error.message;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Erro ao entrar: ' + errorMessage,
            });
        });
    }

    function persistLogin() {
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password);
            })
            .catch((error) => {
            });
    }

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

            <div style={{height: height.height - 70, width: width, backgroundColor: '#263238'}}>
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
                                sx={styleWhite}
                                style={{marginBottom: 20, marginTop: 20, width: 300}}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                id="emailArara"
                                label="E-mail"
                                variant="outlined"
                                sx={styleWhite}
                                style={{marginBottom: 20, width: 300}}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                id="passwordArara"
                                label="Senha"
                                variant="outlined"
                                sx={styleWhite}
                                style={{marginBottom: 20, width: 300}}
                                value={password}
                                type={'password'}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                id="confirmPasswordArara"
                                label="Confirme sua senha"
                                variant="outlined"
                                error={(password !== passwordConfirm) && passwordConfirm !== ''}
                                sx={styleWhite}
                                style={{marginBottom: 10, width: 300}}
                                value={passwordConfirm}
                                type={'password'}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                            />

                            <FormGroup>
                                <FormControlLabel
                                    style={{marginBottom: 10}}
                                    control={<Checkbox value={isTeacher}
                                                       onChange={(e) => setIsTeacher(e.target.checked)}/>}
                                    label={
                                        <Typography sx={{
                                            fontWeight: 'bold',
                                            fontFamily: 'Poppins',
                                            color: '#fff',
                                            fontSize: 16
                                        }}>
                                            Sou professor?
                                        </Typography>
                                    }
                                />

                            </FormGroup>

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
                                onClick={register}
                                type={'submit'}
                            >
                                Cadastrar
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
                                id="emailAraraLogin"
                                label="E-mail"
                                variant="outlined"
                                sx={styleWhite}
                                style={{marginBottom: 20, marginTop: 20, width: 300}}
                                value={emailLogin}
                                onChange={(e) => setEmailLogin(e.target.value)}
                            />
                            <TextField
                                id="passwordAraraLogin"
                                label="Senha"
                                variant="outlined"
                                sx={styleWhite}
                                style={{marginBottom: 20, width: 300}}
                                value={passwordLogin}
                                type={'password'}
                                onChange={(e) => setPasswordLogin(e.target.value)}
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
                                onClick={loginEmailPassword}
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