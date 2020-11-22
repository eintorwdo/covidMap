export const getColor = (country, mode) => {
    let color;
    if(mode == 'cases'){
        let numOfCases = country.NewConfirmed;
        if(numOfCases == 0) color = '#ffffff';
        else if(numOfCases < 100) color = '#ffdbdb';
        else if(numOfCases < 1000) color = '#ff9999';
        else if(numOfCases < 3000) color = '#ff8080';
        else if(numOfCases < 10000) color = '#ff5e5e';
        else color = '#ff0000';
    }
    else if(mode == 'deaths'){
        let numOfCases = country.NewDeaths;
        if(numOfCases == 0) color = '#ffffff';
        else if(numOfCases < 50) color = '#c4eaff';
        else if(numOfCases < 100) color = '#9cdcff';
        else if(numOfCases < 200) color = '#75cfff';
        else if(numOfCases < 500) color = '#4ac0ff';
        else color = '#03a5fc';
    }
    return color;
}