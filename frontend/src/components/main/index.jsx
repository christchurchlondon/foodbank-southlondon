import React from 'react';
import { withRouter } from 'react-router';
import {
    HashRouter as Router,
    Redirect,
    Route,
    Switch
} from 'react-router-dom';
import Header from '../header';
import Footer from '../footer';
import Requests from '../requests';
import Lists from '../lists';
import Calendar from '../calendar';
import './styles/index.scss';


export default function Main() {
    return (
        <Router>
            <main className="main">
                <Header />
                <ContentsWithRouter />
                <Footer />
            </main>
            <Redirect from="/#" to="/clients" />
        </Router>
    );
}

function Contents(props) {
    const wide = props.location.pathname.toLowerCase() === '/lists';
    return (
        <section className={'contents' + (wide ? ' large' : '')}>
            <Switch>
                <Route path="/clients" component={ Requests } />
                <Route path="/lists" component={ Lists } />
                <Route path="/calendar" component={ Calendar } />
            </Switch>
        </section>
    );
}

const ContentsWithRouter = withRouter(Contents);
