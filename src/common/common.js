export const getColor = (numOfCases) => {
    let color;
    if(numOfCases == 0) color = '#ffffff';
    else if(numOfCases < 100) color = '#ffbfbf';
    else if(numOfCases < 500) color = '#ff9999';
    else if(numOfCases < 1200) color = '#ff8080';
    else if(numOfCases < 4000) color = '#ff4a4a';
    else color = '#ff0000';
    return color;
}