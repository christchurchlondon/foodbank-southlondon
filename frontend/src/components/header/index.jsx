import React from 'react';
import { connect } from 'react-redux';
import Tabs from './tabs';
import { setTab } from '../../redux/actions';
import { getTab } from '../../redux/selectors';
import './styles/index.css';

class Header extends React.Component {

    // TODO remove state management from here?

    handleTabSelect(tab) {
        this.props.setTab(tab);
    }

    render() {
        return (
            <header className="header">
                <h1>Foodbank - South London</h1>
                <Tabs onSelect={ (tab) => this.handleTabSelect(tab) } selected={ this.props.tab } />
            </header>
        );
    };
}

const mapStateToProps = state => {
    const tab = getTab(state);
    return { tab };
}

export default connect(
    mapStateToProps,
    { setTab }
)(Header);
