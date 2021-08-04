import React from 'react';
import Tab from './tab';

const tabDefinitions = [
    { path: '/clients', label: 'Clients' },
    { path: '/lists', label: 'Lists' },
    { path: '/calendar', label: 'Calendar' }
];

export default function Tabs() {

    const tabs = tabDefinitions.map(({ path, label }, index) => {
        return (
            <Tab
                key={index}
                name={label}
                path={path}
            />
        );
    })

    return <div className="tabs">{ tabs }</div>;
}
