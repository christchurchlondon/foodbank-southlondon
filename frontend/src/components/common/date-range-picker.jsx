import React from 'react';
import DatePicker from 'react-datepicker';
import { DATE_FORMAT_UI } from '../../constants';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/date-range-picker.scss';


export default class DateRangePicker extends React.Component {

    // TODO take start date and date range in props
    
    constructor(props) {
        super(props);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.state = {
            startDate: '',
            endDate: ''
        };
    }

    setStartDate(date) {

        // TODO if start date > end date, end date = start date

        this.setState({ startDate: date });
    }

    setEndDate(date) {
        this.setState({ endDate: date });
    }

    render() {

        const startDate = this.state.startDate;
        const endDate = this.state.endDate;

        return (
            <div className="date-range-picker">
                <DatePicker
                    dateFormat={ DATE_FORMAT_UI }
                    selected={ startDate }
                    onChange={ date => this.setStartDate(date) }
                    selectsStart
                    startDate={ startDate }
                    endDate={ endDate }
                />
                <DatePicker
                    dateFormat={ DATE_FORMAT_UI }
                    selected={ endDate }
                    onChange={ date => this.setEndDate(date) }
                    selectsEnd
                    startDate={ startDate }
                    endDate={ endDate }
                    minDate={ startDate }
                />
            </div>
        );
    }
}
