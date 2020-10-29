import React, { useContext, useState, useEffect } from 'react';
import {ModeContext} from '../../providers/providers';
import style from './style.module.css';
import {getColor} from '../../common/common';

export default function Labels(){
    const {mode} = useContext(ModeContext);
    const [labels, setLabels] = useState(null);

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

    return(
        <div className={style['legend-inner']}>
            <h2>Newly reported {mode}</h2>
            <ul className={style['legend-list']}>
                {labels}
            </ul>
        </div>
    );
}