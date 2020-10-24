import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import {getColor} from '../../common/common';

export default function Legend(props){
    const labelsRef = useRef(null);
    const legendRef = useRef(null);
    const [covidInfo, setCovidInfo] = useState(null);

    useEffect(() => {
        const cases = [0, 99, 499, 1199, 3999];
        
        labelsRef.current = cases.map((el, i) => {
            if(i == 0){
                return <li key={i}><i style={{backgroundColor: getColor(el)}}></i>{el}</li>;
            }
            else if(i == cases.length - 1){
                return(
                    <>
                        <li key={i}>
                            <i style={{backgroundColor: getColor(el)}}></i>
                            {cases[i-1] + 1} - {el}
                        </li>
                        <li key={i+1}>
                            <i style={{backgroundColor: getColor(el+1)}}></i>
                            &gt; {el}
                        </li>
                    </>
                );
            }
            return(
                <li key={i}>
                    <i style={{backgroundColor: getColor(el)}}></i>
                    {cases[i-1] + 1} - {el}
                </li>
            );
        });

    }, []);

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

    return labelsRef.current ? (
        <div className={style.legend}>
            {covidInfo}
            <div ref={legendRef} className={style['legend-inner']}>
                <h2>Cases</h2>
                <ul className={style['legend-list']}>
                    {labelsRef.current}
                </ul>
            </div>
        </div>
    ) : '';
}