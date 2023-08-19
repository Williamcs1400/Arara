import React, {useEffect} from 'react';
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
import {useLocation, useNavigate} from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from "@mui/material/Typography";
import Swal from 'sweetalert2';
import {db} from "../../services/firebase/firabaseConfig";
import {browserLocalPersistence, setPersistence} from "firebase/auth";
import {collection, addDoc, updateDoc, doc, getDoc} from "firebase/firestore";

export default function Login({redirectUrl, alterHeader, getUserData}) {
    const [height, setHeight] = React.useState(null);
    const [width, setWidth] = React.useState(null);
    const [option, setOption] = React.useState('initial');
    const [email, setEmail] = React.useState('');
    const [emailLogin, setEmailLogin] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordLogin, setPasswordLogin] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [name, setName] = React.useState('');
    const [isTeacher, setIsTeacher] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }, []);

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
                    uid: ''
                }).then(async (docRef) => {
                    await updateDoc(doc(db, "users", docRef.id), {
                        uid: docRef.id
                    });
                    await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                        const user = userCredential.user;
                        persistLogin();
                        getUserData();
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
            getUserData();
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
                getUserData();

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

    const loginComponent = () => {
        return (
            <div style={{display: 'flex', justifyContent: 'center', height: '100%', width: '100'}}>
                <Card style={{
                    backgroundColor: '#17202A',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: 15,
                    width: 'fit-content',
                    height: 'fit-content',
                    alignItems: 'center',
                    paddingTop: 15,
                    paddingLeft: 35,
                    paddingRight: 35,
                    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.50)'
                }}>
                    <h7 style={{
                        color: '#ffffff',
                        fontSize: 22,
                        marginTop: 10,
                        textAlign: 'center',
                        fontFamily: 'Poppins',
                        textShadow: '0px 4px 4px rgba(0, 0, 0, 0.50)'
                    }}>
                        Entrar no Arara!
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

                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Poppins',
                            fontSize: 18,
                            color: '#fff',
                            marginBottom: 2,
                            cursor: 'pointer'
                        }}
                        onClick={() => setOption('register')}
                    >
                        Ainda não possui cadastro?
                    </Typography>

                    {/*TODO: fazer funcionar depois*/}
                    {/*<GoogleLoginButton*/}
                    {/*    text={'Entrar com o Google'}*/}
                    {/*    style={{*/}
                    {/*        width: 300,*/}
                    {/*        height: 50,*/}
                    {/*        borderRadius: 5,*/}
                    {/*        marginBottom: 20,*/}
                    {/*        textTransform: 'none',*/}
                    {/*        fontFamily: 'Poppins',*/}
                    {/*        fontSize: 18,*/}
                    {/*        fontWeight: 'bold'*/}
                    {/*    }}*/}
                    {/*    onClick={doLogin}/>*/}
                </Card>
            </div>
        );
    }

    const registerComponent = () => {
        return (
            <div style={{display: 'flex', justifyContent: 'center', height: '100%', width: '100'}}>
                <Card style={{
                    backgroundColor: '#17202A',
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'fit-content',
                    height: 'fit-content',
                    marginTop: 15,
                    alignItems: 'center',
                    paddingTop: 15,
                    paddingLeft: 35,
                    paddingRight: 35,
                    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.50)'
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
                            control={
                                <Checkbox
                                    value={isTeacher}
                                    sx={{
                                        color: "white",
                                        '&.Mui-checked': {
                                            color: "primary",
                                        },
                                    }}
                                    onChange={(e) => setIsTeacher(e.target.checked)}

                                />}

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
                    >
                        Cadastrar
                    </Button>

                    <hr style={{width: '75%', marginTop: 15}}/>

                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Poppins',
                            fontSize: 18,
                            color: '#fff',
                            marginBottom: 2,
                            cursor: 'pointer'
                        }}
                        onClick={() => setOption('login')}
                    >
                        Já possui cadastro?
                    </Typography>

                    {/*TODO: fazer funcionar depois*/}
                    {/*<GoogleLoginButton*/}
                    {/*    text={'Entrar com o Google'}*/}
                    {/*    style={{*/}
                    {/*        width: 300,*/}
                    {/*        height: 50,*/}
                    {/*        borderRadius: 5,*/}
                    {/*        marginBottom: 20,*/}
                    {/*        textTransform: 'none',*/}
                    {/*        fontFamily: 'Poppins',*/}
                    {/*        fontSize: 18,*/}
                    {/*        fontWeight: 'bold'*/}
                    {/*    }}*/}
                    {/*    onClick={() => alert("Hello")}/>*/}
                </Card>
            </div>
        );
    }

    const initialComponent = () => {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%',
                }}>
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Poppins',
                            fontSize: 18,
                            color: '#fff'
                        }}
                    >
                        Não possui cadastro?
                    </Typography>
                    <Button
                        variant="contained"
                        style={{
                            backgroundColor: '#ffffff',
                            color: '#17202a',
                            fontFamily: 'Poppins',
                            fontSize: 18,
                            fontWeight: 'bold',
                            width: 200,
                            height: 50,
                            borderRadius: 5,
                            textTransform: 'none',
                            marginTop: 5
                        }}
                        onClick={() => setOption('register')}
                    >
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontFamily: 'Poppins',
                                fontSize: 18
                            }}
                        >
                            Registre-se
                        </Typography>
                    </Button>
                </div>

                <div style={{borderLeft: '1px solid #fff', height: '70%', marginLeft: 20, marginRight: 20}}/>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%'
                }}>
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Poppins',
                            fontSize: 18,
                            color: '#fff'
                        }}
                    >
                        Já se cadastrou no Arara?
                    </Typography>
                    <Button
                        variant="contained"
                        style={{
                            backgroundColor: '#ffffff',
                            color: '#17202a',
                            fontFamily: 'Poppins',
                            fontSize: 18,
                            fontWeight: 'bold',
                            width: 200,
                            height: 50,
                            borderRadius: 5,
                            textTransform: 'none'
                        }}
                        onClick={() => setOption('login')}
                    >
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontFamily: 'Poppins',
                                fontSize: 18
                            }}
                        >
                            Entre
                        </Typography>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment id='login'>
            <div style={{height: height - 70, width: width, backgroundColor: '#263238'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    {option === 'initial' ? initialComponent() : option === 'login' ? loginComponent() : registerComponent()}
                </div>
            </div>
        </React.Fragment>
    );
}