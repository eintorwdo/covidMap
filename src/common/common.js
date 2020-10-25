export const getColor = (country, mode) => {
    let color;
    if(mode == 'cases'){
        let numOfCases = country.NewConfirmed;
        if(numOfCases == 0) color = '#ffffff';
        else if(numOfCases < 100) color = '#ffbfbf';
        else if(numOfCases < 500) color = '#ff9999';
        else if(numOfCases < 1200) color = '#ff8080';
        else if(numOfCases < 4000) color = '#ff4a4a';
        else color = '#ff0000';
    }
    else if(mode == 'deaths'){
        let numOfCases = country.NewDeaths;
        if(numOfCases == 0) color = '#ffffff';
        else if(numOfCases < 50) color = '#ffbfbf';
        else if(numOfCases < 100) color = '#ff9999';
        else if(numOfCases < 200) color = '#ff8080';
        else if(numOfCases < 500) color = '#ff4a4a';
        else color = '#ff0000';
    }
    return color;
}