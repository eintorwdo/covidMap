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

export default function Legend(props){
    const {setCountry} = useContext(ModeContext);

    useEffect(() => {
    }, [props.countryClicked])

    return (
        <>
        <div className={style['bottom-left']}>
            <ToggleModePanel />
        </div>
        <div id='labels-covid-wrapper' className={style['bottom-right']} onMouseLeave={onMouseLeave(setCountry, props.countryClicked)}>
            <CovidDataPanel country={props.country}/>
            <Labels />
        </div>
        </>
    );
}