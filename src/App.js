import {Routes, Route, HashRouter, createHashRouter, useLocation} from "react-router-dom";
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
import Header from "./components/Pages/header";
import {getCurrentUser, persistIsTeacher, persistName, persistUuid} from "./services/firebase/firebaseAux";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "./services/firebase/firabaseConfig";


function App() {
    const [height, setHeight] = React.useState(document.querySelector("#height"));
    const [width, setWidth] = React.useState(document.querySelector("#width"));

    const [showIcon, setShowIcon] = React.useState(false);
    const [showButtonLogin, setShowButtonLogin] = React.useState(false);
    const [redirectUrl, setRedirectUrl] = React.useState('/');
    const [barColor, setBarColor] = React.useState('#17202A');
    const [nameTask, setNameTask] = React.useState('');
    const [nameUser, setNameUser] = React.useState('');
    const [isTeacher, setIsTeacher] = React.useState(false);

    const [flag, setFlag] = React.useState(false);

    // Atualiza o tamanho da tela
    function updateSize() {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }

    async function getUserData() {
        if (getCurrentUser() || nameUser === '') {
            setFlag(true);
            const email = getCurrentUser().email;
            const q = query(collection(db, 'users'), where('email', "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.docs.length > 0) {
                const doc = querySnapshot.docs[0];
                setNameUser(doc.data().name);
                setIsTeacher(doc.data().isTeacher);
                persistIsTeacher(doc.data().isTeacher);
                persistUuid(doc.data().uid);
                persistName(doc.data().name);
            }
        }
    }

    useEffect(() => {
        updateSize();
        getUserData();
    }, []);

    window.addEventListener("resize", updateSize);



    ReactDOM.createRoot(document.getElementById('root')).render(
        <HashRouter>
            <Header showIcon={showIcon}
                    bColor={barColor}
                    showButtonLogin={showButtonLogin}
                    redirectUrl={redirectUrl}
                    nameT={nameTask}
                    nameUser={nameUser}
                    teacher={isTeacher}
            />
            <Routes>
                <Route path="/" element={<Main height={height} width={width} />}/>
                <Route path="/entrar" element={<Login height={height} width={width} getUserData={getUserData}/>}/>
                <Route path="/livre" element={<Ide height={height} width={width}/>}/>
                <Route path="/cadastrarAtividade" element={<RegisterTask height={height} width={width}/>}/>
                <Route path="/cadastroAtividadeFeito" element={<RegisterFinish />}/>
                <Route path="/minhasAtividades" element={<MyTasks height={height} width={width}/>}/>
                <Route path="/detalhes/:id?" element={<TaskDetails height={height} width={width} />}/>
                <Route path="/atividade/:id?" element={<Task height={height} width={width}/>}/>
            </Routes>
        </HashRouter>
    );
}

export default App;
