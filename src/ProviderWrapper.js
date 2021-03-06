import React, {useState} from 'react';
import App from './App';
import {ModeContext} from './providers/providers';

export default function ProviderWrapper(){
    const [mode, setMode] = useState('cases');
    const [country, setCountry] = useState(null);
    const [map, setMap] = useState(null);
    const [countryClicked, setCountryClicked] = useState(false);
    const [countryNames, setCountryNames] = useState([]);
    const [geoJson, setGeoJson] = useState(null);

    return(
        <ModeContext.Provider value={{
            mode,
            setMode,
            country,
            setCountry,
            map,
            setMap,
            countryClicked,
            setCountryClicked,
            countryNames,
            setCountryNames,
            geoJson,
            setGeoJson
        }}>
            <App />
        </ModeContext.Provider>
    );
}