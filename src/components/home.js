import React, {useEffect} from "react";
import Sidebar from "./Pages/sidebar";
import Header from "./Pages/header";
import CodeEditor from "./Pages/codeEditor";
import InOut from "./Pages/in_out";

function Home(){
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

    // Abre ou fecha o terminal e executa o código - adequando o tamanho da tela
    function executeCode(message) {
        if (message !== undefined) {
            setExecutedCode(message);
            setTerminalHeight((height / 3) + 150)
            setOpenTerminal(true);
        } else {
            setExecutedCode(message);
            setTerminalHeight(0)
            setOpenTerminal(false);
        }
    }

    // Abre ou fecha o terminal sem executar o código - adequando o tamanho da tela
    function handleTerminal() {
        setTerminalHeight((height / 3) + 150)
        setOpenTerminal(true);
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
                <Sidebar executeCode={executeCode} openTerminal={handleTerminal}/>
            </div>

            <div style={{marginLeft: 64}}>
                <Header/>
                <CodeEditor height={height - terminalHeight} width={width}/>
                {openTerminal ? <InOut height={terminalHeight} width={width} closeTerminal={executeCode}
                                       executableCode={executedCode}/> : null}
            </div>

        </div>
    );

}

export default Home;