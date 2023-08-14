import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import Header from "./header";
import {collection, query, getDocs, where} from "firebase/firestore";
import {db} from "../../services/firebase/firabaseConfig";
import Swal from "sweetalert2";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import {convertDateHour} from "../../services/utils/util";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

function TaskDetails(props) {
    const [task, setTask] = useState({});
    const [qtdAttempts, setQtdAttempts] = useState(0);
    const [qtdCorrect, setQtdCorrect] = useState(0);
    const [qtdPeople, setQtdPeople] = useState(0);
    const [io, setIO] = useState([]);
    const [teste, setTeste] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = useParams();

    async function findTask() {
        if (location.state.task !== undefined) {
            setTask(location.state.task);
        }
        if (id !== undefined) {
            Swal.fire({
                title: 'Carregando detalhes da tarefa...',
            });
            Swal.showLoading();

            // carregando tentativas da tarefa
            const q = query(collection(db, 'tasks', id, 'attempt'));
            const querySnapshot = await getDocs(q);

            // salvando ids dos alunos que fizeram a tarefa
            const listOfIds = [];
            let correctAux = 0;
            querySnapshot.forEach((doc) => {
                if (!listOfIds.includes(doc.data().uid)) {
                    listOfIds.push(doc.data().uid);
                }
                if (doc.data().response.success) {
                    correctAux++;
                }
            });

            if(listOfIds.length === 0){
                Swal.fire({
                    title: 'Ops',
                    text: 'Nenhum aluno fez essa tarefa ainda!',
                    icon: 'warning',
                }).then((result) => {
                    if(result.isConfirmed){
                        navigate('/minhasAtividades');
                    }
                });
            }

            // carregando dados dos alunos que fizeram a tarefa
            const q2 = query(collection(db, 'users'), where('uid', 'in', listOfIds));
            const querySnapshot2 = await getDocs(q2);
            const arrayStudents = [];
            let myAttempts = [];
            querySnapshot2.forEach(async (doc) => {
                const subQ = query(collection(db, 'users', doc.id, 'myAttempts'), where('taskCode', '==', id));
                const subQuerySnapshot = await getDocs(subQ);

                subQuerySnapshot.forEach((subDoc) => {
                    myAttempts.push(subDoc.data());
                });

                let aux = doc.data();
                aux.detail = myAttempts;
                arrayStudents.push(aux);
                myAttempts = [];
            });

            // carregando testes da tarefa
            const q3 = query(collection(db, 'tasks', id, 'tests'));
            const querySnapshot3 = await getDocs(q3);
            const ioAux = [];
            querySnapshot3.forEach((doc) => {
                ioAux.push(doc.data());
            });

            setIO(ioAux);
            setQtdAttempts(querySnapshot.docs.length);
            setQtdPeople(listOfIds.length);
            setQtdCorrect(correctAux);
            setTeste(arrayStudents);

            Swal.close();
        }
    }

    useEffect(() => {
        findTask();
    }, []);

    // retângulos com informações
    const infoBlock = (text1, text2) => {
        return (
            <div style={{
                backgroundColor: '#17202a', borderRadius: 15, height: 120, textAlign: 'center',
                alignItems: 'center', justifyContent: 'center', marginInline: 50, minWidth: 180, justifyItems: 'center'
            }}>
                <br/>
                <Typography sx={{fontWeight: 'bolder', fontFamily: 'Poppins', color: '#fff', fontSize: 28}}>
                    {text1}
                </Typography>
                <Typography sx={{fontWeight: 'bold', fontFamily: 'Poppins', color: '#fff', fontSize: 18}}>
                    {text2}
                </Typography>
            </div>
        );
    }

    // informações da tarefa
    const InfoRow = (text1, text2) => {
        return (
            <div style={{display: 'flex', marginBottom: 25}}>
                <Typography variant='title' sx={{
                    fontWeight: 'bold',
                    fontFamily: 'Poppins',
                    fontSize: 16
                }} noWrap>
                    {text1} &nbsp;
                </Typography>
                <Typography variant='subheading' sx={{
                    fontWeight: 'Light',
                    fontFamily: 'Poppins',
                    fontSize: 16
                }} noWrap>
                    {text2}
                </Typography>
            </div>
        );
    }

    const tableIO = () => {
        const inputArray = [];
        const outputArray = [];

        io.forEach((test) => {
            inputArray.push(test.inputs);
            outputArray.push(test.output);
        });


        if (task.qtdInput !== undefined && task.qtdInput !== null) {
            return (
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                {Array.from(Array(parseInt(task.qtdInput - 1)).keys()).map((i) => {
                                    return (
                                        <TableCell align="right">Entrada {i + 1}</TableCell>
                                    )
                                })}
                                <TableCell align="right">Saída esperada</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inputArray.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    {row.map((input) => {
                                        return (
                                            <TableCell align="right">{input}</TableCell>
                                        )
                                    })}
                                    <TableCell align="right">{outputArray[index]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }
    }

    function textAttemps() {
        return (qtdAttempts === 0 || qtdAttempts === 1) ? 'Tentativa' : 'Tentativas';
    }

    function textCorrect() {
        return (qtdCorrect === 0 || qtdCorrect === 1) ? 'Acerto' : 'Acertos';
    }

    function textPeople() {
        return (qtdPeople === 0 || qtdPeople === 1) ? 'Aluno' : 'Alunos';
    }

    return (
        <div style={{
            minHeight: props.height,
            height: 'fit-content',
            width: props.width,
            background: '#DCDCDC',
        }}>
            <Header showIcon={true} showButtonLogin={true} redirectUrl={'/'}/>

            <div style={{
                display: 'flex', flexDirection: 'row', alignItems: 'center',
                justifyContent: 'center', marginTop: 15, width: '100%'
            }}>
                {infoBlock(qtdAttempts === 0 ? '-' : qtdAttempts, textAttemps())}
                {infoBlock(qtdCorrect === 0 ? '-' : qtdCorrect, textCorrect())}
                {infoBlock(qtdPeople === 0 ? '-' : qtdPeople, textPeople())}
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                width: '100%'
            }}>
                <Accordion style={{width: '50%', backgroundColor: '#17202A', color: '#fff', marginTop: 20}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{color: '#fff'}}/>}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                    >
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontFamily: 'Poppins',
                                fontSize: 18
                            }}
                        >
                            Informações da atividade
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{textAlign: 'center'}}>

                        {InfoRow('Nome: ', task.name)}
                        {InfoRow('Descrição: ', task.description)}
                        {InfoRow('Data de criação: ', task.date ? convertDateHour(task.date.seconds) : '-')}
                        {InfoRow('Formato de entrada: ', task.inputFormat)}
                        {InfoRow('Formato de saída: ', task.outputFormat)}
                        {InfoRow('Exemplo: ', task.outputExample)}

                        {tableIO()}

                    </AccordionDetails>
                </Accordion>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                width: '100%'
            }}>
                <Accordion style={{width: '50%', backgroundColor: '#17202A', color: '#fff', marginBottom: 50}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{color: '#fff'}}/>}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                    >
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontFamily: 'Poppins',
                                fontSize: 18
                            }}
                        >
                            Detalhes das tentativas
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{textAlign: 'center'}}>
                        {teste.map((student) => (
                            <Accordion style={{width: '100%', backgroundColor: '#243649', color: '#fff', marginBottom: 5}}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon style={{color: '#fff'}}/>}
                                                  aria-controls="panel1a-content"
                                                  id="panel1a-header"
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            fontFamily: 'Poppins',
                                            fontSize: 18
                                        }}
                                    >
                                        {student.name}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails style={{textAlign: 'center'}}>
                                    {student.detail.map((attempt) => (
                                        <div>
                                            <div style={{display: 'flex', marginBottom: 25, justifyContent: 'center'}}>
                                                <Typography variant='title' sx={{
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Poppins',
                                                    fontSize: 16
                                                }} noWrap>
                                                    Resultado: &nbsp;
                                                </Typography>
                                                <Typography variant='subheading' sx={{
                                                    fontWeight: 'Light',
                                                    fontFamily: 'Poppins',
                                                    fontSize: 16
                                                }} noWrap>
                                                    {attempt.success ? 'Acertou' : 'Errou'} - {attempt.detail}% de acerto - {convertDateHour(attempt.date.seconds)}
                                                </Typography>
                                            </div>
                                            <hr style={{width: '100%', backgroundColor: '#fff', marginTop: 10, marginBottom: 10}}/>
                                        </div>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    )
}

export default TaskDetails;