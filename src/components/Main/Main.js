import React, { useEffect, useLayoutEffect, useState } from 'react';
import style from './style.module.css';
import geoDataJson from '../../custom.geo.json';


const mapStyle = () => {
    return {
        weight: 2,
        opacity: 1,
        color: 'black',
        fillColor: 'white',
        fillOpacity: 0.85
    };
}

const thickenBorder = (e) => {
    e.target.setStyle({
        weight: 5
    });
}

const mouseOut = (e) => {
    const stl = mapStyle();
    delete stl.fillColor;
    e.target.setStyle(stl);
}

const fetchCovidData = async () => {
    const json = await fetch('https://api.covid19api.com/summary');
    return json;
}

const getColor = (numOfCases) => {
    let color;
    if(numOfCases == 0) color = '#ffffff';
    else if(numOfCases < 100) color = '#ffbfbf';
    else if(numOfCases < 500) color = '#ff9999';
    else if(numOfCases < 1200) color = '#ff8080';
    else if(numOfCases < 4000) color = '#ff4a4a';
    else color = '#ff0000';
    return color;
}

const onEachFeature = (covidData) => {
    return (feature, layer) => {
        layer.on({
            mouseover: thickenBorder,
            mouseout: mouseOut
        });
        const countryData = covidData.Countries.find(el => {
            const name = el.Country;
            return name.includes(feature.properties.name) ||
                    name.includes(feature.properties.formal_en);
        });

        if(countryData){
            console.log(countryData)
            const newCases = countryData.NewConfirmed;
            layer.setStyle({fillColor: getColor(newCases)});
        }
    }
}

export default function Main(){
    const [geoData, setGeoData] = useState(geoDataJson);
    const [covidData, setCovidData] = useState(null);

    if(!covidData){
        (async () => {
                const res = await fetchCovidData();
                const data = await res.json();
                setCovidData(data);
            }
        )();
    }

    useEffect(() => {
        const selector = `.${style['map-container']}`;
        const el = document.querySelector(selector);
        let map;
        if(el){
            map = L.map(el).setView([51.505, -0.09], 2);
            let bounds = map.getBounds();

            map.setMaxBounds(bounds);

            L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.MAPBOX_TOKEN}`, {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                minZoom: 2,
                maxZoom: 18,
                id: 'mapbox/outdoors-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'your.mapbox.access.token',
                noWrap: true,
                bounds: [
                    [-90, -180],
                    [90, 180]
                ]
            }).addTo(map);
        }

        if(geoData && covidData){
            L.geoJSON(geoData, {
                style: mapStyle,
                onEachFeature: onEachFeature(covidData)
            }).addTo(map);
        }
    }, [covidData]);

    return covidData ? <div className={style['map-container']}></div> : '';
}