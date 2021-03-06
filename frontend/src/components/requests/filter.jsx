import React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import DateRangePicker from '../common/date-range-picker';
import FilterFieldText from './filter-field-text';
import FilterFieldValues from './filter-field-values';
import './styles/filter.scss';

function statusValues(statuses) {
    return statuses.items
        .map(({ name }) => name)
        .filter(name => name !== '');
}

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
            // TODO MRB: change back to false
            showAdditional: true
        };
    }

    getValue(field, defaultValue) {
        return this.state[field] || this.props.value[field] || defaultValue;
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
            dates: this.getValue('dates', {}),
            name: this.getValue('name', ''),
            referenceNumber: this.getValue('referenceNumber', ''),
            postcode: this.getValue('postcode', ''),
            timeOfDay: this.getValue('timeOfDay', []),
            statuses: this.getValue('statuses', [])
        });
    }

    getAdditionalFilter() {
        return this.state.showAdditional
            ? (
                <div className="additional-filter">
                    <h4>Additional filters</h4>
                    <FilterFieldText label="Search names..."
                        value={ this.getValue('name', '') }
                        onChange={ this.onNameChange }
                        onEnter={ this.submit } />
                    <FilterFieldText label="Search vouchers..."
                        value={ this.getValue('referenceNumber', '') }
                        onChange={ this.onReferenceNumberChange }
                        onEnter={ this.submit } />
                    <FilterFieldValues
                        label="Time Of Day"
                        values={this.getValue('timeOfDay', [])}
                        onChange={timeOfDay => this.setState({ timeOfDay })}
                        allPossibleValues={this.props.allPossibleTimesOfDay.items}
                    />
                    <FilterFieldValues
                        label="Status"
                        values={this.getValue('statuses', [])}
                        onChange={statuses => this.setState({ statuses })}
                        allPossibleValues={statusValues(this.props.allPossibleStatuses)}
                    />
                </div>
            )
            : null;
    }

    render() {
        const { start, end } = this.getValue('dates', {});

        return (
            <div className="requests-filter panel">
                <div className="standard-filter">
                    <div className="date-field">
                        <DateRangePicker
                            onChange={ this.onDatePickerChange }
                            onEnter={ this.submit }
                            start={start}
                            end={end}
                        />
                    </div>
                    <FilterFieldText label="Search postcodes..."
                        value={ this.getValue('postcode', '') }
                        onChange={ this.onPostcodeChange }
                        onEnter={ this.submit } />
                    <span className="anchor toggle-more" onClick={ this.toggleAdditional }>
                        <span className="toggle-more-label">More</span>
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
