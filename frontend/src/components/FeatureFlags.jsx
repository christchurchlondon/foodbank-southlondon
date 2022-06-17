import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFeatureEnabled } from '../redux/actions';
import { FEATURES } from '../features';

function FeatureFlag({ name, enabled }) {
    const dispatch = useDispatch();

    function onChange() {
        dispatch(setFeatureEnabled(name, !enabled));
    }

    return <div>
        <input
            type="checkbox"
            onChange={onChange}
            checked={enabled}
        />
        <label>{name}</label>
    </div>;
}

export default function FeatureFlags() {
    const state = useSelector(({ features }) => features);

    return <React.Fragment>
        {
            Object.entries(FEATURES).map(([name, defaultValue]) =>
                <FeatureFlag
                    key={name}
                    name={name}
                    enabled={state[name] || defaultValue}
                />
            )
        }
    </React.Fragment>;
}