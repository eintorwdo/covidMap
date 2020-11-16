import React, {useState, useContext, useEffect} from 'react';
import {ModeContext} from '../../providers/providers';
import style from './style.module.css';

export default function Navbar(props){
    const {country, countryClicked} = useContext(ModeContext);
    const [countryName, setCountryName] = useState(null);

    useEffect(() => {
        let div;
        if(country && countryClicked){
            div = <h2 className="header">{country?.feature?.formal_en}</h2>
        }
        else{
            div = <h2 className="header">Global</h2>
        }

        setCountryName(div);
    }, [country, countryClicked]);

    return(
        <>
            <div className={`${style.navbar} ${props.sticky ? style.sticky : ''}`}>
                <h1 className="header">COVID-19 dashboard</h1>
                {countryName}
            </div>
        </>
    );
}