import React from 'react';
import DatePicker from 'react-datepicker';
import Popup from '../common/popup';
import Error from '../common/error';
import Loading from '../common/loading';
import { DATE_FORMAT_UI, STATUS_FAILED, STATUS_LOADING } from '../../constants';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/event-dialog.scss';


export default class RequestsEventDialog extends React.Component {

    constructor(props) {
        super(props);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.close = this.close.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateQuantity = this.updateQuantity.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);

        this.state = {
            date: null,
            quantity: null
        };
    }

    componentDidMount() {
        if (!this.props.details) return;
        document.addEventListener('keydown', this.keyDownHandler, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDownHandler, false);
    }

    keyDownHandler(event) {
        if (event.keyCode === 13) {
            this.confirm();
        }
    }

    confirm() {
        if (!this.canSubmit()) return;

        const params = {
            date: this.state.date,
            quantity: this.state.quantity
        };

        this.props.onConfirm(this.props.details.event, params);
    }

    cancel() {
        this.props.onCancel();
    }

    close() {
        this.props.onCancel()
    }

    updateDate(date) {
        this.setState({ date });
    }

    updateQuantity(event) {
        // TODO check that this is a number?
        const quantity = event.target.value;
        this.setState({ quantity });
    }

    getInputFields() {
        // Is it one or the other?
        if (this.props.details.event.requiresDate) {
            const maxDate = new Date();
            return (
                <div className="field-row">
                    <label>Date</label>
                    <DatePicker
                        selected={ this.state.date }
                        dateFormat={ DATE_FORMAT_UI }
                        endDate={ maxDate }
                        onChange={ date => this.updateDate(date) }
                    />
                </div>
            );
        }
        if (this.props.details.event.requiresQuantity) {
            return (
                <div className="field-row">
                    <label>Quantity</label>
                    <input type="number" onChange={ this.updateQuantity } />
                </div>
            );
        }
        return null;
    }

    requiresDate() {
        return this.props.details.event.requiresDate;
    }

    requiresQuantity() {
        return this.props.details.event.requiresQuantity;
    }

    canSubmit() {
        if (this.requiresDate() && !this.state.date) return false;
        if (this.requiresQuantity() && !this.state.quantity) return false;
        return true;
    }

    requiresStatusDialog() {
        return [ STATUS_LOADING, STATUS_FAILED ].includes(this.props.status);
    }

    getStatusDialogContents() {
        const isLoading = this.props.status === STATUS_LOADING;
        const contents = isLoading ? <Loading /> : <Error />;
        return (
            <Popup title="Event Submission" canClose={ !isLoading } onClose={ this.close }>
                { contents }
            </Popup>
        );
    }

    render() {

        if (this.requiresStatusDialog()) {
            return this.getStatusDialogContents();
        }

        if (!this.props.details) return null;

        const buttons = [
            {
                label: 'Confirm',
                disabled: !this.canSubmit(),
                onClick: () => { this.confirm(); }
            },
            {
                label: 'Cancel',
                className: 'secondary',
                onClick: () => { this.cancel(); }
            }
        ];

        const inputFields = this.getInputFields();

        return (
            <Popup title="Confirm submission"
                buttons={ buttons }
                onClose={ this.close }
            >
                <div className="event-dialog-contents">
                    <p>Are you sure you want to submit this action?</p>
                    { inputFields }
                </div>
            </Popup>
        );
    }

}
