import React, {useEffect} from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {db} from "../../services/firebase/firabaseConfig";
import {collection, addDoc} from "firebase/firestore";
import Tooltip from '@mui/material/Tooltip';
import {styleWhite} from "../../styles/specificStyles/textFieldStyles";
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
import Swal from "sweetalert2";
import {getCurrentUser} from "../../services/firebase/firebaseAux";
import {useNavigate} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

function RegisterTask() {
    const [height, setHeight] = React.useState(null);
    const [width, setWidth] = React.useState(null);

    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [inputFormat, setInputFormat] = React.useState('');
    const [outputFormat, setOutputFormat] = React.useState('');
    const [outputExample, setOutputExample] = React.useState('');
    const [qtdInput, setQtdInput] = React.useState(1);
    const [inputsAux, setInputsAux] = React.useState([]);

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
    const [inRows, setInRows] = React.useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }, []);

    async function save() {

        let entradas = [];
        let saidas = [];
        const copy = JSON.parse(JSON.stringify(inRows));
        copy.forEach((row) => {
            saidas.push(row.aux.pop());
            entradas.push(row.aux);
        });

        Swal.fire({
            title: 'Salvando tarefa...',
        });
        Swal.showLoading();

        try {
            const docRef = await addDoc(collection(db, 'tasks'), {
                name: name,
                description: description,
                inputFormat: inputFormat,
                outputFormat: outputFormat,
                outputExample: outputExample,
                qtdInput: qtdInput,
                teacher: getCurrentUser().uuid,
                date: new Date()
            });

            const id = docRef.id;

            Swal.fire({
                title: 'Salvando entradas e saídas...',
            });
            Swal.showLoading();

            for (let i = 0; i < inRows.length; i++) {
                await addDoc(collection(db, 'tasks', id, 'tests'), {
                    inputs: entradas[i],
                    output: saidas[i]
                }).then((r) => {
                }).catch((e) => {
                });
            }

            if (id !== undefined) {
                Swal.close();
                navigate('/cadastroAtividadeFeito', {state: {taskId: id}});
            }

        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Erro ao salvar tarefa: ' + e,
            });
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
            await sleep(500);
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
            await sleep(500);
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

    // *------------------------------------------------*

    function addNewIO() {
        if (inputsAux.length !== qtdInput) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Preencha todos os campos!',
                timer: 2000
            });
            return;
        }

        let aux = [];
        for (let i = 0; i < inputsAux.length; i++) {
            aux.push(inputsAux[i])
        }

        setInRows([...inRows, {aux}]);

        const cleanArray = [];
        for (let i = 0; i < qtdInput; i++) {
            cleanArray.push('');
        }
        setInputsAux(cleanArray)
    }

    const handleChangeInput = (value, index) => {
        let aux = [];
        for(let i = 0; i < inputsAux.length; i++) {
            aux[i] = inputsAux[i];
        }
        aux[index] = value;
        setInputsAux(aux);
    }

    function handleDeleteRow(index) {
        let copy = JSON.parse(JSON.stringify(inRows));
        copy.splice(index, 1);
        setInRows(copy);
    }

    const formInOut = () => {
        return (
            <div>
                {qtdInput !== '' ?
                    <div>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            {Array.from(Array(parseInt(qtdInput - 1)).keys()).map((i) => {
                                return (
                                <TextField
                                    // id='inputTaskArara'
                                    label={'Entrada ' + (i + 1)}
                                    variant='outlined'
                                    multiline
                                    sx={styleWhite}
                                    value={inputsAux[i]}
                                    style={{width: '100%', marginBottom: 15, marginRight: 10}}
                                    onChange={(e) => handleChangeInput(e.target.value, i)}
                                />
                                )
                            })}
                            <TextField
                                id='outputTaskArara'
                                label='Saída esperada'
                                variant='outlined'
                                multiline
                                sx={styleWhite}
                                value={inputsAux[qtdInput - 1]}
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
                            onClick={addNewIO}
                        >
                            Adicionar
                        </Button>
                    </div>
                    :
                    <div/>
                }
            </div>
        );
    }

    return (
        <React.Fragment id='registerTask'>
            <div style={{
                minHeight: height - 70,
                height: 'fit-content',
                width: width,
                background: '#DCDCDC',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
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
                                sx={styleWhite}
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
                                sx={styleWhite}
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
                                    id='inputFormatTaskArara'
                                    label='Formato da entrada (ex: Dois números inteiros positivos separados por espaço)'
                                    variant='outlined'
                                    multiline
                                    sx={styleWhite}
                                    style={{width: '100%', marginBottom: 15, marginRight: 10}}
                                    value={inputFormat}
                                    onChange={(e) => setInputFormat(e.target.value)}
                                />
                                <FormControl sx={styleWhite} style={{width: '40%'}}>
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
                                id='outputFormatTaskArara'
                                label='Formato da saída (ex: Um número inteiro sem espaços)'
                                variant='outlined'
                                multiline
                                sx={styleWhite}
                                style={{width: '100%', marginBottom: 15}}
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

                        {editSecond ? <TextField
                                id='outputExampleTaskArara'
                                label='Exemplo de entradas e saídas (ex: 10 5 -> 15)'
                                variant='outlined'
                                multiline
                                sx={styleWhite}
                                style={{width: '100%', marginBottom: 25}}
                                value={outputExample}
                                enabled={!validateSecondInput()}
                                onChange={(e) => setOutputExample(e.target.value)}
                            /> :
                            <div style={{display: 'flex', marginBottom: 25}}>
                                <Typography variant='title' sx={{
                                    fontWeight: 'bold',
                                    fontFamily: 'Poppins',
                                    fontSize: 16
                                }} noWrap>
                                    Exemplo de saída: &nbsp;
                                </Typography>
                                <Typography variant='subheading' sx={{
                                    fontWeight: 'Light',
                                    fontFamily: 'Poppins',
                                    fontSize: 16
                                }} noWrap>
                                    {outputExample}
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

                        {formInOut()}

                        <TableContainer component={Paper}>
                            <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                                <TableHead>
                                    {qtdInput !== '' ?
                                        <TableRow>
                                            {Array.from(Array(parseInt(qtdInput - 1)).keys()).map((i) => {
                                                return (
                                                    <TableCell align="center">Entrada {i + 1}</TableCell>
                                                )
                                            })}
                                            <TableCell align="center">Saída esperada</TableCell>
                                            <TableCell align="center"></TableCell>
                                            <TableCell align="center">Excluir</TableCell>
                                        </TableRow>
                                        : <div></div>
                                    }
                                </TableHead>
                                <TableBody>
                                    {inRows.map((row, index) => (
                                        <TableRow
                                            key={row.aux}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            {row.aux.map((cell) => (
                                                <TableCell align="center">{cell}</TableCell>
                                            ))}
                                            <TableCell align="center">{row.out}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    onClick={() => handleDeleteRow(index)}
                                                    startIcon={<DeleteIcon/>}
                                                    />
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>

                <Tooltip
                    title={
                        <Typography
                            sx={{fontWeight: 'bold', fontFamily: 'Poppins', fontSize: 16, textAlign: 'center'}}>
                            {inRows.length === 0 ? 'Adicione pelo menos uma entrada e saída!' : 'Clique para salvar a tarefa e gerar um link!'}
                        </Typography>
                    }
                >
                    <div>
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: '#17202A',
                                color: '#ffffff',
                                fontFamily: 'Poppins',
                                fontSize: 18,
                                fontWeight: 'bolder',
                                width: 300,
                                height: 50,
                                borderRadius: 5,
                                marginTop: 20,
                                textTransform: 'none',
                                alignSelf: 'center'
                            }}
                            onClick={save}
                            disabled={inRows.length === 0}
                        >
                            Salvar tarefa
                        </Button>
                    </div>
                </Tooltip>
            </div>
        </React.Fragment>
    );
}

export default RegisterTask;