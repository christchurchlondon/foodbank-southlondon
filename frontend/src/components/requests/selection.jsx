import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    STATUS_IDLE,
    STATUS_LOADING,
    STATUS_FAILED
} from '../../constants';
import Error from '../common/error';
import Loading from '../common/loading';
import Popup from '../common/popup';
import EventsDetails from './events-details';
import './styles/selection.scss';


export default class RequestSelection extends React.Component {

    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
    }

    isIdle() {
        return this.props.status === STATUS_IDLE;
    }

    isLoading() {
        return this.props.status === STATUS_LOADING;
    }

    isFailed() {
        return this.props.status === STATUS_FAILED;
    }

    close() {
        this.props.onClose();
    }

    getContents() {
        if (this.isLoading()) return <Loading />;
        if (this.isFailed()) return <Error message='Unable to load request' />;
        return this.getRequestDetails();
    }

    getRequestDetails() {
        const item = this.props.item.details;
        return (
            <div className="request-details">
                <div className="top-controls">
                    { this.getEditLink(item) }
                </div>
                <div className="row">
                    <label>ID</label>
                    <p>{ item.request_id }</p>
                </div>
                <div className="row">
                    <label>Ref #</label>
                    <p>{ item.referenceNumber }</p>
                </div>
                <div className="row">
                    <label>Full Name</label>
                    <p>{ item.fullName }</p>
                </div>
                <div className="row">
                    <label>Phone Number</label>
                    <p>{ item.phoneNumber }</p>
                </div>
                <div className="row">
                    <label>Delivery Date</label>
                    <p>{ item.delivery.date }</p>
                </div>
                <div className="row">
                    <label>Delivery Instructions</label>
                    <p>{ item.delivery.instructions }</p>
                </div>
                <div className="row">
                    <label>Address</label>
                    <p>{ this.getAddressString(item) }</p>
                </div>
                <div className="row">
                    <label>Household</label>
                    <p>{ this.getHouseholdString(item) }</p>
                </div>
                <div className="row">
                    <label>Age of children</label>
                    <p>{ item.household.ageOfChildren }</p>
                </div>
                <div className="row">
                    <label>Dietary Requirements</label>
                    <p>{ item.requirements.dietary }</p>
                </div>
                <div className="row">
                    <label>Feminine Products Required?</label>
                    <p>{ this.flagToString(item.requirements.feminineProducts) }</p>
                </div>
                <div className="row">
                    <label>Baby Products Required?</label>
                    <p>{ this.flagToString(item.requirements.babyProducts) }</p>
                </div>
                <div className="row">
                    <label>Pet Food Required?</label>
                    <p>{ this.flagToString(item.requirements.petFood) }</p>
                </div>
                <div className="row">
                    <label>Extra Information</label>
                    <p>{ item.extraInformation }</p>
                </div>
            </div>
        );
    }

    getAddressString(item) {
        // TODO formatter function
        const address = item.address;
        return [
            address.line1, address.line2, address.town, address.county, address.postcode
        ].join(', ');
    }

    getHouseholdString(item) {
        // TODO formatter function
        const house = item.household;
        return `${house.total} occupants (${house.adults} adults, ${house.children} children)`
    }

    flagToString(value) {
        return !!value ? 'Yes' : 'No';
    }

    getEditLink(item) {
        return (
            <a href={item.editUrl} target="_blank">
                Edit <FontAwesomeIcon icon="edit" />
            </a>
        );
    }

    getEventsDetails() {
        if (!this.props.item) return null;

        // TODO max height container for events
        return <EventsDetails events={ this.props.item.events } />;
    }

    render() {

        if (this.isIdle()) return null;

        const contents = this.getContents();
        const events = this.getEventsDetails();

        return (
            <Popup title='Request Details' onClose={ this.close }>
                { contents }
                { events }
            </Popup>
        );
    }
}
