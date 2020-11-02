import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Map from './components/Map/Map';
import CumulativeGraph from './components/CumulativeGraph/CumulativeGraph';

export default function App(){
    return(
        <Router>
            <div>
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