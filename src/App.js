import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React, {useEffect} from 'react';
import Home from "./components/home";
import RegisterTask from "./components/registerTask";

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
                <Route path="/" element={<Home height={height} width={width}/>}/>
                <Route path="/registerTask" element={<RegisterTask height={height} width={width}/>}/>
            </Routes>
        </Router>
    );
}

export default App;
