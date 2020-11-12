import React, { useEffect, useRef, useState, useContext } from 'react';
import style from './style.module.css';
import Legend from '../Legend/Legend';
import {ModeContext} from '../../providers/providers';
import {getColor} from '../../common/common';
import ClipLoader from "react-spinners/ClipLoader";

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
        const labelsWrapper = document.querySelector('#labels-covid-wrapper');
        if(!elementMouseIsOver == countryInfo || !labelsWrapper?.contains(elementMouseIsOver)){
            setCountry(null);
        }
    }
}

const fetchCovidData = async () => {
    const res = await fetch('https://api.covid19api.com/summary');
    const json = await res.json();
    return json;
}

const findCountry = (covidData, feature) => {
    const country = covidData?.Countries.find(el => {
        const name = el.Country;  
        return name.includes(feature.properties.name) ||
                name.includes(feature.properties.formal_en) ||
                el.CountryCode == feature.properties.iso_a2;
    });
    return country;
}

const setLayerStyle = (layer, country, mode) => {
    if(country){
        layer.setStyle({fillColor: getColor(country, mode)});
    }
    else{
        layer.setStyle({fillColor: 'white'});
    }
}

const onEachFeature = (covidData, setCountry, mode) => {
    return (feature, layer) => {
        const country = findCountry(covidData, feature);
        setLayerStyle(layer, country, mode);

        layer.on({
            mouseover: mouseOver(setCountry, {covid: country, feature: feature.properties}),
            mouseout: mouseOut(setCountry)
        });
    }
}

export default function InnerMap(){
    const [covidData, setCovidData] = useState(null);
    const [geoData, setGeoData] = useState(null);
    const mapRef = useRef(null);
    const geoJsonRef = useRef(null);
    const mapLabelsRef = useRef(null);

    const {mode, country, setCountry} = useContext(ModeContext);

    useEffect(() => {
        const fetchData = async () => {
            const geo = await import('../../custom.geo.json');
            const res = await fetchCovidData();
            setCovidData(res);
            setGeoData(geo.default);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const selector = `.${style['map-container']}`;
        const el = document.querySelector(selector);

        if(el && !mapRef.current){
            mapRef.current = L.map(el, {minZoom: 2, scrollWheelZoom: false}).setView([51.505, -0.09], 2);
            // mapRef.current.setMaxBounds(mapRef.current.getBounds());
            mapRef.current.createPane('labels');
            mapRef.current.getPane('labels').style.zIndex = 650;

            mapLabelsRef.current = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | COVID-19 data by <a href="https://covid19api.com/">COVID-19 API</a>',
                subdomains: 'abcd',
                minZoom: 0,
                maxZoom: 20,
                bounds: [[-90, -180],[90, 180]],
                noWrap: true,
                ext: 'png',
                pane: 'labels'
            });
        }
    });

    useEffect(() => {
        if(!geoJsonRef.current && mapRef.current && geoData && covidData){
            mapLabelsRef.current.addTo(mapRef.current);

            geoJsonRef.current = L.geoJSON(geoData, {
                style: mapStyle,
                onEachFeature: onEachFeature(covidData, setCountry, mode)
            }).addTo(mapRef.current);
        }
    }, [covidData, geoData]);

    useEffect(() => {
        geoJsonRef.current?.eachLayer((layer) => {
            const country = findCountry(covidData, layer.feature);
            setLayerStyle(layer, country, mode);
        });
    }, [mode]);

    return(
        <>
        <div className={style['map-container']} style={{position: 'relative'}}>
            {covidData
                ? ''
                : <div className={style['spinner-wrapper']}>
                    <ClipLoader 
                        size={130}
                        color={"#123abc"}
                        loading={true}
                    />
                </div>
            }
            <Legend country={country}/>
        </div>
        </>
    );
}