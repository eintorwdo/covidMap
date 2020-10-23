import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import {getColor} from '../../common/common';

export default function Legend(){
    const labelsRef = useRef(null);

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

    return labelsRef.current ? (
        <div className={style.legend}>
            <h2>Cases</h2>
            <ul className={style['legend-list']}>
                {labelsRef.current}
            </ul>
        </div>
    ) : '';
}