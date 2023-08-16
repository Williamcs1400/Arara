import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Header from "./header";
import {tabSx} from "../../styles/specificStyles/tabStyles";
import {collection, doc, getDocs, query, where, collectionGroup} from "firebase/firestore";
import {db} from "../../services/firebase/firabaseConfig";
import {getCurrentUser} from "../../services/firebase/firebaseAux";
import ListAttemps from "./subComponents/listAttemps";
import ListTasks from "./subComponents/listTasks";
import Swal from "sweetalert2";
import Typography from "@mui/material/Typography";

function MyTasks(props) {
    const [value, setValue] = React.useState('1');
    const [studentTasks, setStudentTasks] = React.useState([]);
    const [teacherTasks, setTeacherTasks] = React.useState([]);
    const [flag, setFlag] = React.useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    async function getData() {
        if (!flag) {
            Swal.fire({
                title: 'Buscando tarefas...',
            });
            Swal.showLoading();
            const user = getCurrentUser();

            const q = query(collection(db, 'users', user.uuid, 'myAttempts'));
            const querySnapshot = await getDocs(q);

            const array = [];
            querySnapshot.forEach((doc) => {
                array.push(doc.data());
            });

            array.sort((a, b) => {
                return a.date.seconds - b.date.seconds;
            });

            setStudentTasks(array.reverse());

            if (user.isTeacher) {
                const array2 = [];
                const q2 = query(collection(db, 'tasks'), where('teacher', '==', user.uuid));
                const querySnapshot2 = await getDocs(q2);

                querySnapshot2.forEach((doc) => {
                    let aux = doc.data();
                    aux.id = doc.id;
                    array2.push(aux);
                });

                array2.sort((a, b) => {
                    return a.date.seconds - b.date.seconds;
                });

                setTeacherTasks(array2.reverse());
            }
            Swal.close();
        }
    }

    useEffect(() => {
        getData();

    }, [getCurrentUser()]);

    return (
        <div style={{minHeight: props.height - 1, height: 'fit-content', width: props.width, background: '#DCDCDC'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box style={{marginTop: 25}}>
                    <TabContext value={value}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <TabList onChange={handleChange} sx={tabSx}>
                                <Tab label="Suas tentativas" value="1"
                                     style={{
                                         width: 350, borderRadius: '10px 0 0 10px', textTransform: 'none',
                                         fontSize: 18, fontWeight: 'bold'
                                     }}
                                />
                                <Tab label="Atividades cadastradas" value="2"
                                     style={{
                                         width: 350, borderRadius: '0 10px 10px 0', textTransform: 'none',
                                         fontSize: 18, fontWeight: 'bold'
                                     }}
                                />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            {studentTasks.length === 0 ?
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontFamily: 'Poppins',
                                        fontSize: 26,
                                        textAlign: 'center',
                                        color: '#17202a'
                                    }}>
                                    Você ainda não realizou nenhuma atividade!
                                </Typography>
                                :
                                <ListAttemps data={studentTasks}/>
                            }

                        </TabPanel>
                        <TabPanel value="2">
                            {teacherTasks.length === 0 ?
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontFamily: 'Poppins',
                                        fontSize: 26,
                                        textAlign: 'center',
                                        color: '#17202a'
                                    }}>
                                    Nenhuma atividade cadastrada!
                                </Typography>
                                :
                                <ListTasks data={teacherTasks}/>
                            }
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
        </div>
    );
}

export default MyTasks;