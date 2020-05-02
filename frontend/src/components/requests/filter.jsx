import React from 'react';
import './styles/filter.css';


export default class RequestsFilter extends React.Component {
    render() {
        // TODO should the filter itself be in ./common/filter?
        // TODO individual filter items?  Discuss with Adam.
        return (
            <div className="requests-filter panel">
                <label>Filters:</label>
                <input type="text" />
            </div>
        );
    }
}


