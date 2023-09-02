import React, {useEffect} from 'react';
import myPhoto from '../../assets/myPhoto.jpg';
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import githubColored from "../../assets/githubColored.png";
import instagram from "../../assets/instagram.png";
import linkedin from "../../assets/linkedin.png";
import portfolio from "../../assets/portfolio.png";
import {useNavigate} from "react-router-dom";
import {githubLink, linkedinLink, instagramLink, portfolioLink} from "../../services/analyzers/definitions/consts";

function About() {
    const [height, setHeight] = React.useState(null);
    const [width, setWidth] = React.useState(null);

    useEffect(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }, []);

    function goToGithub() {
        window.open(githubLink, '_blank');
    }

    function goToInstagram() {
        window.open(instagramLink, '_blank');
    }

    function goToLinkedin() {
        window.open(linkedinLink, '_blank');
    }

    function goToPortfolio() {
        window.open(portfolioLink, '_blank');
    }

    return (
        <div style={{height: height - 70, width: width, backgroundImage: 'linear-gradient(180deg, #17202a,  #85c1e9)'}}>
            <div
                style={{
                    display: 'flex', textAlign: 'center',
                    flexDirection: 'column', justifyItems: 'center'
                }}
            >
                <img src={myPhoto}
                     style={{
                         width: '15%',
                         height: '15%',
                         objectFit: 'cover',
                         borderRadius: '50%',
                         margin: 'auto',
                         boxShadow: '0 100px 100px #17202a',
                         marginTop: 10
                     }}
                     alt="myPhoto"/>
                <Typography variant='subheading' sx={{
                    fontWeight: 'bold',
                    fontFamily: 'Poppins',
                    fontSize: 36,
                    color: '#fff',
                    textShadow: '0 100px 100px #17202a'
                }} noWrap>
                    William Coelho
                </Typography>
                <Typography variant='subheading' sx={{
                    fontWeight: 'light',
                    fontFamily: 'Poppins',
                    fontSize: 22,
                    color: '#fff',
                }} noWrap>
                    Programador Full Stack
                    <br/>
                    Estudante de Ciência da Computação na Universidade de Brasília - UnB
                    <br/>
                    Principais skills: React, Java, Moblie, Banco de Dados, Python, JavaScript, Spring Boot
                </Typography>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                    <Button
                        style={{
                            color: '#fff', fontSize: 22, fontWeight: 'bold',
                            alignSelf: 'center', fontFamily: 'Poppins', textTransform: 'none',
                            textAlign: 'right', marginLeft: 10, marginRight: 10, width: 180, marginTop: 5,
                        }}
                        sx={{':hover': {backgroundColor: '#0e4271'}}}
                        onClick={goToGithub}
                    >
                        <img src={githubColored} alt="logo" width='25' height='25'
                             style={{alignSelf: 'center', marginRight: 5}}/>
                        Github
                    </Button>

                    <Button
                        style={{
                            color: '#fff', fontSize: 22, fontWeight: 'bold',
                            alignSelf: 'center', fontFamily: 'Poppins', textTransform: 'none',
                            textAlign: 'right', marginLeft: 10, marginRight: 10, width: 180, marginTop: 5,
                        }}
                        sx={{':hover': {backgroundColor: '#ff4c00'}}}
                        onClick={goToInstagram}
                    >
                        <img src={instagram} alt="logo" width='25' height='25'
                             style={{alignSelf: 'center', marginRight: 5}}/>
                        Instagram
                    </Button>

                    <Button
                        style={{
                            color: '#fff', fontSize: 22, fontWeight: 'bold',
                            alignSelf: 'center', fontFamily: 'Poppins', textTransform: 'none',
                            textAlign: 'right', marginLeft: 10, marginRight: 10, width: 180, marginTop: 5,
                        }}
                        sx={{':hover': {backgroundColor: '#006ba3'}}}
                        onClick={goToLinkedin}
                    >
                        <img src={linkedin} alt="logo" width='25' height='25'
                             style={{alignSelf: 'center', marginRight: 5}}/>
                        Linkedin
                    </Button>

                    <Button
                        style={{
                            color: '#fff', fontSize: 22, fontWeight: 'bold',
                            alignSelf: 'center', fontFamily: 'Poppins', textTransform: 'none',
                            textAlign: 'right', marginLeft: 10, marginRight: 10, width: 180, marginTop: 5,
                        }}
                        sx={{':hover': {backgroundColor: '#da4920'}}}
                        onClick={goToPortfolio}
                    >
                        <img src={portfolio} alt="logo" width='25' height='25'
                             style={{alignSelf: 'center', marginRight: 5}}/>
                        Portfólio
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default About;