import React, { useContext } from 'react';
import {ModeContext} from '../../providers/providers';
import style from './style.module.css';

export default function ToggleModePanel(){
    const {mode, setMode} = useContext(ModeContext);

    return(
        <div className={style['legend-inner']} style={{textAlign: 'center'}}>
            <h2>Show:</h2>
            <div className={style.button}>
                <h3 onClick={() => {setMode('cases')}}
                    className={`${style['button-inner']} ${mode == 'cases' ? style.active : ''}`}>
                    Cases
                </h3>
            </div>
            <div className={style.button}>
                <h3 onClick={() => {setMode('deaths')}}
                    className={`${style['button-inner']} ${mode == 'deaths' ? style.active : ''}`}>
                    Deaths
                </h3>
            </div>
        </div>
    );
}