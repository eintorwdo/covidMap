import React, { useState } from 'react';
import {ModeContext} from '../../providers/providers';
import InnerMap from './InnerMap';

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
            <InnerMap />
        </ModeContext.Provider>
    );
}