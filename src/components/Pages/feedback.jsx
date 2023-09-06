import React, {useEffect} from 'react';
import {Button} from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {styleWhite} from "../../styles/specificStyles/textFieldStyles";
import Swal from "sweetalert2";
import {addDoc, collection} from "firebase/firestore";
import {db} from "../../services/firebase/firabaseConfig";
import {getCurrentUser} from "../../services/firebase/firebaseAux";
import {useNavigate} from "react-router-dom";

function Feedback() {
    const [height, setHeight] = React.useState(null);
    const [width, setWidth] = React.useState(null);
    const [feedback, setFeedback] = React.useState('');

    const navigate = useNavigate();


    useEffect(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }, []);

    async function saveFeedback() {
        Swal.fire({
            title: 'Salvando o seu parecer...'
        });
        Swal.showLoading();

        try {
            const user = getCurrentUser();
            const docRef = await addDoc(collection(db, 'feedbacks'), {
                feedback: feedback,
                name: user.name,
                email: user.email,
            }).then(() => {
                Swal.fire({
                    title: 'Parecer salvo com sucesso!',
                    icon: 'success'
                }).then(() => {
                    navigate('/')
                });
            }).catch((e) => {
                Swal.fire({
                    title: 'Erro ao salvar o seu parecer: ' + e,
                    icon: 'error'
                });
            });

        } catch (e) {
            Swal.fire({
                title: 'Erro ao salvar o seu parecer: ' + e,
                icon: 'error'
            });
        }
    }

        return (
            <div style={{
                height: height - 70,
                width: width,
                background: '#263238',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography
                    style={{marginTop: 25}}
                    sx={{fontWeight: 'bold', fontFamily: 'Poppins', fontSize: 26, textAlign: 'center', color: '#fff'}}>
                    Nos ajude a melhorar!
                </Typography>
                <Typography
                    sx={{fontWeight: 'bold', fontFamily: 'Poppins', fontSize: 18, textAlign: 'center', color: '#fff'}}>
                    Aqui você pode nos enviar uma mensagem com sua opinião sobre o aplicativo.
                    Seja ela uma crítica, sugestão ou elogio, nós queremos saber!
                </Typography>

                <TextField
                    id='feedbackArara'
                    label='O que você tem a dizer? Crítica, sugestão, relatar um bug, elogiar...'
                    variant='outlined'
                    multiline
                    sx={styleWhite}
                    style={{width: '90%', marginBottom: 15, alignSelf: 'center', marginTop: 25, maxHeight: 300}}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />

                <Button
                    variant="contained"
                    style={{
                        backgroundColor: '#ffffff',
                        color: '#17202a',
                        fontFamily: 'Poppins',
                        fontSize: 18,
                        fontWeight: 'thin',
                        width: 300,
                        height: 50,
                        borderRadius: 5,
                        marginTop: 10,
                        textTransform: 'none',
                        alignSelf: 'center'
                    }}
                    onClick={() => saveFeedback()}
                >
                    Salvar
                </Button>
            </div>
        );
    }

    export default Feedback;