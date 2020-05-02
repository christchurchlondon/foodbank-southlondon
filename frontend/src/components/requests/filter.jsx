import React from 'react';
import './styles/filter.css';


export default class RequestsFilter extends React.Component {

    keyDownHandler(event) {
        if (event.keyCode === 13) {
            this.props.onSubmit(event.target.value);
        }
    }

    render() {
        // TODO should the filter itself be in ./common/filter?
        // TODO individual filter items?  Discuss with Adam.
        return (
            <div className="requests-filter panel">
                <label>Filters:</label>
                <input
                    type="text"
                    defaultValue={ this.props.value }
                    onKeyDown={ this.keyDownHandler.bind(this) }
                />
            </div>
        );
    }
}


