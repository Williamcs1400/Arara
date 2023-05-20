import React from 'react';
import '../../styles/header.css';
import logo512 from '../../assets/logo512.png';

export default function Header() {
    return (
        <div className="main-header">
            <img src={logo512} alt="logo" width='50' height='50' style={{alignSelf: 'center', marginLeft: 15}}/>
        </div>
    );
}