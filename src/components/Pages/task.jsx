import React, {useState, useEffect} from "react"
import {useNavigate, useParams} from "react-router-dom";
import search from "../../assets/search.png";
import {Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import {stylePrimary} from "../../styles/specificStyles/textFieldStyles";
import {collection, getDocs, query, doc, getDoc, addDoc} from "firebase/firestore";
import {db} from "../../services/firebase/firabaseConfig";
import Swal from "sweetalert2";
import Ide from "../ide";
import {getCurrentUser} from "../../services/firebase/firebaseAux";

function Task(props) {
    const [codeTask, setCodeTask] = useState('');
    const [dataTask, setDataTask] = useState({});
    const [tests, setTests] = useState([]);

    const navigate = useNavigate();
    const {id} = useParams();

    function isLogged(code){
        if(getCurrentUser() === null){
            Swal.fire({
                title: 'Ops',
                text: 'Você precisa estar logado para acessar essa página!',
                icon: 'warning',
            }).then((result) => {
                if(result.isConfirmed){
                    id === undefined ?
                        navigate('/entrar', {state: {redirectUrl: '/atividade/' + code.replaceAll(' ', '')}})
                        :
                        navigate('/entrar', {state: {redirectUrl: '/atividade/' + id.replaceAll(' ', '')}});
                }
            });
        }else{
            return true;
        }
    }

    async function findTask(id) {
        const ok = isLogged(id);
        if(ok) {
            Swal.fire({
                title: 'Buscando tarefa...',
                allowOutsideClick: false,
            });
            Swal.showLoading();

            const code = id.replaceAll(' ', '');
            const docRef = doc(db, 'tasks', code);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                Swal.close();
                navigate('/atividade/' + code)
            } else {
                Swal.fire({
                    title: 'Ops',
                    text: 'Tarefa não encontrada! Verifique o código digitado e tente novamente.',
                    icon: 'warning',
                });
            }
        }
    }

    async function loadTaskInfo(code) {
        const ok = isLogged(code);

        if(ok) {
            Swal.fire({
                title: 'Carregando tarefa...',
                allowOutsideClick: false,
            });
            Swal.showLoading();

            const docRef = doc(db, 'tasks', code);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                Swal.close();
                const docRef2 = query(collection(db, 'tasks', code, 'tests'));
                const docSnap2 = await getDocs(docRef2);
                if (docSnap2.docs.length > 0) {
                    let auxData = docSnap.data();
                    auxData.code = code;

                    let aux = {}
                    let array = [];
                    for (let i = 0; i < docSnap2.docs.length; i++) {
                        aux = docSnap2.docs[i].data();
                        array.push(aux);
                    }
                    setDataTask(auxData);
                    setTests(array);
                } else {
                    Swal.fire({
                        title: 'Ops',
                        text: 'Tarefa com erro no cadastro dos testes! Entre em contato com o professor responsável.',
                        icon: 'warning',
                    });
                }
            } else {
                Swal.fire({
                    title: 'Ops',
                    text: 'Tarefa não encontrada! Verifique o código digitado e tente novamente.',
                    icon: 'warning',
                });
            }
        }
    }

    async function saveTaskAttempt(response) {
        const date = new Date();
        await addDoc(collection(db, 'tasks', id, 'attempt'), {
            response: response,
            uid: getCurrentUser().uuid,
            date: date
        }).then(async ( res) => {
            await addDoc(collection(db, 'users', getCurrentUser().uuid, 'myAttempts'), {
                taskCode: id,
                attemptCode: res.id,
                name: dataTask.name,
                date: date,
                success: response.success,
                detail: response.detail
            });
        });
    }

    function callByCode() {
        findTask(codeTask);
    }

    useEffect(() => {
        if (id !== undefined) {
            loadTaskInfo(id);
        }
    }, [id]);

    return (
        <div style={{
            minHeight: props.height - 70,
            height: 'fit-content',
            width: props.width,
            background: '#DCDCDC',
        }}>
            {id === undefined ?
                <div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 100
                    }}>
                        <TextField id='outputTaskArara' label='Código da tarefa, ex: abcxyz123' variant='outlined'
                                   sx={stylePrimary} value={codeTask} style={{width: '40%', marginBottom: 15}}
                                   onChange={(e) => setCodeTask(e.target.value)}/>
                        <Button
                            style={{
                                backgroundColor: '#17202A', color: '#fff', fontSize: 22, fontWeight: 'lighter',
                                alignSelf: 'center', fontFamily: 'Poppins', textTransform: 'none',
                                textAlign: 'right', marginLeft: 10, marginRight: 10, width: 250, marginTop: 5,
                            }}
                            onClick={callByCode}
                        >
                            <img src={search} alt="logo" width='25' height='27'
                                 style={{alignSelf: 'center', marginRight: 5}}/>
                            Buscar
                        </Button>
                    </div>
                </div>
                :
                <Ide isTask={true} dataTask={dataTask} tests={tests} saveAttempt={saveTaskAttempt}/>
            }
        </div>
    )
}

export default Task;