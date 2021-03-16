import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '../common/menu';
import { STATUS_SUCCESS } from '../../constants';
import { fetchRequests, fetchTimesOfDay } from '../../redux/actions';

export function FilterFieldValues({ allPossibleValues, values, onChange, loading }) {
    function getUpdatedValues(value) {
        if(values.includes(value)) {
            return values.filter(v => v !== value);
        }

        return [...values, value];
    }

    return <div className="filter-field">
        <Menu
            alignLeft={true}
            loading={loading}
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
        loading={timesOfDay.loadingStatus !== STATUS_SUCCESS}
    />;
}

function statusValues(statuses) {
    return statuses.items
        .map(({ name }) => name)
        .filter(name => name !== '');
}

export function FilterStatus() {
    const dispatch = useDispatch();
    const { filters, statuses } = useSelector(state => state.requests);

    return <FilterFieldValues
        allPossibleValues={statusValues(statuses)}
        values={filters['statuses'] || []}
        onChange={(statuses) => dispatch(fetchRequests({ ...filters, statuses }, 1, false)) }
        loading={false}
    />;
}