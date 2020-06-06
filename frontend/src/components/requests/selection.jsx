import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    STATUS_IDLE,
    STATUS_LOADING,
    STATUS_FAILED
} from '../../constants';
import { capitalise, formatAddress, formatHousehold } from '../../helpers';
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
                    <p>{ item.id }</p>
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
                    <p>{ formatAddress(item.address) }</p>
                </div>
                <div className="row">
                    <label>Household</label>
                    <p>{ formatHousehold(item.household) }</p>
                </div>
                <div className="row">
                    <label>Age of children</label>
                    <p>{ item.household.ageOfChildren }</p>
                </div>
                <div className="row">
                    <label>Dietary Requirements</label>
                    <p>{ item.requirements.dietary || 'None' }</p>
                </div>
                <div className="row">
                    <label>Other requirements</label>
                    <p>{ this.getOtherRequirementsText(item) }</p>
                </div>
                <div className="row">
                    <label>Extra Information</label>
                    <p>{ item.extraInformation || 'None' }</p>
                </div>
            </div>
        );
    }

    getOtherRequirementsText(item) {
        const reqs = item.requirements;
        const list = [];
        reqs.feminineProducts && list.push('feminine products');
        reqs.babyProducts && list.push('baby products');
        reqs.petFood && list.push('pet food');

        return capitalise(list.length ? list.join(', ') : 'none');
    }

    getEditLink(item) {
        return (
            <a href={item.editUrl} target="_blank" rel="noopener noreferrer">
                Edit <FontAwesomeIcon icon="edit" />
            </a>
        );
    }

    getEventsDetails() {
        if (!this.props.item) return null;

        // TODO max height container for events
        return (
            <div className="event-wrap">
                <EventsDetails events={ this.props.item.events } />
            </div>
        );
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
