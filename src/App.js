import {BrowserRouter as Router, Routes, Route, HashRouter, createHashRouter, RouterProvider} from "react-router-dom";
import React, {useEffect} from 'react';
import Main from "./components/main";
import Ide from "./components/ide";
import RegisterTask from "./components/registerTask";
import Login from "./components/Pages/login";
import RegisterFinish from "./components/Pages/registerFinish";
import MyTasks from "./components/Pages/myTasks";
import Task from "./components/Pages/task";
import TaskDetails from "./components/Pages/taskDetails";
import ReactDOM from 'react-dom/client';

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

    console.log('estou app.js')

    const router = createHashRouter([
        {path: '/', element: <Main height={height} width={width}/>},
        {path: '/entrar', element: <Login height={height} width={width}/>},
        {path: '/livre', element: <Ide height={height} width={width}/>},
        {path: '/cadastrarAtividade', element: <RegisterTask height={height} width={width}/>},
        {path: '/cadastroAtividadeFeito', element: <RegisterFinish/>},
        {path: '/minhasAtividades', element: <MyTasks height={height} width={width}/>},
        {path: '/detalhes/:id?', element: <TaskDetails height={height} width={width}/>},
        {path: '/atividade/:id?', element: <Task height={height} width={width}/>},
    ]);

    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}

export default App;
