import React from 'react';
import DateRangePicker from '../common/date-range-picker';
import FilterField from './filter-field';
import './styles/filter.scss';


export default class RequestsFilter extends React.Component {

    constructor(props) {
        super(props);
        this.onNameChange = this.onNameChange.bind(this);
        this.onReferenceNumberChange = this.onReferenceNumberChange.bind(this);
        this.onPostcodeChange = this.onPostcodeChange.bind(this);
        this.submit = this.submit.bind(this);

        this.state = {
            name: props.name,
            referenceNumber: props.referenceNumber,
            postcode: props.postcode
        };
    }

    onNameChange(name) {
        this.setState({ name });
    }

    onReferenceNumberChange(referenceNumber) {
        this.setState({ referenceNumber });
    }

    onPostcodeChange(postcode) {
        this.setState({ postcode });
    }

    submit() {
        this.props.onSubmit({
            name: this.state.name,
            referenceNumber: this.state.referenceNumber,
            postcode: this.state.postcode
        });
    }

    render() {

        // TODO handle date picker changes

        return (
            <div className="requests-filter panel">
                <label>Filters:</label>
                <DateRangePicker />
                <label className="and">and</label>
                <FilterField label="Name"
                    value={ this.state.name }
                    onChange={ this.onNameChange } />
                <FilterField label="Ref #"
                    value={ this.state.referenceNumber }
                    onChange={ this.onReferenceNumberChange } />
                <FilterField label="Postcode"
                    value={ this.state.postcode }
                    onChange={ this.onPostcodeChange } />
                <button onClick={ () => this.submit() }>Go</button>
            </div>
        );
    }
}
