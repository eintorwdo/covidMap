import React, {useContext, useEffect} from 'react';
import style from './style.module.css';
import ToggleModePanel from './ToggleModePanel';
import Labels from './Labels';
import CovidDataPanel from './CovidDataPanel';
import {ModeContext} from '../../providers/providers';

const onMouseLeave = (setCountry, countryClicked) => {
    return () => {
        if(!countryClicked){
            setCountry(null);
        }
    }
}

export default function Legend(){
    const {setCountry, countryClicked} = useContext(ModeContext);

    return (
        <>
        <div className={style['bottom-left']} id='toggle-panel'>
            <ToggleModePanel />
        </div>
        <div id='labels-covid-wrapper' className={style['bottom-right']} onMouseLeave={onMouseLeave(setCountry, countryClicked)}>
            <CovidDataPanel />
            <Labels />
        </div>
        </>
    );
}