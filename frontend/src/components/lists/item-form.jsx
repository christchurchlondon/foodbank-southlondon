import React from 'react';
import Popup from '../common/popup';
import './styles/item-form.scss';


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
                single: {
                    quantity: sizes.single.quantity || '',
                    notes: sizes.single.notes || ''
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
                familyOf5Plus: {
                    quantity: sizes.familyOf5Plus.quantity || '',
                    notes: sizes.familyOf5Plus.notes || ''
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
        return (
            <div className="item-form">
                <div className="row">
                    <label>Description</label>
                    <input type="text" value={ this.state.description } onChange={ this.updateDescription } />
                </div>
                <div className="row-group">
                    <h4>Single</h4>
                    <div className="row">
                        <label>Quantity</label>
                        <input type="text" className="small"
                            value={ this.state.householdSizes.single.quantity }
                            onChange={ e => this.updateQuantity(e, 'single') } />
                    </div>
                    <div className="row">
                        <label>Notes</label>
                        <input type="text" className="large"
                            value={ this.state.householdSizes.single.notes }
                            onChange={ e => this.updateNotes(e, 'single') } />
                    </div>
                </div>
                <div className="row-group">
                    <h4>Family of 2</h4>
                    <div className="row">
                        <label>Quantity</label>
                        <input type="text" className="small"
                            value={ this.state.householdSizes.familyOf2.quantity }
                            onChange={ e => this.updateQuantity(e, 'familyOf2') } />
                    </div>
                    <div className="row">
                        <label>Notes</label>
                        <input type="text" className="large"
                            value={ this.state.householdSizes.familyOf2.notes }
                            onChange={ e => this.updateNotes(e, 'familyOf2') } />
                    </div>
                </div>
                <div className="row-group">
                    <h4>Family of 3</h4>
                    <div className="row">
                        <label>Quantity</label>
                        <input type="text" className="small"
                            value={ this.state.householdSizes.familyOf3.quantity }
                            onChange={ e => this.updateQuantity(e, 'familyOf3') } />
                    </div>
                    <div className="row">
                        <label>Notes</label>
                        <input type="text" className="large"
                            value={ this.state.householdSizes.familyOf3.notes }
                            onChange={ e => this.updateNotes(e, 'familyOf3') } />
                    </div>
                </div>
                <div className="row-group">
                    <h4>Family of 4</h4>
                    <div className="row">
                        <label>Quantity</label>
                        <input type="text" className="small"
                            value={ this.state.householdSizes.familyOf4.quantity }
                            onChange={ e => this.updateQuantity(e, 'familyOf4') } />
                    </div>
                    <div className="row">
                        <label>Notes</label>
                        <input type="text" className="large"
                            value={ this.state.householdSizes.familyOf4.notes }
                            onChange={ e => this.updateNotes(e, 'familyOf4') } />
                    </div>
                </div>
                <div className="row-group">
                    <h4>Family of 5+</h4>
                    <div className="row">
                        <label>Quantity</label>
                        <input type="text" className="small"
                            value={ this.state.householdSizes.familyOf5Plus.quantity }
                            onChange={ e => this.updateQuantity(e, 'familyOf5Plus') } />
                    </div>
                    <div className="row">
                        <label>Notes</label>
                        <input type="text" className="large"
                            value={ this.state.householdSizes.familyOf5Plus.notes }
                            onChange={ e => this.updateNotes(e, 'familyOf5Plus') } />
                    </div>
                </div>
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
                onClick: () => { this.confirm(); }
            }, {
                label: 'Cancel',
                className: 'secondary',
                onClick: () => { this.cancel(); }
            }
        ];

        return (
            <Popup title={title} buttons={buttons} onClose={ this.cancel }>
                { this.getForm() }
            </Popup>
        );
    }

}

