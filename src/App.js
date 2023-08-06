import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React, {useEffect} from 'react';
import Main from "./components/main";
import Ide from "./components/ide";
import RegisterTask from "./components/registerTask";
import Login from "./components/Pages/login";
import RegisterFinish from "./components/Pages/registerFinish";
import MyTasks from "./components/Pages/myTasks";
import Task from "./components/Pages/task";

function App() {
    const [height, setHeight] = React.useState(document.querySelector("#height"));
    const [width, setWidth] = React.useState(document.querySelector("#width"));

    // Atualiza o tamanho da tela
    function updateSize() {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        updateSize();
    }, []);

    window.addEventListener("resize", updateSize);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main height={height} width={width}/>}/>
                <Route path="entrar" element={<Login height={height} width={width}/>}/>
                <Route path="/livre" element={<Ide height={height} width={width}/>}/>
                <Route path="/cadastrarAtividade" element={<RegisterTask height={height} width={width}/>}/>
                <Route path="/cadastroAtividadeFeito" element={<RegisterFinish />}/>
                <Route path="/minhasAtividades" element={<MyTasks />}/>
                <Route path="/atividade/:id?" element={<Task height={height} width={width}/>}/>
            </Routes>
        </Router>
    );
}

export default App;
