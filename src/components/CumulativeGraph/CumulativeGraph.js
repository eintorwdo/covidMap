import React, {useState, useEffect, useRef, useContext} from 'react';
import Chart from 'chart.js';
import Papa from 'papaparse';
import style from './style.module.css';
// import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import {ModeContext} from '../../providers/providers';

const findCountry = (name, countryCode, feature) => {
    return name.toLowerCase() == feature.name.toLowerCase() ||
        name.toLowerCase() == feature.formal_en.toLowerCase() ||
        countryCode == feature.iso_a2;
};

const sumCases = (el, res) => {
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

const reduce = (data, country) => {
    data = data.slice(1,-1)
    const res = [];

    if(country){
        for(let el of data){
            if(findCountry(el[2], el[1], country.feature)){
                sumCases(el, res);
            }
        }
    }
    else{
        for(let el of data){
            sumCases(el, res);
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
            hoverBackgroundColor: mode === 'deaths'
                ? "rgba(255,99,132,1)"
                : "rgba(3,165,252,1)",
            data: data.map(el => {
                if(mode === 'cases') return el.newCases;
                else if(mode === 'deaths') return el.newDeaths;
            }),
            barPercentage: 0.9,
            categoryPercentage: 0.9
        }]
    }

    return out;
}

const customTooltip = function(tooltipModel) {
    // Tooltip Element
    let tooltipEl = document.getElementById('chartjs-tooltip');
    let arrow = document.getElementById('chartjs-tooltip-arrow');
    let arrowBorder = document.getElementById('chartjs-tooltip-arrow-border');

    // Create element on first render
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = '<table></table>';
        arrow = document.createElement('div');
        arrow.id = 'chartjs-tooltip-arrow';
        arrowBorder = document.createElement('div');
        arrowBorder.id = 'chartjs-tooltip-arrow-border';
        document.body.appendChild(arrow);
        document.body.appendChild(tooltipEl);
        document.body.appendChild(arrowBorder);
    }

    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0;
        arrow.style.opacity = 0;
        arrowBorder.style.opacity = 0;
        return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
        tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem) {
        return bodyItem.lines;
    }

    // Set Text
    if (tooltipModel.body) {
        const titleLines = tooltipModel.title || [];
        const bodyLines = tooltipModel.body.map(getBody);

        let innerHtml = '<thead>';

        titleLines.forEach((title) => {
            innerHtml += `<tr><th> ${title} </th></tr>`;
        });
        innerHtml += '</thead><tbody>';

        bodyLines.forEach((body, i) => {
            const colors = tooltipModel.labelColors[i];
            let style = `background: ${colors.backgroundColor}`;
            style += `; border-color: ${colors.borderColor}`;
            style += '; border-width: 2px';
            const span = `<span style=" ${style} "></span>`;
            body = body[0].split(':');
            const number = parseInt(body[1]).toLocaleString();
            innerHtml += `<tr><td> ${span} ${body[0]}: ${number} </td></tr>`;
        });
        innerHtml += '</tbody>';

        const tableRoot = tooltipEl.querySelector('table');
        tableRoot.innerHTML = innerHtml;
    }

    // `this` will be the overall tooltip
    let position = this._chart.canvas.getBoundingClientRect();
    let xAxisHeight = this._chart.scales['x-axis-0'].height;
    let maxTooltipLeft = position.left + window.pageXOffset + position.width - tooltipEl.offsetWidth/2 + 10;
    let minTooltipLeft = position.left + tooltipEl.offsetWidth/2 - 10;
    let tooltipLeft = position.left + window.pageXOffset + tooltipModel.caretX;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    arrow.style.opacity = 1;
    arrowBorder.style.opacity = 1;
    tooltipEl.style.left = `${Math.max(minTooltipLeft, Math.min(maxTooltipLeft, tooltipLeft)) - tooltipEl.offsetWidth/2}px`;
    arrow.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    arrowBorder.style.left = arrow.style.left;
    arrow.style.top = (position.y + window.pageYOffset + position.height - xAxisHeight - 5) + 'px';
    arrowBorder.style.top = (position.y + window.pageYOffset + position.height - xAxisHeight - 8) + 'px';
    tooltipEl.style.top = position.y + window.pageYOffset + position.height - xAxisHeight + 13 + 'px';
    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
}

const chartOptions = () => {
    return {
        maintainAspectRatio: false,
        tooltips: {
            mode: 'index',
            intersect: false,
            enabled: false,
            custom: customTooltip
        },
        hover: {
            mode: 'index',
            intersect: false
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
                ticks: {
                    padding: 15
                }
            }]
        }
    };
}

export default function CumulativeGraph(){
    const [whoCsv, setWhoCsv] = useState(null);
    const [data, setData] = useState(null);
    const [globalData, setGlobalData] = useState(null);
    const casesChartRef = useRef(null);
    const deathsChartRef = useRef(null);

    const {country, countryClicked} = useContext(ModeContext);

    useEffect(() => {
        const fetchData = async () => {
            let whoData = await fetch('https://ClassicImpureProperties.eintorwdo.repl.co');
            whoData = await whoData.text();
            whoData = Papa.parse(whoData);
            const graphData = reduce(whoData.data);
            setWhoCsv(whoData);
            setData(graphData);
            setGlobalData(graphData);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if(country && countryClicked && whoCsv){
            const graphData = reduce(whoCsv.data, country);
            setData(graphData);
        }
        else if(!countryClicked && whoCsv){
            setData(globalData);
        }
    }, [countryClicked]);

    useEffect(() => {
        if(country && countryClicked && whoCsv){
            const graphData = reduce(whoCsv.data, country);
            setData(graphData);
        }
    }, [country]);

    useEffect(() => {
        const casesWrapper = document.querySelector('#cases-chart');
        const deathsWrapper = document.querySelector('#deaths-chart');
        if(data && casesWrapper && deathsWrapper){
            if(!casesChartRef.current && !deathsChartRef.current){
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
            else{
                casesChartRef.current.data = getChartData(data, 'cases');
                deathsChartRef.current.data = getChartData(data, 'deaths');
                casesChartRef.current.update();
                deathsChartRef.current.update();
            }
        }
    }, [data]);

    return(
        <>
        <div className={style['chart-wrapper']} id="chart-wrapper">
            <h1 className="header">New cases per day</h1>
            {data
                ? <canvas id="cases-chart" className={style.chart}></canvas>
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
                ? <canvas id="deaths-chart" className={style.chart}></canvas>
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