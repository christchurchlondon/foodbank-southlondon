import React from 'react';
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch
} from 'react-router-dom';
import Header from '../header';
import Requests from '../requests';
import Lists from '../lists';
import './styles/index.scss';


export default function Main() {
    return (
        <Router>
            <main className="main">
                <Header />
                <div className="contents">
                    <Switch>
                        <Route path="/clients" component={ Requests } />
                        <Route path="/lists" component={ Lists } />
                    </Switch>
                </div>
            </main>
            <Redirect from="/" to="/clients" />
        </Router>
    );
}
