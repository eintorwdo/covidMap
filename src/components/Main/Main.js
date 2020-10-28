import React, { useEffect, useRef, useState, useContext } from 'react';
import style from './style.module.css';
// import geoData from '../../custom.geo.json';
import Legend from '../Legend/Legend';
import {ModeContext} from '../../providers/providers';
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

const mouseOver = (setCountry, country) => {
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
        let x = e.originalEvent.clientX;
        let y = e.originalEvent.clientY;
        const elementMouseIsOver = document.elementFromPoint(x, y);
        const countryInfo = document.querySelector('#country-hover-popup');
        if(!elementMouseIsOver !== countryInfo && !countryInfo?.contains(elementMouseIsOver)){
            setCountry(null);
        }
    }
}

const fetchCovidData = async () => {
    const json = await fetch('https://api.covid19api.com/summary');
    return json;
}

const onEachFeature = (covidData, setCountry, mode) => {
    return (feature, layer) => {
        const country = covidData?.Countries.find(el => {
            const name = el.Country;  
            return name.includes(feature.properties.name) ||
                    name.includes(feature.properties.formal_en) ||
                    el.CountryCode == feature.properties.iso_a2;
        });

        if(country){
            layer.setStyle({fillColor: getColor(country, mode)});
        }

        layer.on({
            mouseover: mouseOver(setCountry, {covid: country, feature: feature.properties}),
            mouseout: mouseOut(setCountry)
        });
    }
}

function Main(){
    const [covidData, setCovidData] = useState(null);
    // const [country, setCountry] = useState(null);
    const [geoData, setGeoData] = useState(null);
    const mapRef = useRef(null);
    const geoJsonRef = useRef(null);

    const {mode, country, setCountry} = useContext(ModeContext);

    useEffect(async() => {
        const geo = await import('../../custom.geo.json');
        const res = await fetchCovidData();
        const covid = await res.json();
        setCovidData(covid);
        setGeoData(geo.default);
    }, []);

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
        if(geoData && mapRef.current && !geoJsonRef.current && covidData){
            geoJsonRef.current = L.geoJSON(geoData, {
                style: mapStyle,
                onEachFeature: onEachFeature(covidData, setCountry, mode)
            }).addTo(mapRef.current);
        }
    }, [covidData, geoData]);

    useEffect(() => {
        geoJsonRef.current?.eachLayer((layer) => {
            const country = covidData?.Countries.find(el => {
                const name = el.Country;  
                return name.includes(layer.feature.properties.name) ||
                        name.includes(layer.feature.properties.formal_en) ||
                        el.CountryCode == layer.feature.properties.iso_a2;
            });
            if(country){
                layer.setStyle({fillColor: getColor(country, mode)});
            }
            else{
                layer.setStyle({fillColor: 'white'});
            }
        });
    }, [mode]);

    return(
        <>
        <h1 className={style.header}>COVID-19 dashboard</h1>
        <div className={style['map-container']} style={{position: 'relative'}}>
            <Legend country={country}/>
        </div>
        </>
    );
}

export default function Map(){
    const [mode, setMode] = useState('cases');
    const [country, setCountry] = useState(null);

    return(
        <ModeContext.Provider value={{
            mode,
            setMode,
            country,
            setCountry
        }}>
            <Main />
        </ModeContext.Provider>
    );
}