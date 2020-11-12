import React, {useState, useContext, useEffect} from 'react';
import style from './style.module.css';

export default function Navbar(props){
    
    return(
        <>
            <div className={`${style.navbar} ${props.sticky ? style.sticky : ''}`}>
                <h1 className="header">COVID-19 dashboard</h1>
            </div>
        </>
    );
}