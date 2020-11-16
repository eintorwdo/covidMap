import React, {useState} from 'react';
import App from './App';
import {ModeContext} from './providers/providers';

export default function ProviderWrapper(){
    const [mode, setMode] = useState('cases');
    const [country, setCountry] = useState(null);
    const [map, setMap] = useState(null);
    const [countryClicked, setCountryClicked] = useState(false);

    return(
        <ModeContext.Provider value={{
            mode,
            setMode,
            country,
            setCountry,
            map,
            setMap,
            countryClicked,
            setCountryClicked
        }}>
            <App />
        </ModeContext.Provider>
    );
}