import React, {useEffect} from 'react';
import '../../styles/header.css';
import logo512 from '../../assets/logo512.png';
import person from '../../assets/person.png';
import exit from '../../assets/exit.png';
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {auth, db, isLogged} from "../../services/firebase/firabaseConfig";
import {getCurrentUser} from "../../services/firebase/firebaseAux";
import {getDocs, getDoc, collection, query, where} from "firebase/firestore";
import Drawer from '@mui/material/Drawer';
import {onAuthStateChanged} from "firebase/auth";

export default function Header(props) {
    const [showLogo, setShowLogo] = React.useState(true);
    const [showLogin, setShowLogin] = React.useState(true);
    const [textButton, setTextButton] = React.useState('Entrar/Registrar');
    const [redirectUrl, setRedirectUrl] = React.useState('/');
    const [barColor, setBarColor] = React.useState('#17202A');
    const [name, setName] = React.useState('');
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [flag, setFlag] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (props) {
            setShowLogo(props.showIcon)
            setShowLogin(props.showButtonLogin)
            setRedirectUrl(props.redirectUrl)
            if (props.barColor) {
                setBarColor(props.barColor)
            }
        }
        getUserData();
    }, [props]);

    async function getUserData() {
        if (getCurrentUser() && !flag) {
            setFlag(true);
            const uuid = getCurrentUser().uuid;
            const q = query(collection(db, 'users'), where('uid', "==", uuid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.docs.length > 0) {
                const doc = querySnapshot.docs[0];
                setTextButton(doc.data().name);
                setName(doc.data().name);
            }
        }
    }

    const handleClickOpen = () => {
        if (getCurrentUser()) {
            setOpenDrawer(true);
        } else {
            navigate('/login', {state: {redirectUrl: '/'}});
        }
    };

    const logout = () => {
        auth.signOut().then(() => {
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        });
    }

    const goToHome = () => {
        window.location.href = '/';
    }

    return (
        <div className="main-header" style={{backgroundColor: barColor}}>
            <Drawer
                anchor={'right'}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: "#17202A",
                        color: "white",
                    }
                }}
            >
                <div>
                    <div style={{display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'right'}}>
                        <Button style={{
                            color: '#fff',
                            fontSize: 22,
                            fontWeight: 'lighter',
                            alignSelf: 'center',
                            fontFamily: 'Poppins',
                            textTransform: 'none',
                            textAlign: 'right',
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 5,
                        }}
                                onClick={logout}
                        >
                            <img src={exit} alt="logo" width='25' height='25'
                                 style={{alignSelf: 'center', marginRight: 5}}/>
                            Sair
                        </Button>
                    </div>
                </div>
            </Drawer>
            {showLogo &&
                <img
                    src={logo512}
                    alt="logo" width='50'
                    height='50'
                    style={{alignSelf: 'center', marginLeft: 15, cursor: 'pointer'}}
                    onClick={goToHome}/>
            }
            {showLogin && <div style={{display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'right'}}>
                <Button style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 'lighter',
                    alignSelf: 'center',
                    fontFamily: 'Poppins',
                    textTransform: 'none',
                    textAlign: 'right'
                }}
                        onClick={handleClickOpen}
                >
                    <img src={person} alt="logo" width='50' height='50' style={{alignSelf: 'center'}}/>
                    {textButton}
                </Button>
            </div>}
        </div>
    );
}