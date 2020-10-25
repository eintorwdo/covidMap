import React, { useEffect, useRef, useState, useContext } from 'react';
import style from './style.module.css';
import {getColor} from '../../common/common';
import {ModeContext} from '../../providers/providers';

export default function Legend(props){
    const [labels, setLabels] = useState(null);
    const [covidInfo, setCovidInfo] = useState(null);
    const legendRef = useRef(null);

    const {mode, setMode} = useContext(ModeContext);

    useEffect(() => {
        let cases;
        let labels;

        if(mode == 'cases'){
            cases = [0, 99, 499, 1199, 3999];
            labels = cases.map((el) => {
                return {
                    NewConfirmed: el
                }
            });
        }
        else if(mode == 'deaths'){
            cases = [0, 49, 99, 199, 499];
            labels = cases.map((el) => {
                return {
                    NewDeaths: el
                }
            });
        }
        
        const newLabels = labels.map((el, i) => {
            if(i == 0){
                return <li key={i}><i style={{backgroundColor: getColor(el, mode)}}></i>{cases[i]}</li>;
            }
            else if(i == cases.length - 1){
                return(
                    <>
                        <li key={i}>
                            <i style={{backgroundColor: getColor(el, mode)}}></i>
                            {cases[i-1] + 1} - {cases[i]}
                        </li>
                        <li key={i+1}>
                            <i style={{backgroundColor: getColor(labels[i]+1, mode)}}></i>
                            &gt; {cases[i]}
                        </li>
                    </>
                );
            }
            return(
                <li key={i}>
                    <i style={{backgroundColor: getColor(el, mode)}}></i>
                    {cases[i-1] + 1} - {cases[i]}
                </li>
            );
        });
        setLabels(newLabels);

    }, [mode]);

    useEffect(() => {
        const info = props.country ?
            (
                <div className={style['legend-inner']}>
                    <ul className={style['legend-list']}>
                        <li>
                            <b>{props.country?.feature.name}</b>
                        </li>
                        <li>
                            New cases: {props.country?.covid?.NewConfirmed}
                        </li>
                        <li>
                            Total cases: {props.country?.covid?.TotalConfirmed}
                        </li>
                        <li>
                            New deaths: {props.country?.covid?.NewDeaths}
                        </li>
                        <li>
                            Total deaths: {props.country?.covid?.TotalDeaths}
                        </li>
                    </ul>
                </div>
            ) : '';
        setCovidInfo(info);
    }, [props.country]);

    return labels ? (
        <>
        <div className={style['bottom-left']}>
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
        </div>
        <div className={style['bottom-right']}>
            {covidInfo}
            <div ref={legendRef} className={style['legend-inner']}>
                <h2>Newly reported {mode}</h2>
                <ul className={style['legend-list']}>
                    {labels}
                </ul>
            </div>
        </div>
        </>
    ) : '';
}