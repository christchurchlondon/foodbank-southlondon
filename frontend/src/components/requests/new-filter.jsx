import React, { useState } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import DateRangePicker from '../common/date-range-picker';

export function NewFilter({ disabled, filters, onSubmit }) {
    const [state, setState] = useState(filters);

    const { start, end } = state.dates || {};

    return (
        <div className="requests-filter panel">
            <div className="standard-filter">
                <div className="date-field">
                    <DateRangePicker
                        onChange={(dates) => setState({ ...state, dates })}
                        onEnter={() => {}}
                        start={start}
                        end={end} />
                </div>

                <div className="search-field">
                    <Icon icon="search" className="search-icon" />
                    <input type="text"
                        className="value"
                        placeholder='Search...'
                        value=''
                        onChange={() => {}}
                        onKeyDown={() => {}} />
                </div>

                <button
                    onClick={() => onSubmit(state)}
                    disabled={disabled}
                >
                    Go
                </button>
            </div>
        </div>
    );
}