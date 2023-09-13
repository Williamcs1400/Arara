import {Routes, Route, HashRouter} from 'react-router-dom';
import React, {useEffect} from 'react';
import Main from './components/main';
import Ide from './components/Pages/codeComponents/ide';
import RegisterTask from './components/Pages/registerTask';
import Login from './components/Pages/login';
import RegisterFinish from './components/Pages/registerFinish';
import MyTasks from './components/Pages/myTasks';
import Task from './components/Pages/task';
import TaskDetails from './components/Pages/taskDetails';
import ReactDOM from 'react-dom/client';
import Header from './components/Pages/header';
import {getCurrentUser, persistIsTeacher, persistName, persistUuid} from './services/firebase/firebaseAux';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from './services/firebase/firabaseConfig';
import About from "./components/Pages/about";
import Feedback from "./components/Pages/feedback";


function App() {
    const [height, setHeight] = React.useState(document.querySelector('#height'));
    const [width, setWidth] = React.useState(document.querySelector('#width'));

    const [showIcon, setShowIcon] = React.useState(false);
    const [showButtonLogin, setShowButtonLogin] = React.useState(false);
    const [redirectUrl, setRedirectUrl] = React.useState('/');
    const [barColor, setBarColor] = React.useState('#17202A');
    const [nameTask, setNameTask] = React.useState('');
    const [nameUser, setNameUser] = React.useState('');
    const [isTeacher, setIsTeacher] = React.useState(false);

    const [flag, setFlag] = React.useState(false);

    let interval = setInterval(getUserData, 1000);

    // Atualiza o tamanho da tela
    function updateSize() {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }

    // TODO: Verificar se o usuário está logado logo de primeira
    // QUANDO ELE ENTRA NA TELA INICIAL APARECE QUE ELE NÃO ESTÁ LOGADO
    async function getUserData() {
        if (getCurrentUser() && nameUser === '') {
            setFlag(true);
            const email = getCurrentUser().email;
            const q = query(collection(db, 'users'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.docs.length > 0) {
                const doc = querySnapshot.docs[0];
                setNameUser(doc.data().name);
                setIsTeacher(doc.data().isTeacher);
                persistIsTeacher(doc.data().isTeacher);
                persistUuid(doc.data().uid);
                persistName(doc.data().name);
            }
        }else{
            clearInterval(interval)
        }
    }


    useEffect(() => {
        updateSize();
    }, []);

    useEffect(() => {
        if(nameUser !== '') {
            clearInterval(interval);
        }
    }, [getUserData]);

    window.addEventListener('resize', updateSize);

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
                <Route id='main' path='/' element={<Main />}/>
                <Route id='entrar' path='/entrar' element={<Login getUserData={getUserData}/>}/>
                <Route id='livre' path='/livre' element={<Ide />}/>
                <Route id='cadastrarAtividade' path='/cadastrarAtividade' element={<RegisterTask />}/>
                <Route id='cadastroAtividadeFeito' path='/cadastroAtividadeFeito' element={<RegisterFinish />}/>
                <Route id='minhasAtividades' path='/minhasAtividades' element={<MyTasks />}/>
                <Route id='detalhes' path='/detalhes/:id?' element={<TaskDetails />}/>
                <Route id='atividade' path='/atividade/:id?' element={<Task />}/>
                <Route id='quemSomos' path='/quemSomos' element={<About />}/>
                <Route id="feedback" path="/melhorias" element={<Feedback /> }/>
            </Routes>
        </HashRouter>
    );
}

export default App;
