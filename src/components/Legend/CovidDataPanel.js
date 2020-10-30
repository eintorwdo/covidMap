import React, { useState, useEffect } from 'react';
import style from './style.module.css';

export default function CovidDataPanel(props){
    const [covidInfo, setCovidInfo] = useState(null);

    useEffect(() => {
        const info = props.country ?
            (
                <div id='country-hover-popup' className={style['legend-inner']}>
                    <ul className={style['legend-list']}>
                        <li key='1'>
                            <b>{props.country?.feature.name}</b>
                        </li>
                        <li key='2'>
                            New cases: {props.country.covid?.NewConfirmed?.toLocaleString()}
                        </li>
                        <li key='3'>
                            Total cases: {props.country.covid?.TotalConfirmed?.toLocaleString()}
                        </li>
                        <li key='4'>
                            New deaths: {props.country.covid?.NewDeaths?.toLocaleString()}
                        </li>
                        <li key='5'>
                            Total deaths: {props.country.covid?.TotalDeaths?.toLocaleString()}
                        </li>
                    </ul>
                </div>
            ) : '';
        setCovidInfo(info);
    }, [props.country]);

    return(
        <>
        {covidInfo}
        </>
    );
}