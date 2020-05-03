import React from 'react';
import { TAB_REQUESTS, TAB_LISTS } from '../../constants';
import Tab from './tab';
import './styles/tabs.css';

export default class Tabs extends React.Component {

    handleTabClick(tab) {
        this.props.onSelect(tab);
    }

    isSelectedTab(tab) {
        return this.props.selected === tab;
    }

    render() {

        const tabDefinitions = [
            { id: TAB_REQUESTS, label: 'Requests' },
            { id: TAB_LISTS, label: 'Lists' }
        ];

        const tabs = tabDefinitions.map(({id, label}) => {
            return (
                <Tab
                    name={label}
                    isSelected={this.isSelectedTab(id)}
                    onClick={ () => this.handleTabClick(id) }
                />
            );
        })

        return <div className="tabs">{ tabs }</div>;
    }
}
