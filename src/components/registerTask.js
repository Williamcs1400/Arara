import React, {useEffect} from "react";
import Header from "./Pages/header";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {db} from "../services/firebase/firabaseConfig";
import {collection, addDoc, setDoc, doc} from "firebase/firestore";
import Tooltip from '@mui/material/Tooltip';
import {style} from "../styles/specificStyles/textFiledWhite";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
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

function RegisterTask(height, width) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [inputFormat, setInputFormat] = React.useState('');
    const [outputFormat, setOutputFormat] = React.useState('');
    const [qtdInput, setQtdInput] = React.useState(1);
    const [inputsAux, setInputsAux] = React.useState([]);
    const [teste, setTeste] = React.useState([]);

    // for accordions
    const [expandedFirst, setExpandedFirst] = React.useState(true);
    const [expandedSecond, setExpandedSecond] = React.useState(false);
    const [expandedThird, setExpandedThird] = React.useState(false);
    const [editFirst, setEditFirst] = React.useState(true);
    const [editSecond, setEditSecond] = React.useState(false);
    const [editThird, setEditThird] = React.useState(false);
    const [viewFirst, setViewFirst] = React.useState(false);
    const [viewSecond, setViewSecond] = React.useState(false);
    const [viewThird, setViewThird] = React.useState(false);

    const [open, setOpen] = React.useState(false);
    const [typeOfAlert, setTypeOfAlert] = React.useState('error');
    const [message, setMessage] = React.useState('');
    const [inRows, setInRows] = React.useState([]);
    const [outRows, setOutRows] = React.useState([4]);

    let teste2 = [];

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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Fecha um accordion e abre o próximo conforme o usuário vai preenchendo os dados
    async function firstInput() {
        if (validateFirstInput() && editFirst) {
            setEditFirst(false);
            setEditSecond(true);
            setExpandedSecond(true);
            await sleep(3000);
            setExpandedFirst(false);
        } else {
            setEditFirst(true);
        }
    }

    async function secondInput() {
        if (validateSecondInput() && editSecond) {
            setEditSecond(false);
            setEditThird(true);
            setExpandedThird(true);
            await sleep(3000);
            setExpandedSecond(false);
        } else {
            setEditSecond(true);
        }
    }

    async function thirdInput() {
        // if (validateThirdInput()) {
        //     setEditThird(false);
        //     setExpandedThird(false);
        //     await sleep(3000);
        // } else {
        //     setEditThird(true);
        //     // setExpandedThird(true);
        // }
    }

    // *------------------------------------------------*


    // *------------------------------------------------*
    // Verifica se os campos do accordion estão preenchidos para poder avançar para o próximo
    function validateFirstInput() {
        return (name !== '' && description !== '');
    }

    function validateSecondInput() {
        return (inputFormat !== '' && outputFormat !== '' && qtdInput !== '');
    }

    function validateThirdInput() {
        return (inputsAux.length === qtdInput);
    }

    // *------------------------------------------------*


    function addNewIO() {
        console.log('inputsAux: ' + JSON.stringify(inputsAux));
        if (inputsAux.length === 0 || inputsAux.length !== qtdInput) {
            console.log('erro 1')
            setTypeOfAlert('error');
            setMessage('O campo de entradas não pode estar vazio!');
            setOpen(true);
            return;
        }

        console.log('deu certo')
        let aux = [];
        for (let i = 0; i < inputsAux.length; i++) {
            aux.push(inputsAux[i])
        }
        // [] to {}
        setInRows([...inRows, {aux}]);
        // setOutRows([...outRows, outAux]);
        // setOutAux('');
        for(let i = 0; i < inputsAux.length; i++){
            teste2[i] = '';
            inputsAux[i] = '';
        }
    }

    const handleChangeInput = (value, index) => {
        let aux = inputsAux;
        aux[index] = value;
        setInputsAux(aux);
        teste2 = aux;
    }

    const multipliesInputs = (index) => {
        return (
            <TextField
                id='inputTaskArara'
                label={'Entrada ' + (index + 1)}
                variant='outlined'
                multiline
                sx={style}
                value={teste2[index]}
                style={{width: '100%', marginBottom: 15, marginRight: 10}}
                onChange={(e) => handleChangeInput(e.target.value, index)}
                />
        )
    }

    const getInputValue = (index) => {
        console.log('index: ' + index);
        return inputsAux.at(index);
    }

    return (
        <div style={{minHeight: height.height - 1, height: 'fit-content', width: width, background: '#DCDCDC'}}>
            <Header showIcon={true} showButtonLogin={true} redirectUrl={'/'}/>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 25}}>
                <Typography sx={{fontWeight: 'bold', fontFamily: 'Poppins', color: '#17202A', fontSize: 32}}>
                    Cadastrar tarefa
                </Typography>
                <Accordion style={{width: '50%', backgroundColor: '#17202A', color: '#fff', marginTop: 20}}
                           expanded={expandedFirst ^ viewFirst}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon style={{color: '#fff'}}/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        onClick={() => setViewFirst(!viewFirst)}
                    >
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontFamily: 'Poppins',
                                fontSize: 18
                            }}
                        >
                            Informações gerais
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{textAlign: 'center'}}>
                        {editFirst ? <TextField
                                id='nameTaskArara'
                                label='Nome da tarefa'
                                variant='outlined'
                                multiline
                                sx={style}
                                style={{width: '100%', marginBottom: 15}}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            /> :
                            <div style={{display: 'flex', marginBottom: 25}}>
                                <Typography variant='title' sx={{
                                    fontWeight: 'bold',
                                    fontFamily: 'Poppins',
                                    fontSize: 16
                                }} noWrap>
                                    Nome da tarefa: &nbsp;
                                </Typography>
                                <Typography variant='subheading' sx={{
                                    fontWeight: 'Light',
                                    fontFamily: 'Poppins',
                                    fontSize: 16
                                }} noWrap>
                                    {name}
                                </Typography>
                            </div>
                        }

                        {editFirst ? <TextField
                                id='descriptionTaskArara'
                                label='Descrição da tarefa'
                                variant='outlined'
                                multiline
                                sx={style}
                                style={{width: '100%', marginBottom: 25}}
                                value={description}
                                enabled={!validateFirstInput()}
                                onChange={(e) => setDescription(e.target.value)}
                            /> :
                            <div style={{display: 'flex', marginBottom: 25}}>
                                <Typography variant='title' sx={{
                                    fontWeight: 'bold',
                                    fontFamily: 'Poppins',
                                    fontSize: 16
                                }} noWrap>
                                    Descrição da tarefa: &nbsp;
                                </Typography>
                                <Typography variant='subheading' sx={{
                                    fontWeight: 'Light',
                                    fontFamily: 'Poppins',
                                    fontSize: 16
                                }} noWrap>
                                    {description}
                                </Typography>
                            </div>
                        }

                        <Tooltip
                            title={
                                <Typography
                                    sx={{fontWeight: 'bold', fontFamily: 'Poppins', fontSize: 16, textAlign: 'center'}}>
                                    {validateFirstInput() ? 'Salve para prosseguir!' : 'É necessário preencher nome e descrição da tarefa!'}
                                </Typography>
                            }
                        >
                            <div>
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
                                        textTransform: 'none',
                                        alignSelf: 'center'
                                    }}
                                    disabled={!validateFirstInput()}
                                    onClick={firstInput}
                                >
                                    {editFirst ? 'Salvar' : 'Editar'}
                                </Button>
                            </div>
                        </Tooltip>
                    </AccordionDetails>
                </Accordion>

                <Accordion style={{width: '50%', backgroundColor: '#17202A', color: '#fff', marginTop: 20}}
                           disabled={!validateFirstInput()}
                           expanded={expandedSecond ^ viewSecond}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon style={{color: '#fff'}}/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        onClick={() => setViewSecond(!viewSecond)}
                    >
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontFamily: 'Poppins',
                                fontSize: 18
                            }}
                        >
                            Formato de entrada e saída
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{textAlign: 'center'}}>
                        {editSecond ?
                            <div style={{display: 'flex'}}>
                                <TextField
                                    id='nameTaskArara'
                                    label='Formato da entrada'
                                    variant='outlined'
                                    multiline
                                    sx={style}
                                    style={{width: '100%', marginBottom: 15, marginRight: 10}}
                                    value={inputFormat}
                                    onChange={(e) => setInputFormat(e.target.value)}
                                />
                                <FormControl sx={style} style={{width: '40%'}}>
                                    <InputLabel id="arara-qtdinput">Quantidade de entrdas</InputLabel>
                                    <Select
                                        labelId="arara-qtdinput-select-id"
                                        id="arara-qtdinput-select"
                                        value={qtdInput}
                                        label="Quantidade de entrdas"
                                        onChange={(e) => setQtdInput(e.target.value)}
                                    >
                                        <MenuItem value={''}>&nbsp;</MenuItem>
                                        <MenuItem value={2}>1</MenuItem>
                                        <MenuItem value={3}>2</MenuItem>
                                        <MenuItem value={4}>3</MenuItem>
                                        <MenuItem value={5}>4</MenuItem>
                                        <MenuItem value={6}>5</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            :
                            <div>
                                <div style={{display: 'flex', marginBottom: 25}}>
                                    <Typography variant='title' sx={{
                                        fontWeight: 'bold',
                                        fontFamily: 'Poppins',
                                        fontSize: 16
                                    }} noWrap>
                                        Formato da entrada: &nbsp;
                                    </Typography>
                                    <Typography variant='subheading' sx={{
                                        fontWeight: 'Light',
                                        fontFamily: 'Poppins',
                                        fontSize: 16
                                    }} noWrap>
                                        {inputFormat}
                                    </Typography>
                                </div>
                                <div style={{display: 'flex', marginBottom: 25}}>
                                    <Typography variant='title' sx={{
                                        fontWeight: 'bold',
                                        fontFamily: 'Poppins',
                                        fontSize: 16
                                    }} noWrap>
                                        Quantidade de entradas: &nbsp;
                                    </Typography>
                                    <Typography variant='subheading' sx={{
                                        fontWeight: 'Light',
                                        fontFamily: 'Poppins',
                                        fontSize: 16
                                    }} noWrap>
                                        {qtdInput}
                                    </Typography>
                                </div>
                            </div>
                        }

                        {editSecond ? <TextField
                                id='descriptionTaskArara'
                                label='Descrição da tarefa'
                                variant='outlined'
                                multiline
                                sx={style}
                                style={{width: '100%', marginBottom: 25}}
                                value={outputFormat}
                                enabled={!validateSecondInput()}
                                onChange={(e) => setOutputFormat(e.target.value)}
                            /> :
                            <div style={{display: 'flex', marginBottom: 25}}>
                                <Typography variant='title' sx={{
                                    fontWeight: 'bold',
                                    fontFamily: 'Poppins',
                                    fontSize: 16
                                }} noWrap>
                                    Formato da saída: &nbsp;
                                </Typography>
                                <Typography variant='subheading' sx={{
                                    fontWeight: 'Light',
                                    fontFamily: 'Poppins',
                                    fontSize: 16
                                }} noWrap>
                                    {outputFormat}
                                </Typography>
                            </div>
                        }

                        <Tooltip
                            title={
                                <Typography
                                    sx={{fontWeight: 'bold', fontFamily: 'Poppins', fontSize: 16, textAlign: 'center'}}>
                                    {validateSecondInput() ? 'Salve para prosseguir!' : 'É necessário preencher o formato de entrada e saída!'}
                                </Typography>
                            }
                        >
                            <div>
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
                                        textTransform: 'none',
                                        alignSelf: 'center'
                                    }}
                                    disabled={!validateSecondInput()}
                                    onClick={secondInput}
                                >
                                    {editSecond ? 'Salvar' : 'Editar'}
                                </Button>
                            </div>
                        </Tooltip>
                    </AccordionDetails>
                </Accordion>

                <Accordion style={{width: '50%', backgroundColor: '#17202A', color: '#fff', marginTop: 20}}
                           disabled={!validateSecondInput() || !validateFirstInput()}
                           expanded={expandedThird ^ viewThird}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon style={{color: '#fff'}}/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        onClick={() => setViewThird(!viewThird)}
                    >
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontFamily: 'Poppins',
                                fontSize: 18
                            }}
                        >
                            Entradas e saídas esperadas
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{textAlign: 'center'}}>

                        {qtdInput !== '' ?
                            <div>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    {Array.from(Array(parseInt(qtdInput - 1)).keys()).map((i) => {
                                        return (
                                            multipliesInputs(i)
                                        )
                                    })}
                                    <TextField
                                        id='outputTaskArara'
                                        label='Saída esperada'
                                        variant='outlined'
                                        multiline
                                        sx={style}
                                        value={teste2.at(qtdInput - 1)}
                                        style={{width: '100%', marginBottom: 15}}
                                        onChange={(e) => handleChangeInput(e.target.value, qtdInput - 1)}
                                    />
                                </div>
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
                                        marginBottom: 15,
                                        textTransform: 'none',
                                        alignSelf: 'center'
                                    }}
                                    // disabled={!validateSecondInput()}
                                    onClick={addNewIO}
                                >
                                    Adicionar
                                </Button>
                            </div>

                            : <div></div>
                        }

                        <TableContainer component={Paper}>
                            <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                                <TableHead>
                                    {qtdInput !== '' ?
                                        <TableRow>
                                            {Array.from(Array(parseInt(qtdInput - 1)).keys()).map((i) => {
                                                return (
                                                    <TableCell align="right">Entrada {i + 1}</TableCell>
                                                )
                                            })}
                                            <TableCell align="right">Saída esperada</TableCell>
                                        </TableRow>
                                        : <div></div>
                                    }
                                </TableHead>
                                <TableBody>
                                    {inRows.map((row) => (
                                        <TableRow
                                            key={row.aux}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            {row.aux.map((cell) => (
                                                <TableCell align="right">{cell}</TableCell>
                                    ))}
                                            <TableCell align="right">{row.out}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
}

export default RegisterTask;