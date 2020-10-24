import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import geoDataJson from '../../custom.geo.json';
import Legend from '../Legend/Legend';

import {getColor} from '../../common/common';

const mapStyle = () => {
    return {
        weight: 2,
        opacity: 1,
        color: 'black',
        fillColor: 'white',
        fillOpacity: 0.85
    };
}

const thickenBorder = (setCountry, country) => {
    return (e) => {
        e.target.setStyle({
            weight: 5
        });
        setCountry(country);
    }
}

const mouseOut = (setCountry) => {
    return (e) => {
        const stl = mapStyle();
        delete stl.fillColor;
        e.target.setStyle(stl);
        setCountry(null);
    }
}

const fetchCovidData = async () => {
    const json = await fetch('https://api.covid19api.com/summary');
    return json;
}

const onEachFeature = (covidData, setCountry) => {
    return (feature, layer) => {

        const country = covidData.Countries.find(el => {
            const name = el.Country;  
            return name.includes(feature.properties.name) ||
                    name.includes(feature.properties.formal_en) ||
                    el.CountryCode == feature.properties.iso_a2;
        });

        if(country){
            const newCases = country.NewConfirmed;
            layer.setStyle({fillColor: getColor(newCases)});
        }

        layer.on({
            mouseover: thickenBorder(setCountry, {covid: country, feature: feature.properties}),
            mouseout: mouseOut(setCountry)
        });
    }
}

export default function Main(){
    const [covidData, setCovidData] = useState(null);
    const [country, setCountry] = useState(null);
    const mapRef = useRef(null);

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

        if(el && !mapRef.current){
            mapRef.current = L.map(el, {minZoom: 2}).setView([51.505, -0.09], 2);
            // mapRef.current.setMaxBounds(mapRef.current.getBounds());
            mapRef.current.createPane('labels');
            mapRef.current.getPane('labels').style.zIndex = 650;

            L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                subdomains: 'abcd',
                minZoom: 0,
                maxZoom: 20,
                bounds: [[-90, -180],[90, 180]],
                noWrap: true,
                ext: 'png',
                pane: 'labels'
            }).addTo(mapRef.current);
        }
    });

    useEffect(() => {
        if(geoDataJson && covidData && mapRef.current){
            L.geoJSON(geoDataJson, {
                style: mapStyle,
                onEachFeature: onEachFeature(covidData, setCountry)
            }).addTo(mapRef.current);
        }
    }, [covidData]);

    return(
        <div className={style['map-container']} style={{position: 'relative'}}>
            <Legend country={country}/>
        </div>
    );
}