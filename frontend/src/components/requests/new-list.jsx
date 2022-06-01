import React from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { DATE_FORMAT_UI } from '../../constants';
import Loading from '../common/loading';
import Flag from './flag';
import { extractEvent } from './list';

function groupTitle(request) {
    const parts = [
        format(request.packingDate, DATE_FORMAT_UI),
        request.timeOfDay,
        request.collectionCentre ? request.collectionCentre : 'Delivery'
    ];

    return parts.join(" - ");
}

// (collection/delivery, packing date, time)
function groupRequests(requests) {
    const ret = [];

    let group = [requests[0]];

    for(let i = 1; i < requests.length; i++) {
        const request = requests[i];
        const lastRequest = requests[i - 1];

        if(request.data.collectionCentre !== lastRequest.data.collectionCentre ||
            request.data.packingDate.getTime() !== lastRequest.data.packingDate.getTime() ||
            request.data.timeOfDay !== lastRequest.data.timeOfDay) {
                ret.push(group);
                group = [];
        }

        group.push(request);
    }

    ret.push(group);

    return ret;
}

function EmptyListBody({ loading }) {
    return <tbody>
        <tr className="empty-row">
            <td colSpan="6">
                {loading ? <Loading /> : "No results"}
            </td>
        </tr>
    </tbody>;
}

function Request({ request, onToggle, onSelect }) {
    const { checked, data: { id, flagForAttention, fullName, householdSize, postcode, event }} = request;
    const disabled = !id.length;

    return <tr onClick={onSelect}>
        <td className="selection-cell">
            <input type="checkbox"
                disabled={disabled}
                onChange={onToggle}
                onClick={(e) => e.stopPropagation()}
                checked={checked} />
        </td>
        <td className="cell-trim">
            { flagForAttention && <Flag /> }
        </td>
        <td>
            { fullName }
        </td>
        <td>{ householdSize }</td>
        <td>
            { postcode }
        </td>
        <td>{ extractEvent(event) }</td>
    </tr>;
}

function NewListBody({ requests, onToggle, onSelect }) {
    const groupedRequests = groupRequests(requests);

    return <tbody>
        {
            groupedRequests.flatMap(group => {
                const title = groupTitle(group[0].data);
            
                return [
                    <tr key={title} className='inline-header-row'>
                        <th className='inline-header' colSpan='6'>{title}</th>
                    </tr>,
                    ...group.map((request) =>
                        <Request
                            key={request.data.id}
                            request={request}
                            onToggle={() => onToggle(request.data.id)}
                            onSelect={() => onSelect(request.data.id)}
                        />
                    )
                ]
            })
        }
    </tbody>;
}

export default function NewList({ requests, loading, onSelect, onToggle, onToggleAll, onRefresh }) {
    const hasData = requests.length > 0;
    const allChecked = requests.every(request => request.checked);

    function refresh() {
        if(!loading) {
            onRefresh();
        }
    }

    return <table className="requests-list selectable">
        <thead>
            <tr>
                <th className="selection-cell">
                    <input type="checkbox"
                        onChange={onToggleAll}
                        disabled={!hasData}
                        checked={hasData && allChecked} />
                </th>
                <th className="cell-trim"></th>
                <th>Name</th>
                <th>Family Size</th>
                <th>Postcode</th>
                <th>
                    <div className="cell-with-actions">
                        Last Status
                        <button onClick={refresh}>
                            <Icon
                                icon="sync"
                                title="Refresh"
                                spin={loading}
                            />
                        </button>
                    </div>
                </th>
            </tr>
        </thead>
        { hasData ?
            <NewListBody
                requests={requests}
                onToggle={onToggle}
                onSelect={onSelect}
            /> :
            <EmptyListBody loading={loading} />
        }
    </table>;
}