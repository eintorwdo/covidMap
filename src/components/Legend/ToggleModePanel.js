import React, { useContext } from 'react';
import {ModeContext} from '../../providers/providers';
import style from './style.module.css';

const mouseOver = (map) => {
    return () => {
        map.dragging.disable();
        map.doubleClickZoom.disable();
    }
}

const mouseOut = (map) => {
    return () => {
        map.dragging.enable();
        map.doubleClickZoom.disable();
    }
}

export default function ToggleModePanel(){
    const {mode, setMode, map} = useContext(ModeContext);

    return(
        <div className={style['legend-inner']} style={{textAlign: 'center'}}
            onMouseOver={mouseOver(map)} onMouseOut={mouseOut(map)} onTouchStart={mouseOver(map)} onTouchEnd={mouseOut(map)}>
            <h2>Show:</h2>
            <div className={`${style.button}  ${style['cases-button']}`}>
                <h3 onClick={() => {setMode('cases')}}
                    className={`${style['button-inner']} ${mode == 'cases' ? style.active : ''}`}>
                    Cases
                </h3>
            </div>
            <div className={`${style.button}  ${style['deaths-button']}`}>
                <h3 onClick={(e) => {setMode('deaths')}}
                    className={`${style['button-inner']} ${mode == 'deaths' ? style.active : ''}`}>
                    Deaths
                </h3>
            </div>
        </div>
    );
}