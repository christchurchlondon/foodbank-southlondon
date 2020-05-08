import React from 'react';
import DateRangePicker from '../common/date-range-picker';
import FilterField from './filter-field';
import './styles/filter.scss';


export default class RequestsFilter extends React.Component {

    keyDownHandler(event) {
        if (event.keyCode === 13) {
            this.props.onSubmit(event.target.value);
        }
    }

    onNameChange(name) {
        // TODO
    }

    onReferenceNumberChange(referenceNumber) {
        // TODO
    }

    onPostcodeChange(postcode) {
        // TODO
    }

    render() {
        return (
            <div className="requests-filter panel">
                <label>Filters:</label>
                <DateRangePicker />
                <label className="and">and</label>
                <FilterField label="Name" onChange={ this.onNameChange } />
                <FilterField label="Ref #" onChange={ this.onReferenceNumberChange } />
                <FilterField label="Postcode" onChange={ this.onPostcodeChange } />
            </div>
        );
    }
}
