import React from 'react';
import Tab from './tab';

export default class Tabs extends React.Component {

    handleTabClick(tab) {
        console.log('tab clicked', tab);
    }

    render() {
        return (
            <div className="tabs">
                <Tab name={'Requests'} onClick={ () => this.handleTabClick('requests') } />
                <Tab name={'Lists'} onClick={ () => this.handleTabClick('lists') } />
            </div>
        );
    }
}
