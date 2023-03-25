import React from 'react';
import EditorPage from "./components/editorPage";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

function App() {
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
                <Sidebar/>
            </div>

            <div style={{marginLeft: 64}}>
                <Header/>
                <EditorPage/>
            </div>

        </div>
    );
}

export default App;
