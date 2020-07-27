import React from 'react';
import Popup from '../common/popup';
import Loading from '../common/loading';
import Error from '../common/error';
import { STATUS_LOADING, STATUS_FAILED } from '../../constants';

export default class ListSaveDialog extends React.Component {

    constructor(props) {
        super(props);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    isLoading() {
        return this.props.status === STATUS_LOADING
    }

    isFailed() {
        return this.props.status === STATUS_FAILED;
    }

    confirm() {
        this.props.onConfirm();
    }

    cancel() {
        this.props.onCancel();
    }

    getContents() {
        if (this.isLoading()) return <Loading />;
        if (this.isFailed()) return <Error message='Unable to save changes' />;
        return <p>Do you want to save your changes?</p>;
    }

    render() {

        const buttons = [
            {
                label: 'Ok',
                disabled: this.isLoading() || this.isFailed(),
                onClick: () => this.confirm()
            }, {
                label: 'Cancel',
                className: 'secondary',
                onClick: () => this.cancel()
            }
        ];

        return (
            <Popup
                title="Save Changes"
                buttons={ buttons }
                onConfirm={ this.confirm }
                onClose={ this.cancel }>
                { this.getContents() }
            </Popup>
        );
    }
}

