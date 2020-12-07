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
            const labelsWrapper = document.querySelector('#labels-covid-wrapper');
            if(!labelsWrapper.contains(e.originalEvent.toElement)){
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
    return (e) => {
        const togglePanel = document.querySelector('#toggle-panel');
        const labels = document.querySelector('#labels-covid-wrapper');
        if(!e.originalEvent.path.find(el => el == togglePanel || el == labels)){
            setCountryClicked(false);
            setCountry(null);
            if(clickedLayerRef.current){
                clickedLayerRef.current.setStyle({weight: 2});
                clickedLayerRef.current = null;
            }
        }
    }
}

const fetchCovidData = async () => {
    const res = await fetch('https://api.covid19api.com/summary');
    const json = await res.json();
    return json;
}

const findCountry = (covidData, feature) => {
    const country = covidData?.Countries?.find(el => {
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

function onEachFeature(covidData, countryClickedRef, clickedLayerRef){
    return async (feature, layer) => {
        const country = {
            covid: findCountry(covidData, feature),
            feature: feature.properties
        };
        setLayerStyle(layer, country.covid, this.mode);

        layer.on({
            mouseover: mouseOver(this.setCountry, country, countryClickedRef),
            mouseout: mouseOut(this.setCountry, countryClickedRef),
            click: click(this.setCountry, country, layer, clickedLayerRef, this.setCountryClicked)
        });
    }
}

export default function Map(){
    const context = useContext(ModeContext);

    const [covidData, setCovidData] = useState(null);
    const [geoData, setGeoData] = useState(null);
    const [geoJson, setGeoJson] = useState(null);
    const countryClickedRef = useRef(context.countryClicked);
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

        if(el && !context.map){
            const _map = L.map(el, {minZoom: 2, scrollWheelZoom: false}).setView([51.505, -0.09], 2)
                .on('click', onMapClick(context.setCountryClicked, context.setCountry, clickedLayerRef));
            // _map.setMaxBounds(mapRef.current.getBounds());
            _map.createPane('labels');
            _map.getPane('labels').style.zIndex = 650;

            context.setMap(_map);
        }
    });

    useEffect(() => {
        if(!geoJson && context.map && geoData && covidData){
            const _map = context.map;

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
                onEachFeature: onEachFeature.call(context, covidData, countryClickedRef, clickedLayerRef)
            }).addTo(_map);

            const names = [];
            _geoJson.eachLayer((layer) => {
                names.push(layer.feature.properties.name);
            });

            context.setCountryNames(names);
            context.setMap(_map);
            setGeoJson(_geoJson);
        }
    }, [covidData, geoData]);

    useEffect(() => {
        if(geoJson){
            const _geoJson = geoJson;
            _geoJson.eachLayer((layer) => {
                const country = findCountry(covidData, layer.feature);
                setLayerStyle(layer, country, context.mode);
            });

            setGeoJson(_geoJson);
        }
    }, [context.mode]);

    useEffect(() => {
        countryClickedRef.current = context.countryClicked;
    }, [context.countryClicked]);

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