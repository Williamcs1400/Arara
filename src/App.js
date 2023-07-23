import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React, {useEffect} from 'react';
import Main from "./components/main";
import Ide from "./components/ide";
import RegisterTask from "./components/registerTask";
import Login from "./components/Pages/login";

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
                <Route path="/login" element={<Login height={height} width={width}/>}/>
                <Route path="/ide" element={<Ide height={height} width={width}/>}/>
                <Route path="/registerTask" element={<RegisterTask height={height} width={width}/>}/>
            </Routes>
        </Router>
    );
}

export default App;
