import React from 'react';
import Popup from '../common/popup';


export default class ListItemForm extends React.Component {

    constructor(props) {
        super(props);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    confirm() {
        // TODO add params
        this.props.onEdit();
    }

    cancel() {
        this.props.onCancel();
    }

    render() {

        const title = this.props.id === -1
            ? 'New List Item'
            : 'Edit List Item';

        const buttons = [
            {
                label: 'Ok',
                onClick: () => { this.confirm(); }
            }, {
                label: 'Cancel',
                className: 'secondary',
                onClick: () => { this.cancel(); }
            }
        ];

        // TODO buttons

        return (
            <Popup title={title} buttons={buttons} onClose={ this.cancel }>
                <p>Form contents go here</p>
            </Popup>
        );
    }

}

