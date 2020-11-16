import React, { useState, useEffect, useContext } from 'react';
import style from './style.module.css';

import {ModeContext} from '../../providers/providers';

export default function CovidDataPanel(props){
    const [covidInfo, setCovidInfo] = useState(null);
    const {country} = useContext(ModeContext);

    useEffect(() => {
        const info = country ?
            (
                <div id='country-hover-popup' className={style['legend-inner']}>
                    <ul className={style['legend-list']}>
                        <li key='1'>
                            <b>{country?.feature.name}</b>
                        </li>
                        <li key='2'>
                            New cases: {country.covid?.NewConfirmed?.toLocaleString()}
                        </li>
                        <li key='3'>
                            Total cases: {country.covid?.TotalConfirmed?.toLocaleString()}
                        </li>
                        <li key='4'>
                            New deaths: {country.covid?.NewDeaths?.toLocaleString()}
                        </li>
                        <li key='5'>
                            Total deaths: {country.covid?.TotalDeaths?.toLocaleString()}
                        </li>
                    </ul>
                </div>
            ) : '';
        setCovidInfo(info);
    }, [country]);

    return(
        <>
        {covidInfo}
        </>
    );
}