import React from 'react';
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav';
import '../styles/sidebar.css';
import playButton from '../assets/playButton.png';

export default function Sidebar() {
    return (
        <SideNav
            onSelect={(selected) => {
                console.log(selected);
            }}
        >
            <SideNav.Toggle/>
            <SideNav.Nav>
                <NavItem eventKey="home">
                    <NavIcon>
                        <img src={playButton} width="20" height="20" alt="play button"/>
                    </NavIcon>
                    <NavText>
                        Executar
                    </NavText>
                </NavItem>
                {/*<NavItem eventKey="charts">*/}
                {/*    <NavIcon>*/}
                {/*        <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />*/}
                {/*    </NavIcon>*/}
                {/*    <NavText>*/}
                {/*        TESTE*/}
                {/*    </NavText>*/}
                {/*    <NavItem eventKey="charts/linechart">*/}
                {/*        <NavText>*/}
                {/*            Line Chart*/}
                {/*        </NavText>*/}
                {/*    </NavItem>*/}
                {/*    <NavItem eventKey="charts/barchart">*/}
                {/*        <NavText>*/}
                {/*            Bar Chart*/}
                {/*        </NavText>*/}
                {/*    </NavItem>*/}
                {/*</NavItem>*/}
            </SideNav.Nav>
        </SideNav>
    );
}
