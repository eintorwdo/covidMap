import React from 'react';
import style from './style.module.css';
import ToggleModePanel from './ToggleModePanel';
import Labels from './Labels';
import CovidDataPanel from './CovidDataPanel';

export default function Legend(props){
    return (
        <>
        <ToggleModePanel />
        <div className={style['bottom-right']}>
            <CovidDataPanel country={props.country}/>
            <Labels />
        </div>
        </>
    );
}