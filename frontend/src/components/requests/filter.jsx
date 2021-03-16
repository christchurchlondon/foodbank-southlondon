import React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
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
        this.toggleAdditional = this.toggleAdditional.bind(this);
        this.submit = this.submit.bind(this);

        this.state = {
            showAdditional: false,
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

    toggleAdditional() {
        this.setState({ showAdditional: !this.state.showAdditional });
    }

    submit() {
        this.props.onSubmit({
            dates: this.state.dates,
            name: this.state.name,
            referenceNumber: this.state.referenceNumber,
            postcode: this.state.postcode
        });
    }

    getAdditionalFilter() {
        return this.state.showAdditional
            ? (
                <div className="additional-filter">
                    <h4>Additional filters</h4>
                    <FilterField label="Search names..."
                        value={ this.state.name }
                        onChange={ this.onNameChange }
                        onEnter={ this.submit } />
                    <FilterField label="Search vouchers..."
                        value={ this.state.referenceNumber }
                        onChange={ this.onReferenceNumberChange }
                        onEnter={ this.submit } />
                </div>
            )
            : null;
    }

    render() {
        return (
            <div className="requests-filter panel">
                <div className="standard-filter">
                    <div className="date-field">
                        <DateRangePicker
                            onChange={ this.onDatePickerChange }
                            onEnter={ this.submit }
                            start={ this.state.dates.start }
                            end={ this.state.dates.end } />
                    </div>
                    <FilterField label="Search postcodes..."
                        value={ this.state.postcode }
                        onChange={ this.onPostcodeChange }
                        onEnter={ this.submit } />
                    <span className="anchor toggle-more" onClick={ this.toggleAdditional }>
                        <span className="toggle-more-label">{ this.state.showAdditional ? 'Less' : 'More' }</span>
                        <Icon icon={ this.state.showAdditional ? 'chevron-up' : 'chevron-down' }
                            className="toggle-more-icon" />
                    </span>
                    <button onClick={ () => this.submit() }>Go</button>
                </div>
                { this.getAdditionalFilter() }
            </div>
        );
    }
}
