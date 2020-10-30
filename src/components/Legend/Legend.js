import React, {useContext} from 'react';
import style from './style.module.css';
import ToggleModePanel from './ToggleModePanel';
import Labels from './Labels';
import CovidDataPanel from './CovidDataPanel';
import {ModeContext} from '../../providers/providers';

export default function Legend(props){
    const {setCountry} = useContext(ModeContext);

    return (
        <>
        <div className={style['bottom-left']}>
            <ToggleModePanel />
        </div>
        <div id='labels-covid-wrapper' className={style['bottom-right']} onMouseLeave={()=>{setCountry(null)}}>
            <CovidDataPanel country={props.country}/>
            <Labels />
        </div>
        </>
    );
}