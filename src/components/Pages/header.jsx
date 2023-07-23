import React from 'react';
import '../../styles/header.css';
import logo512 from '../../assets/logo512.png';
import person from '../../assets/person.png';
import {Button} from "@mui/material";
import { useNavigate  } from "react-router-dom";
import {auth} from "../../services/firebase/firabaseConfig";
import {getCurrentUser} from "../../services/firebase/firebaseAux";

export default function Header(props) {
    const [showLogo, setShowLogo] = React.useState(true);
    const [showLogin, setShowLogin] = React.useState(true);
    const [textButton, setTextButton] = React.useState('Entrar/Registrar');
    const [barColor, setBarColor] = React.useState('#17202A');
    const navigate = useNavigate();

    React.useEffect(() => {
        if(props) {
            setShowLogo(props.showIcon)
            setShowLogin(props.showButtonLogin)
            if(props.barColor){
                setBarColor(props.barColor)
            }
        }
        if(getCurrentUser()) {
            setTextButton(getCurrentUser().name);
        }
    }, [props]);

    const handleClickOpen = () => {
        navigate('/login', { state: { redirectUrl: '/' }});
    };

    const goToHome = () => {
        window.location.href = '/';
    }

    return (
        <div className="main-header" style={{backgroundColor: barColor}}>
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