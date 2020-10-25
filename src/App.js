import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Map from './components/Main/Main';

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