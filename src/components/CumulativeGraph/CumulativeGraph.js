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
            hoverBackgroundColor: mode === 'deaths'
                ? "rgba(255,99,132,1)"
                : "rgba(3,165,252,1)",
            data: data.map(el => {
                if(mode === 'cases') return el.newCases;
                else if(mode === 'deaths') return el.newDeaths;
            }),
            barPercentage: 1.0,
            categoryPercentage: 1.0
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
        var titleLines = tooltipModel.title || [];
        var bodyLines = tooltipModel.body.map(getBody);

        var innerHtml = '<thead>';

        titleLines.forEach(function(title) {
            innerHtml += '<tr><th>' + title + '</th></tr>';
        });
        innerHtml += '</thead><tbody>';

        bodyLines.forEach(function(body, i) {
            var colors = tooltipModel.labelColors[i];
            var style = 'background:' + colors.backgroundColor;
            style += '; border-color:' + colors.borderColor;
            style += '; border-width: 2px';
            var span = '<span style="' + style + '"></span>';
            innerHtml += '<tr><td>' + span + body + '</td></tr>';
        });
        innerHtml += '</tbody>';

        var tableRoot = tooltipEl.querySelector('table');
        tableRoot.innerHTML = innerHtml;
    }

    // `this` will be the overall tooltip
    let position = this._chart.canvas.getBoundingClientRect();
    let xAxisHeight = this._chart.scales['x-axis-0'].height;
    let maxTooltipLeft = position.left + window.pageXOffset + position.width - tooltipEl.offsetWidth/2 + 10;
    let tooltipLeft = position.left + window.pageXOffset + tooltipModel.caretX;
    console.log(maxTooltipLeft, tooltipLeft)

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    arrow.style.opacity = 1;
    arrowBorder.style.opacity = 1;
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = `${Math.min(maxTooltipLeft, tooltipLeft) - tooltipEl.offsetWidth/2}px`;
    arrow.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    arrow.style.top = position.y + window.pageYOffset + position.height - xAxisHeight - 7 + 'px';
    arrowBorder.style.left = arrow.style.left;
    arrowBorder.style.top = arrow.style.top;
    // tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    tooltipEl.style.top = position.y + window.pageYOffset + position.height - xAxisHeight + 13 + 'px';
    tooltipEl.style.fontFamily = 'Montserrat';
    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
}

const chartOptions = () => {
    return {
        maintainAspectRatio: false,
        tooltips: {
            enabled: false,
            custom: customTooltip
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