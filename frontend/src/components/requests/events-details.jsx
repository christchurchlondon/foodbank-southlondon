import React from 'react';
import { format } from 'date-fns';
import { DATE_FORMAT_UI_LONG } from '../../constants';
import './styles/events-details.scss';


export default function RequestEventsDetails(props) {

    const rows = props.events.length > 0
        ? props.events.map((event, index) => (
            <tr key={index}>
                <td>{ event.name }</td>
                <td>{ format(event.timestamp, DATE_FORMAT_UI_LONG) }</td>
                <td>{ event.data }</td>
            </tr>
        ))
        : <tr><td className="empty-row" colSpan="3">No events</td></tr>;

    return (
        <table className="events-details">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Timestamp</th>
                    <th>Event Data</th>
                </tr>
            </thead>
            <tbody>
                { rows }
            </tbody>
        </table>
    );
}
