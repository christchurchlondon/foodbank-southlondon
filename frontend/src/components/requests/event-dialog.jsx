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
        this.updateName = this.updateName.bind(this);
        this.updateQuantity = this.updateQuantity.bind(this);

        this.state = {
            date: new Date(),
            name: null,
            quantity: null
        };
    }

    confirm() {
        if (!this.canSubmit()) return;

        const params = {
            date: this.state.date,
            name: this.state.name,
            quantity: this.state.quantity
        };

        this.props.onConfirm(
            this.props.details.event,
            this.props.details.type,
            params
        );
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

    updateName(event) {
        const name = event.target.value;
        this.setState({ name });
    }

    updateQuantity(event) {
        const quantity = event.target.value;
        this.setState({ quantity });
    }

    getInputFields() {
        if (this.requiresDate()) {
            const maxDate = new Date();
            return (
                <div className="field-row">
                    <label>Date</label>
                    {/* Don't try to autoFocus the date as we assume it has a sensible default */}
                    <DatePicker
                        selected={ this.state.date }
                        dateFormat={ DATE_FORMAT_UI }
                        endDate={ maxDate }
                        onChange={ date => this.updateDate(date) }
                    />
                </div>
            );
        }
        if (this.requiresName()) {
            return (
                <div className="field-row">
                    <label>Name</label>
                    <input type="text" autoFocus={!this.requiresQuantity()} onChange={ this.updateName } />
                </div>
            );
        }
        if (this.requiresQuantity()) {
            return (
                <div className="field-row">
                    <label>Quantity</label>
                    <input type="number" autoFocus={!this.requiresName()} onChange={ this.updateQuantity } />
                </div>
            );
        }
        return null;
    }

    requiresDate() {
        return this.props.details.event.requiresDate;
    }

    requiresName() {
        return this.props.details.event.requiresName;
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
                className: 'primary',
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
                onConfirm={ this.confirm }
                onClose={ this.close }
            >
                <div className="event-dialog-contents">
                    <p>{ this.props.details.event.confirmationLabel || 'Are you sure you want to submit this action?' }</p>
                    { inputFields }
                </div>
            </Popup>
        );
    }

}
