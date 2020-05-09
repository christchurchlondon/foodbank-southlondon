import React from 'react';
import {
    STATUS_IDLE,
    STATUS_LOADING,
    STATUS_SUCCESS,
    STATUS_FAILED
} from '../../constants';
import Popup from '../common/popup';


export default class RequestSelection extends React.Component {

    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
    }

    isIdle() {
        return this.props.status === STATUS_IDLE;
    }

    close() {
        this.props.onClose();
    }

    render() {

        if (this.isIdle()) return null;

        // TODO loading state

        return (
            <Popup title='Request Details' onClose={ this.close }>
                <p>Request details will go here</p>
            </Popup>
        );
    }
}
