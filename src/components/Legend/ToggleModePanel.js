import React, { useContext } from 'react';
import {ModeContext} from '../../providers/providers';
import style from './style.module.css';

const mOver = (map) => {
    return () => {
        map.dragging.disable();
        map.doubleClickZoom.disable();
    }
}

const mOut = (map) => {
    return () => {
        map.dragging.enable();
        map.doubleClickZoom.enable();
    }
}

export default function ToggleModePanel(){
    const {mode, setMode, map} = useContext(ModeContext);

    return(
        <div className={style['legend-inner']} style={{textAlign: 'center'}}
            onMouseEnter={mOver(map)} onMouseLeave={mOut(map)} onTouchStart={mOver(map)} onTouchEnd={mOut(map)}>
            <h2>Show:</h2>
            <div className={`${style.button}  ${style['cases-button']}`}>
                <h3 onClick={() => {setMode('cases');map.dragging.enable();}}
                    className={`${style['button-inner']} ${mode == 'cases' ? style.active : ''}`}>
                    Cases
                </h3>
            </div>
            <div className={`${style.button}  ${style['deaths-button']}`}>
                <h3 onClick={(e) => {setMode('deaths');map.dragging.enable();}}
                    className={`${style['button-inner']} ${mode == 'deaths' ? style.active : ''}`}>
                    Deaths
                </h3>
            </div>
        </div>
    );
}