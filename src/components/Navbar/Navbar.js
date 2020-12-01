import React, {useState, useContext, useEffect, useRef} from 'react';
import {ModeContext} from '../../providers/providers';
import style from './style.module.css';

export default function Navbar(props){
    const {country, countryClicked, countryNames} = useContext(ModeContext);
    const [countryName, setCountryName] = useState(null);

    useEffect(() => {
        let div;
        if(country && countryClicked){
            div = 
            <div>
                <h2 className={`header ${style['name-wrapper']}`}>
                    <img src={`https://www.countryflags.io/${country.feature.iso_a2}/shiny/64.png`}/>
                    {country?.feature?.formal_en}
                </h2>
            </div>
        }
        else{
            div =
            <div>
                <h2 className="header" style={{lineHeight: '2em'}}>Global</h2>
            </div> 
        }

        setCountryName(div);
    }, [country, countryClicked]);

    return(
        <>
            <div className={`${style.navbar} ${props.sticky ? style.sticky : ''}`}>
                <h1 className="header">COVID-19 dashboard</h1>
                <div className={style['navbar-bottom']}>
                    {countryName}
                    <a href="#chart-wrapper" className={`${style['button-link']}`}>
                        <div className={`${style['graphs-button']}`}>
                            <i className="far fa-chart-bar"></i>
                            <h2 className="header">
                                Graphs
                            </h2>
                        </div>
                    </a>
                </div>
            </div>
        </>
    );
}