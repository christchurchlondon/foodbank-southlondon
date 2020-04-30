import React from 'react';
import Tab from './tab';

export default class Tabs extends React.Component {

    handleTabClick(tab) {
        this.props.onSelect(tab);
    }

    isSelectedTab(tab) {
        return this.props.selected === tab;
    }

    render() {
        return (
            <div className="tabs">
                <Tab name={'Requests'} onClick={ () => this.handleTabClick('requests') } isSelected={this.isSelectedTab('requests')} />
                <Tab name={'Lists'} onClick={ () => this.handleTabClick('lists') } isSelected={this.isSelectedTab('lists')} />
            </div>
        );
    }
}
