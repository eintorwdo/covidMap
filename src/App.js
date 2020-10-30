import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Map from './components/Map/Map';

export default function App(){
    return(
        <Router>
            <div>
                <Switch>
                    <Route path="/">
                        <Map />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}