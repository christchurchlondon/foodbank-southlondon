import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '../common/menu';
import { fetchRequests, fetchTimeOfDayFilterValues } from '../../redux/actions';
import { STATUS_LOADING } from '../../constants';

export function FilterFieldValues({ allPossibleValues, values, onChange, onOpen, loading }) {
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
    const { filters, timeOfDayFilterValues } = useSelector(state => state.requests);

    return <FilterFieldValues
        loading={timeOfDayFilterValues.loadingStatus === STATUS_LOADING}
        allPossibleValues={timeOfDayFilterValues.items}
        values={filters['timeOfDay'] || []}
        onChange={(timeOfDay) => dispatch(fetchRequests({ ...filters, timeOfDay }, 1, false)) }
        onOpen={() => dispatch(fetchTimeOfDayFilterValues())}
    />;
}

export function FilterStatus() {
    const dispatch = useDispatch();
    const { filters, statuses } = useSelector(state => state.requests);

    const allPossibleValues = statuses.items
        .map(({ name }) => name)
        .filter(name => name !== '');

    return <FilterFieldValues
        icon="filter"
        allPossibleValues={allPossibleValues}
        values={filters['statuses'] || []}
        onChange={(statuses) => dispatch(fetchRequests({ ...filters, statuses }, 1, false)) }
    />;
}