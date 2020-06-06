import React from 'react';
import DateRangePicker from '../common/date-range-picker';
import FilterField from './filter-field';
import './styles/filter.scss';


export default class RequestsFilter extends React.Component {

    constructor(props) {
        super(props);
        this.onDatePickerChange = this.onDatePickerChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onReferenceNumberChange = this.onReferenceNumberChange.bind(this);
        this.onPostcodeChange = this.onPostcodeChange.bind(this);
        this.submit = this.submit.bind(this);

        this.state = {
            dates: props.value.dates || {},
            name: props.value.name || '',
            referenceNumber: props.value.referenceNumber || '',
            postcode: props.value.postcode || ''
        };
    }

    onDatePickerChange(dates) {
        this.setState({ dates });
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
            dates: this.state.dates,
            name: this.state.name,
            referenceNumber: this.state.referenceNumber,
            postcode: this.state.postcode
        });
    }

    render() {
        return (
            <div className="requests-filter panel">
                <div className="date-field">
                    <label className="date-field-label">Dates:</label>
                    <DateRangePicker
                        onChange={ this.onDatePickerChange }
                        onEnter={ this.submit }
                        start={ this.state.dates.start }
                        end={ this.state.dates.end } />
                </div>
                <label className="and">and</label>
                <FilterField label="Name"
                    value={ this.state.name }
                    onChange={ this.onNameChange }
                    onEnter={ this.submit } />
                <FilterField label="Ref #"
                    value={ this.state.referenceNumber }
                    onChange={ this.onReferenceNumberChange }
                    onEnter={ this.submit } />
                <FilterField label="Postcode"
                    value={ this.state.postcode }
                    onChange={ this.onPostcodeChange }
                    onEnter={ this.submit } />
                <button onClick={ () => this.submit() }>Go</button>
            </div>
        );
    }
}
