import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '../common/menu';
import { fetchRequests, fetchFilterValues } from '../../redux/actions';
import { STATUS_LOADING, STATUS_SUCCESS } from '../../constants';

export function FilterFieldValues({ attribute }) {
    const dispatch = useDispatch();
    
    const requests = useSelector(state => state.requests);
    const { filters, filterValues: allFilterValues, status: tableLoadingStatus } = requests;

    const values = filters[attribute] ? filters[attribute] : [];
    const filterValues = allFilterValues[attribute].items;

    const loading = allFilterValues[attribute].loadingStatus === STATUS_LOADING;
    const disabled = tableLoadingStatus !== STATUS_SUCCESS;

    function getUpdatedValues(value) {
        if(values.includes(value)) {
            return values.filter(v => v !== value);
        }

        return [...values, value];
    }

    function onChange(updatedValues) {
        const updatedFilters = { ...filters, [attribute]: updatedValues }; 
        dispatch(fetchRequests(updatedFilters, 1, false));
    }

    function onOpen() {
        dispatch(fetchFilterValues(attribute));
    }

    const label = values.length > 0 ? `(${values.length})` : '';

    return <div className="filter-field">
        <Menu
            alignLeft={true}
            icon="filter"
            className="icon"
            loading={loading}
            onOpen={onOpen}
            options={filterValues.map(({ value, display }) =>
                <React.Fragment>
                    <input
                        type="checkbox"
                        onChange={() => onChange(getUpdatedValues(value))}
                        checked={values.includes(value)}
                        disabled={disabled}
                    ></input>
                    <label>{display}</label>
                </React.Fragment>    
            )}
        />
        {label}
    </div>;
}
