import React, {useEffect} from "react";
import Header from "./Pages/header";
import TextField from '@mui/material/TextField';
import {Col, Row} from "react-bootstrap";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Button} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import {Alert} from "@mui/joy";
import {db} from "../services/firebase/firabaseConfig";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

const style = {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "white"
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "white"
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "white"
    },
    "& .MuiOutlinedInput-input": {
        color: "white"
    },
    "&:hover .MuiOutlinedInput-input": {
        color: "white"
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
        color: "white"
    },
    "& .MuiInputLabel-outlined": {
        color: "white"
    },
    "&:hover .MuiInputLabel-outlined": {
        color: "white"
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
        color: "white"
    },
    "& .MuiSelect-icon": {
        color: "white"
    },
    "&:hover .MuiSelect-icon": {
        color: "white"
    },
    "& .MuiSelect-icon.Mui-focused": {
        color: "white"
    }
}

function RegisterTask(height, width) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [qtdInput, setQtdInput] = React.useState(1);
    const [inputs, setInputs] = React.useState([]);
    const [out, setOut] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [typeOfAlert, setTypeOfAlert] = React.useState('error');
    const [message, setMessage] = React.useState('');
    const [inRows, setInRows] = React.useState([]);
    const [outRows, setOutRows] = React.useState([]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    function submit() {

        if (inputs.length === 0 || inputs.length !== qtdInput) {
            setTypeOfAlert('error');
            setMessage('O campo de entradas não pode estar vazio!');
            setOpen(true);
            return;
        }

        if (out === '') {
            setTypeOfAlert('error');
            setMessage('O campo de saída não pode estar vazio!');
            setOpen(true);
            return;
        }

        setInRows([...inRows, inputs]);
        setOutRows([...outRows, out]);
        setOut('');
        setInputs([]);
        for (let i = 0; i < qtdInput; i++) {
            document.getElementById('input' + i).value = '';
        }
    }

    async function save() {
        let teste = [];
        for (let i = 0; i < inRows.length; i++) {
            let aux = [];
            for (let j = 0; j < qtdInput; j++) {
                aux.push(inRows[i][j])
            }
            teste.push(aux)
        }

        if (name === '') {
            setTypeOfAlert('error');
            setMessage('O campo de nome não pode estar vazio!');
            setOpen(true);
            return;
        }

        if (description === '') {
            setTypeOfAlert('error');
            setMessage('O campo de descrição não pode estar vazio!');
            setOpen(true);
            return;
        }

        try {

            const docRef = await addDoc(collection(db, "tasks"), {
                name: name,
                description: description,
            });

            const id = docRef.id;

            for (let i = 0; i < inRows.length; i++) {
                const docRef = await addDoc(collection(db, "tasks", id, "inputs"), {
                    inputs: teste[i],
                    output: outRows[i]
                });
            }
        } catch (e) {
        }

    }

    // TODO: mudar toda essa tela para cards para inserir cada informação

    return (
        <div style={{height: height.height - 1, width: width, background: '#3f3f3f'}}>
            <Header/>
            <div style={{display: 'flex', flexDirection: 'column', marginRight: 20, marginLeft: 20}}>
                <h7 style={{color: '#ffffff', fontSize: 32, marginTop: 10, textAlign: 'center', fontWeight: 'bold'}}>
                    Cadastrar Tarefa
                </h7>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', marginTop: 10, marginRight: 50, marginLeft: 50}}>
                <Col>
                    <Row>
                        <TextField
                            id="name_task"
                            label="Nome da tarefa"
                            style={{width: 500}}
                            variant="outlined"
                            sx={style}
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                    </Row>

                    <Row style={{marginTop: 28}}>
                        <TextField
                            id="description_task"
                            label="Descrição da tarefa"
                            style={{width: 500}}
                            variant="outlined"
                            multiline={true}
                            sx={style}
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                        />
                    </Row>

                    <Row style={{marginTop: 28}}>
                        <FormControl style={{width: 200}}>
                            <InputLabel id="demo-simple-select-label">Quantidade de entradas</InputLabel>
                            <Select
                                labelId="inputs"
                                id="qtdInputs"
                                value={qtdInput}
                                label="Quantidade de entradas"
                                onChange={event => setQtdInput(event.target.value)}
                                sx={style}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                            </Select>
                        </FormControl>
                    </Row>

                    <Row style={{marginTop: 28}}>
                        {Array.from(Array(qtdInput).keys()).map((index) => (
                            <TextField
                                id={"input" + index}
                                label={"Entrada " + (index + 1)}
                                style={{width: 120, marginRight: 10}}
                                variant="outlined"
                                value={inputs[index]}
                                onChange={event => {
                                    let aux = inputs;
                                    aux[index] = event.target.value;
                                    setInputs(aux);
                                }}
                                sx={style}
                            />
                        ))}
                        <TextField
                            id="output"
                            label="Saída"
                            style={{width: 110, marginRight: 10}}
                            variant="outlined"
                            sx={style}
                            value={out}
                            onChange={event => setOut(event.target.value)}
                        />
                    </Row>

                    <Row style={{marginTop: 28}}>
                        <Button
                            variant="outlined"
                            onClick={submit}
                            style={{
                                color: '#ffffff',
                                borderColor: '#ffffff',
                                textTransform: 'none',
                                fontSize: 20,
                                width: 500
                            }}
                        >
                            Adicionar Entrada
                        </Button>
                    </Row>

                </Col>

                <Col style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    <TableContainer component={Paper}>
                        {inRows.length === 0 ? <div/> :
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        {Array.from(Array(qtdInput).keys()).map((index) => (
                                            <TableCell align="right">Entrada {index + 1}</TableCell>
                                        ))}
                                        <TableCell align="right">Saída</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inRows.map((input, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            {input.map((value) => (
                                                <TableCell align="right">{value}</TableCell>
                                            ))}
                                            <TableCell align="right">{outRows[index]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        }
                    </TableContainer>
                </Col>

            </div>
            <Stack spacing={2} sx={{width: '100%'}}>
                <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}
                          anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                    <Alert onClose={handleClose} severity={typeOfAlert} sx={{width: '100%'}}>
                        {message}
                    </Alert>
                </Snackbar>
            </Stack>
            <Col style={{textAlign: 'center', marginTop: 100}}>
                <Button
                    variant="outlined"
                    onClick={save}
                    style={{
                        color: '#ffffff',
                        borderColor: '#ffffff',
                        textTransform: 'none',
                        fontSize: 20,
                        width: 200
                    }}
                >
                    Abrir Tarefa
                </Button>
            </Col>
        </div>
    );

}

export default RegisterTask;