import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '../common/menu';
import { fetchRequests, fetchTimeOfDayFilterValues, fetchEventsFilterValues } from '../../redux/actions';
import { STATUS_LOADING, STATUS_SUCCESS } from '../../constants';

export function FilterFieldValues({ allPossibleValues, values, onChange, onOpen, loading, disabled }) {
    function getUpdatedValues(value) {
        if(values.includes(value)) {
            return values.filter(v => v !== value);
        }

        return [...values, value];
    }

    const label = values.length > 0 ? `(${values.length})` : '';

    return <div className="filter-field">
        <Menu
            alignLeft={true}
            icon="filter"
            className="icon"
            loading={loading}
            onOpen={onOpen}
            options={allPossibleValues.map(value =>
                <React.Fragment>
                    <input
                        type="checkbox"
                        onChange={() => onChange(getUpdatedValues(value))}
                        checked={values.includes(value)}
                        disabled={disabled}
                    ></input>
                    <label>{value}</label>
                </React.Fragment>    
            )}
        />
        {label}
    </div>;
}

export function FilterTimeOfDay() {
    const dispatch = useDispatch();
    const { filters, timeOfDayFilterValues, status } = useSelector(state => state.requests);

    return <FilterFieldValues
        loading={timeOfDayFilterValues.loadingStatus === STATUS_LOADING}
        disabled={status !== STATUS_SUCCESS}
        allPossibleValues={timeOfDayFilterValues.items}
        values={filters['timeOfDay'] || []}
        onChange={(timeOfDay) => dispatch(fetchRequests({ ...filters, timeOfDay }, 1, false)) }
        onOpen={() => dispatch(fetchTimeOfDayFilterValues())}
    />;
}

export function FilterStatus() {
    const dispatch = useDispatch();
    const { filters, eventsFilterValues, status } = useSelector(state => state.requests);

    const allPossibleValues = eventsFilterValues.items
        .map(({ event_name }) => event_name)
        .filter(event_name => event_name !== '');

    return <FilterFieldValues
        icon="filter"
        allPossibleValues={allPossibleValues}
        loading={eventsFilterValues.loadingStatus === STATUS_LOADING}
        disabled={status !== STATUS_SUCCESS}
        values={filters['statuses'] || []}
        onChange={(statuses) => dispatch(fetchRequests({ ...filters, statuses }, 1, false)) }
        onOpen={() => dispatch(fetchEventsFilterValues())}
    />;
}