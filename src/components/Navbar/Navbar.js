import React, {useState, useContext, useEffect, useRef} from 'react';
import {ModeContext} from '../../providers/providers';
import style from './style.module.css';

export default function Navbar(props){
    const {country, countryClicked, countryNames} = useContext(ModeContext);
    const [countryName, setCountryName] = useState(null);
    const [dataList, setDataList] = useState(null);
    const dataListRef = useRef(null);

    const onImputChange = (e) => {
        if(e.target.value.length > 0){
            const hints = [];
            let options;

            for(let el of countryNames){
                if(el.toLowerCase().startsWith(e.target.value.toLowerCase())){
                    hints.push(el);
                }
            }

            setDataList(hints);
        }
        else{
            setDataList([]);
        }
    }

    useEffect(() => {
        console.log(dataList)
    }, [dataList])

    useEffect(() => {
        let div;
        if(country && countryClicked){
            div = 
            <div>
                <h2 className={`header ${style['name-wrapper']}`}>
                    <img src={`https://www.countryflags.io/${country.feature.iso_a2}/shiny/64.png`}/>
                    {country?.feature?.formal_en}
                </h2>
            </div>
        }
        else{
            div =
            <div>
                <h2 className="header" style={{lineHeight: '2em'}}>Global</h2>
            </div> 
        }

        setCountryName(div);
    }, [country, countryClicked]);

    return(
        <>
            <div className={`${style.navbar} ${props.sticky ? style.sticky : ''}`}>
                <h1 className="header">COVID-19 dashboard</h1>
                <div className={style['navbar-bottom']}>
                    <input className={style['input-search']} autoComplete="off" type="text" name="country" list="dataList" placeholder="Search by country" onChange={onImputChange}/>
                    <datalist id="dataList">
                        {dataList?.map((el, i) => {
                            return <option key={i} value={el}></option>
                        })}
                    </datalist>
                    {countryName}
                    <a href="#chart-wrapper" className={`${style['button-link']}`}>
                        <div className={`${style['graphs-button']}`}>
                            <i className="far fa-chart-bar"></i>
                            <h2 className="header">
                                Graphs
                            </h2>
                        </div>
                    </a>
                </div>
            </div>
        </>
    );
}