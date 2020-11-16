import React from 'react';

export const ModeContext = React.createContext({
    mode: 'cases',
    country: null,
    countryClicked: false
});