import React from 'react';
import Popup from '../common/popup';
import './styles/item-form.scss';


const columns = [
    { id: 'familyOf1', label: 'Single' },
    { id: 'familyOf2', label: 'Family of 2' },
    { id: 'familyOf3', label: 'Family of 3' },
    { id: 'familyOf4', label: 'Family of 4' },
    { id: 'familyOf5', label: 'Family of 5' },
    { id: 'familyOf6', label: 'Family of 6' },
    { id: 'familyOf7', label: 'Family of 7' },
    { id: 'familyOf8', label: 'Family of 8' },
    { id: 'familyOf9', label: 'Family of 9' },
    { id: 'familyOf10Plus', label: 'Family of 10 Plus' },
];

export default class ListItemForm extends React.Component {

    constructor(props) {
        super(props);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.updateQuantity = this.updateQuantity.bind(this);
        this.updateNotes = this.updateNotes.bind(this);

        const sizes = this.props.item.householdSizes;

        this.state = {
            id: this.props.id,
            description: this.props.item.description || '',
            householdSizes: {
                familyOf1: {
                    quantity: sizes.familyOf1.quantity || '',
                    notes: sizes.familyOf1.notes || ''
                },
                familyOf2: {
                    quantity: sizes.familyOf2.quantity || '',
                    notes: sizes.familyOf2.notes || ''
                },
                familyOf3: {
                    quantity: sizes.familyOf3.quantity || '',
                    notes: sizes.familyOf3.notes || ''
                },
                familyOf4: {
                    quantity: sizes.familyOf4.quantity || '',
                    notes: sizes.familyOf4.notes || ''
                },
                familyOf5: {
                    quantity: sizes.familyOf5.quantity || '',
                    notes: sizes.familyOf5.notes || ''
                },
                familyOf6: {
                    quantity: sizes.familyOf6.quantity || '',
                    notes: sizes.familyOf6.notes || ''
                },
                familyOf7: {
                    quantity: sizes.familyOf7.quantity || '',
                    notes: sizes.familyOf7.notes || ''
                },
                familyOf8: {
                    quantity: sizes.familyOf8.quantity || '',
                    notes: sizes.familyOf8.notes || ''
                },
                familyOf9: {
                    quantity: sizes.familyOf9.quantity || '',
                    notes: sizes.familyOf9.notes || ''
                },
                familyOf10Plus: {
                    quantity: sizes.familyOf10Plus.quantity || '',
                    notes: sizes.familyOf10Plus.notes || ''
                }
            }
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyDownHandler, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDownHandler, false);
    }

    keyDownHandler(event) {
        if (event.keyCode === 13) {
            this.confirm();
        }
        if (event.keyCode === 27) {
            this.cancel();
        }
    }

    confirm() {
        if (!this.state.description) return;
        this.props.onEdit(this.props.id, this.state);
    }

    cancel() {
        this.props.onCancel();
    }

    updateDescription(event) {
        const description = event.target.value;
        this.setState({ description })
    }

    updateQuantity(event, householdSize) {
        const quantity = event.target.value;
        const householdSizes = {
            ...this.state.householdSizes,
            [householdSize]: {
                ...this.state.householdSizes[householdSize],
                quantity
            }
        };

        this.setState({ householdSizes });
    }

    updateNotes(event, householdSize) {
        const notes = event.target.value;
        const householdSizes = {
            ...this.state.householdSizes,
            [householdSize]: {
                ...this.state.householdSizes[householdSize],
                notes
            }
        };
        this.setState({ householdSizes });
    }

    getForm() {

        const rows = columns.map(column => {
            return (
                <div key={ column.id } className="row-group">
                    <h4>{ column.label }</h4>
                    <div className="row">
                        <label>Quantity</label>
                        <input type="text" className="small"
                            value={ this.state.householdSizes[column.id].quantity }
                            onChange={ e => this.updateQuantity(e, column.id) } />
                    </div>
                    <div className="row">
                        <label>Notes</label>
                        <input type="text" className="large"
                            value={ this.state.householdSizes[column.id].notes }
                            onChange={ e => this.updateNotes(e, column.id) } />
                    </div>
                </div>
            );
        });

        return (
            <div className="item-form">
                <div className="row">
                    <label>Description</label>
                    <input type="text" value={ this.state.description } onChange={ this.updateDescription } />
                </div>
                { rows }
            </div>
        );
    }

    render() {

        const title = this.props.new
            ? 'New List Item'
            : 'Edit List Item';

        const buttons = [
            {
                label: 'Ok',
                className: 'primary',
                onClick: () => this.confirm()
            }, {
                label: 'Cancel',
                className: 'secondary',
                onClick: () => this.cancel()
            }
        ];

        return (
            <Popup title={title} buttons={buttons} onClose={ this.cancel }>
                { this.getForm() }
            </Popup>
        );
    }

}

