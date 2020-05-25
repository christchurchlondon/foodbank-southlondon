import React from 'react';
import Popup from '../common/popup';

export default function ListSaveDialog(props) {

    const buttons = [
        {
            label: 'Ok',
            onClick: () => props.onConfirm()
        }, {
            label: 'Cancel',
            className: 'secondary',
            onClick: () => props.onCancel()
        }
    ];

    return (
        <Popup title="Save Changes" buttons={ buttons }>
            <p>Do you want to save your changes?</p>
        </Popup>
    );
}

