import React, {useState, useEffect, useRef} from 'react';
import Chart from 'chart.js';
import Papa from 'papaparse';
import style from './style.module.css';
// import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const reduceData = (data) => {
    data = data.slice(1,-1)
    const res = [];

    for(let el of data){
        const newDate = el[0];
        const index = res.findIndex((item) => {
            return item.date == newDate;
        });

        if(index !== -1){
            const day = res[index];
            res[index] = {
                ...day,
                cumulativeCases: day.cumulativeCases + parseInt(el[5]),
                cumulativeDeaths: day.cumulativeDeaths + parseInt(el[7]),
                newCases: day.newCases + parseInt(el[4]),
                newDeaths: day.newDeaths + parseInt(el[6])
            }
        }
        else{
            res.push({
                date: newDate,
                cumulativeCases: parseInt(el[5]),
                cumulativeDeaths: parseInt(el[7]),
                newCases: parseInt(el[4]),
                newDeaths: parseInt(el[6])
            });
        }
    }

    return res;
}

const getChartData = (data, mode = 'cases') => {
    const out = {
        labels: data.map(el => el.date),
        datasets: [{
            label: `New ${mode}`,
            backgroundColor: mode === 'cases'
                ? "rgba(255,99,132,1)"
                : "rgba(3,165,252,1)",
            borderWidth: 0,
            hoverBackgroundColor: mode === 'deaths'
                ? "rgba(255,99,132,1)"
                : "rgba(3,165,252,1)",
            data: data.map(el => {
                if(mode === 'cases') return el.newCases;
                else if(mode === 'deaths') return el.newDeaths;
            })
        }]
    }

    return out;
}

const chartOptions = () => {
    return {
        maintainAspectRatio: false,
        tooltips: {
            xPadding: 12,
            yPadding: 12,
            position: 'nearest'
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'month'
                },
                gridLines: {
                    display: false
                },
                barPercentage: 1,
                categoryPercentage: 1
            }]
        }
    };
}

export default function CumulativeGraph(){
    const [data, setData] = useState(null);
    const casesChartRef = useRef(null);
    const deathsChartRef = useRef(null);
    const casesWrapperRef = useRef(null);
    const deathsWrapperRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            let whoData = await fetch('https://ClassicImpureProperties.eintorwdo.repl.co');
            whoData = await whoData.text();
            whoData = Papa.parse(whoData);
            const graphData = reduceData(whoData.data);
            setData(graphData);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const casesWrapper = document.querySelector('#cases-chart');
        const deathsWrapper = document.querySelector('#deaths-chart');
        if(data && casesWrapper && deathsWrapper){
            const ctx1 = casesWrapper.getContext('2d');
            casesChartRef.current = new Chart(ctx1, {
                type: 'bar',
                data: getChartData(data, 'cases'),
                options: chartOptions()
            });

            const ctx2 = deathsWrapper.getContext('2d');
            deathsChartRef.current = new Chart(ctx2, {
                type: 'bar',
                data: getChartData(data, 'deaths'),
                options: chartOptions()
            });
        }
    }, [data, casesChartRef, deathsWrapperRef]);

    return(
        <>
            <div className={style['chart-wrapper']}>
                <h1 className="header">New cases per day</h1>
                {data
                    ? <canvas ref={casesWrapperRef} id="cases-chart" className="chart"></canvas>
                    : <div className={style['spinner-wrapper']}>
                        <ClipLoader 
                            size={130}
                            color={"#123abc"}
                            loading={true}
                        />
                    </div> 
                }
                <h1 className="header">New deaths per day</h1>
                {data
                    ? <canvas ref={deathsWrapperRef} id="deaths-chart" className="chart"></canvas>
                    : <div className={style['spinner-wrapper']}>
                        <ClipLoader 
                            size={130}
                            color={"#123abc"}
                            loading={true}
                        />
                    </div> 
                }
            </div>
        </>
    );
}