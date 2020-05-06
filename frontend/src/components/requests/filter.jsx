import React from 'react';
import DateRangePicker from '../common/date-range-picker';
import './styles/filter.css';


export default class RequestsFilter extends React.Component {

    keyDownHandler(event) {
        if (event.keyCode === 13) {
            this.props.onSubmit(event.target.value);
        }
    }

    render() {
        return (
            <div className="requests-filter panel">
                <label>Filters:</label>
                <DateRangePicker />
            </div>
        );
    }
}


