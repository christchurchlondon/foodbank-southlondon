import React from 'react';
import Popup from '../common/popup';


export default class ListItemForm extends React.Component {

    render() {

        const title = this.props.id === -1
            ? 'New List Item'
            : 'Edit List Item';

        return (
            <Popup title={title}>
                <p>Form contents go here</p>
            </Popup>
        );
    }

}

