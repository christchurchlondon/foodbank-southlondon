import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '../common/menu';
import { fetchRequests, fetchTimesOfDay } from '../../redux/actions';

export function FilterFieldValues({ allPossibleValues, values, onChange }) {
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
    const { filters, timesOfDay } = useSelector(state => state.requests);

    useEffect(() => {
        dispatch(fetchTimesOfDay());
    }, [dispatch]);

    return <FilterFieldValues
        allPossibleValues={timesOfDay.items}
        values={filters['timeOfDay'] || []}
        onChange={(timeOfDay) => dispatch(fetchRequests({ ...filters, timeOfDay }, 1, false)) }
    />;
}

export function FilterStatus() {
    const dispatch = useDispatch();
    const { filters, statuses } = useSelector(state => state.requests);

    const allPossibleValues = statuses.items
        .map(({ name }) => name)
        .filter(name => name !== '');

    return <FilterFieldValues
        allPossibleValues={allPossibleValues}
        values={filters['statuses'] || []}
        onChange={(statuses) => dispatch(fetchRequests({ ...filters, statuses }, 1, false)) }
    />;
}