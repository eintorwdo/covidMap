import React, {useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './global.css';

import Map from './components/Map/Map';
import CumulativeGraph from './components/CumulativeGraph/CumulativeGraph';
import Navbar from './components/Navbar/Navbar';

export default function App(){
    const[sticky, setSticky] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const body = document.querySelector('body');
            if(body.scrollTop > 55){
                setSticky(true);
            }
            else{
                setSticky(false);
            }
        }, {passive: true});
    }, []);

    return(
        <Router>
            <div className="main-wrapper">
                <Switch>
                    <Route path="/">
                        <Navbar sticky={sticky}/>
                        <Map />
                        <CumulativeGraph />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}