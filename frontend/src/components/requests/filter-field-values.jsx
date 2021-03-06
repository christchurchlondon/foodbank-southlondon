import React from 'react';
import Menu from '../common/menu';

export default function FilterFieldValues({ label, allPossibleValues, values, onChange }) {
    function getUpdatedValues(value) {
        if(values.includes(value)) {
            return values.filter(v => v !== value);
        }

        return [...values, value];
    }

    let labelWithInfo = label;
    if(values.length === 1) {
        labelWithInfo = `${label} (${values[0]})`;
    } else if(values.length === allPossibleValues.length) {
        labelWithInfo = `${label} (ALL)`
    } else if(values.length > 0) {
        labelWithInfo = `${label} (${values.length})`
    }

    return <div className="filter-field">
        <Menu
            label={labelWithInfo}
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