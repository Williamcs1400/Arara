import React, {useEffect} from 'react';
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import InOut from "./components/in_out";
import CodeEditor from "./components/codeEditor";

function App() {
    const [openTerminal, setOpenTerminal] = React.useState(false);
    const [executedCode, setExecutedCode] = React.useState([]);
    const [height, setHeight] = React.useState(document.querySelector("#height"));
    const [width, setWidth] = React.useState(document.querySelector("#width"));

    const [terminalHeight, setTerminalHeight] = React.useState(0);

    // Atualiza o tamanho da tela
    function updateSize() {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        updateSize();
    }, []);

    window.addEventListener("resize", updateSize);

    // Abre ou fecha o terminal - adequando o tamanho da tela
    function handleTerminal(message){
        if(message !== undefined){
            setExecutedCode(message);
            setTerminalHeight((height / 3) + 150)
            setOpenTerminal(true);
        }else {
            setExecutedCode(message);
            setTerminalHeight(0)
            setOpenTerminal(false);
        }
    }

    return (
        <div style={{
            display: 'flex',
            flex: 1,
            justifyItems: 'start',
            alignItems: 'start',
            flexDirection: 'column',
            position: 'absolute'
        }}>
            <div>
                <Sidebar openTerminal={handleTerminal}/>
            </div>

            <div style={{marginLeft: 64}}>
                <Header />
                <CodeEditor height={height - terminalHeight} width={width}/>
                {openTerminal ? <InOut height={terminalHeight} width={width} closeTerminal={handleTerminal} executableCode={executedCode}/> : null}
            </div>

        </div>
    );
}

export default App;
