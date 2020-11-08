import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './global.css';

import Map from './components/Map/Map';
import CumulativeGraph from './components/CumulativeGraph/CumulativeGraph';

export default function App(){
    return(
        <Router>
            <div className="main-wrapper">
                <Switch>
                    <Route path="/">
                        <Map />
                        <CumulativeGraph />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}