import React, {useState, useContext, useEffect, useRef} from 'react';
import {ModeContext} from '../../providers/providers';
import style from './style.module.css';

export default function Navbar(props){
    const {country, countryClicked, countryNames, geoJson} = useContext(ModeContext);
    const [countryName, setCountryName] = useState(null);
    const [dataList, setDataList] = useState(null);
    const inputRef = useRef(null);
    const dataListRef = useRef(null);

    const onClick = (e) => {
        inputRef.current.value = e.target.textContent
        const form = document.querySelector('form');
        form.dispatchEvent(new Event('submit'));
        inputRef.current.blur();
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const data = inputRef.current.value;
        inputRef.current.value = '';
        setDataList([]);
        geoJson.eachLayer((layer) => {
            if(layer.feature.properties.name.toLowerCase() == data.toLowerCase()){
                layer.fire('click');
            }
        });
    }

    const onFocus = () => {
        dataListRef.current.classList.add(style.visible);
    }

    const onBlur = () => {
        dataListRef.current.classList.remove(style.visible);
    }

    const onInputChange = (e) => {
        if(e.target.value.length > 0){
            const hints = [];

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
                    
                    <form onSubmit={onSubmit} style={{position: 'relative'}}>
                        <input ref={inputRef} className={style['input-search']} autoComplete="off" type="search" name="country" placeholder="Search by country"
                            onChange={onInputChange} onFocus={onFocus} onBlur={onBlur}/>
                        <ul ref={dataListRef} className={style['data-list']}
                            style={{top: inputRef.current?.offsetHeight, maxHeight: `calc(100vh - ${dataListRef.current?.getBoundingClientRect().top}px)`}}>
                            {dataList?.map((el, i) => {
                                return <li key={i} onMouseDown={(e) => e.preventDefault()} onClick={onClick}>{el}</li>
                            })}
                        </ul>
                    </form>
                    
                    {countryName}
                    {/* <a href="#chart-wrapper" className={`${style['button-link']}`}>
                        <div className={`${style['graphs-button']}`}>
                            <i className="far fa-chart-bar"></i>
                            <h2 className="header">
                                Graphs
                            </h2>
                        </div>
                    </a> */}
                </div>
            </div>
        </>
    );
}