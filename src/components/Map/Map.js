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

const mouseOver = (setCountry, country, countryClickedRef) => {
    return (e) => {
        if(!countryClickedRef.current){
            e.target.setStyle({
                weight: 5
            });

            setCountry(country);
        }
    }
}

const mouseOut = (setCountry, countryClickedRef) => {
    return (e) => {
        if(!countryClickedRef.current){
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
}

const click = (setCountry, country, layer, clickedLayerRef, setCountryClicked) => {
    return (e) => {
        if(clickedLayerRef.current){
            clickedLayerRef.current.setStyle({weight: 2})
        }
        clickedLayerRef.current = layer;

        e.target.setStyle({
            weight: 5
        });
        setCountry(country);
        setCountryClicked(true);
        L.DomEvent.stopPropagation(e);
    }
}

const onMapClick = (setCountryClicked, setCountry, clickedLayerRef) => {
    return () => {
        setCountryClicked(false);
        setCountry(null);
        if(clickedLayerRef.current){
            clickedLayerRef.current.setStyle({weight: 2});
            clickedLayerRef.current = null;
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

const onEachFeature = (covidData, setCountry, mode, countryClickedRef, clickedLayerRef, setCountryClicked) => {
    return (feature, layer) => {
        const country = {
            covid: findCountry(covidData, feature),
            feature: feature.properties
        };
        setLayerStyle(layer, country.covid, mode);

        layer.on({
            mouseover: mouseOver(setCountry, country, countryClickedRef),
            mouseout: mouseOut(setCountry, countryClickedRef),
            click: click(setCountry, country, layer, clickedLayerRef, setCountryClicked)
        });
    }
}

export default function Map(){
    const {mode, setCountry, map, setMap, countryClicked, setCountryClicked} = useContext(ModeContext);

    const [covidData, setCovidData] = useState(null);
    const [geoData, setGeoData] = useState(null);
    const [geoJson, setGeoJson] = useState(null);
    const countryClickedRef = useRef(countryClicked);
    const clickedLayerRef = useRef(null);

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

        if(el && !map){
            const _map = L.map(el, {minZoom: 2, scrollWheelZoom: false}).setView([51.505, -0.09], 2)
                .on('click', onMapClick(setCountryClicked, setCountry, clickedLayerRef));
            // _map.setMaxBounds(mapRef.current.getBounds());
            _map.createPane('labels');
            _map.getPane('labels').style.zIndex = 650;

            setMap(_map);
        }
    });

    useEffect(() => {
        if(!geoJson && map && geoData && covidData){
            const _map = map;

            const mapLabels = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | COVID-19 data by <a href="https://covid19api.com/">COVID-19 API</a>',
                subdomains: 'abcd',
                minZoom: 0,
                maxZoom: 20,
                bounds: [[-90, -180],[90, 180]],
                noWrap: true,
                ext: 'png',
                pane: 'labels'
            });
            mapLabels.addTo(_map);

            const _geoJson = L.geoJSON(geoData, {
                style: mapStyle,
                onEachFeature: onEachFeature(covidData, setCountry, mode, countryClickedRef, clickedLayerRef, setCountryClicked)
            }).addTo(_map);

            setMap(_map);
            setGeoJson(_geoJson);
        }
    }, [covidData, geoData]);

    useEffect(() => {
        if(geoJson){
            const _geoJson = geoJson;
            _geoJson.eachLayer((layer) => {
                const country = findCountry(covidData, layer.feature);
                setLayerStyle(layer, country, mode);
            });

            setGeoJson(_geoJson);
        }
    }, [mode]);

    useEffect(() => {
        countryClickedRef.current = countryClicked;
    }, [countryClicked]);

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
            <Legend />
        </div>
        </>
    );
}