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

export const csv2json = (csv) => {
    const lines=csv.split("\n");
    const result = [];

    const headers=lines[0].split(",");

    for(let i=1; i < lines.length; i++){

        const obj = {};
        const currentline = lines[i].split(",");

        for(let j=0; j < headers.length; j++){
            obj[`${headers[j].trim()}`] = currentline[j];
        }

        result.push(obj);
    }

    return result;
}