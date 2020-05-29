import React from 'react';
import Popup from '../common/popup';
import Loading from '../common/loading';
import Error from '../common/error';
import { STATUS_LOADING, STATUS_FAILED } from '../../constants';

export default class ListSaveDialog extends React.Component {

    isLoading() {
        return this.props.status === STATUS_LOADING
    }

    isFailed() {
        return this.props.status === STATUS_FAILED;
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
                onClick: () => this.props.onConfirm()
            }, {
                label: 'Cancel',
                className: 'secondary',
                onClick: () => this.props.onCancel()
            }
        ];

        return (
            <Popup title="Save Changes" buttons={ buttons } onClose={ this.props.onCancel }>
                { this.getContents() }
            </Popup>
        );
    }
}

