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
            const newCases = countryData.NewConfirmed;
            layer.setStyle({fillColor: getColor(newCases)});
        }
    }
}

export default function Main(){
    const [geoData, setGeoData] = useState(geoDataJson);
    const [covidData, setCovidData] = useState(null);
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
            mapRef.current = L.map(el).setView([51.505, -0.09], 2);
            let bounds = mapRef.current.getBounds();

            mapRef.current.setMaxBounds(bounds);

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
            }).addTo(mapRef.current);
        }
    });

    useEffect(() => {
        if(geoData && covidData && mapRef.current){
            L.geoJSON(geoData, {
                style: mapStyle,
                onEachFeature: onEachFeature(covidData)
            }).addTo(mapRef.current);
        }
    }, [covidData, geoData]);

    return(
        <div className={style['map-container']} style={{position: 'relative'}}>
            <Legend />
        </div>
    );
}