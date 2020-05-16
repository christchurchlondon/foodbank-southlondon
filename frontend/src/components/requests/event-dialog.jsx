import React from 'react';
import Popup from '../common/popup';


export default class RequestsEventDialog extends React.Component {

    constructor(props) {
        super(props);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.close = this.close.bind(this);
    }

    confirm() {
        this.props.onConfirm(this.props.details.event.name);
    }

    cancel() {
        this.props.onCancel();
    }

    close() {
        this.props.onCancel()
    }

    render() {
        if (!this.props.details) return null;

        const buttons = [
            {
                label: 'Confirm',
                // disabled: true,    // TODO base this on inputs
                onClick: () => { this.confirm(); }
            },
            {
                label: 'Cancel',
                className: 'secondary',
                onClick: () => { this.cancel(); }
            }
        ];

        return (
            <Popup title="Confirm submission"
                buttons={ buttons }
                onClose={ this.close }
            >
                <p>Are you sure you want to submit this action?</p>
            </Popup>
        );
    }

}
