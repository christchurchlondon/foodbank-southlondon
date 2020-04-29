import React from 'react';
import { connect } from 'react-redux';
import Tabs from './tabs';
import { setTab } from '../../redux/actions';

class Header extends React.Component {

    handleTabSelect(tab) {
        this.props.setTab(tab);
    }

    render() {
        return (
            <header>
                <h1>Foodbank - South London</h1>
                <Tabs onSelect={ (tab) => this.handleTabSelect(tab) } />
            </header>
        );
    };
}

export default connect(
    null,
    { setTab }
)(Header)
