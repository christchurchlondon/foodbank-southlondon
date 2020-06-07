import React from 'react';
import DatePicker from 'react-datepicker';
import { DATE_FORMAT_UI } from '../../constants';
import { today } from '../../helpers';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/date-range-picker.scss';


export default class DateRangePicker extends React.Component {

    constructor(props) {
        super(props);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.state = {
            startDate: this.props.start,
            endDate: this.props.end
        };
    }

    setStartDate(date) {

        // TODO if start date > end date, end date = start date

        this.setState({ startDate: date }, () => this.onChange());
    }

    setEndDate(date) {
        this.setState({ endDate: date }, () => this.onChange());
    }

    onChange() {
        this.props.onChange({
            start: this.state.startDate,
            end: this.state.endDate
        });
    }

    handleKeyDown(event) {
        if (event.keyCode === 13) {
            this.props.onEnter();
        }
    }

    render() {

        const startDate = this.state.startDate;
        const endDate = this.state.endDate;
        const highlight = [ today() ];
        
        return (
            <div className="date-range-picker" onKeyPress={ this.handleKeyPress }>
                <DatePicker
                    todayButton="Today"
                    dateFormat={ DATE_FORMAT_UI }
                    selected={ startDate }
                    onChange={ date => this.setStartDate(date) }
                    onKeyDown={ this.handleKeyDown }
                    selectsStart
                    startDate={ startDate }
                    endDate={ endDate }
                    highlightDates={ highlight }
                />
                <label>to</label>
                <DatePicker
                    todayButton="Today"
                    dateFormat={ DATE_FORMAT_UI }
                    selected={ endDate }
                    onChange={ date => this.setEndDate(date) }
                    onKeyDown={ this.handleKeyDown }
                    selectsEnd
                    startDate={ startDate }
                    endDate={ endDate }
                    minDate={ startDate }
                    highlightDates={ highlight }
                />
            </div>
        );
    }
}
