import React, { useEffect, useState, useReducer } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import DateRangePicker from '../common/date-range-picker';
import { performSearch } from '../../service';

// TODO:
//  - replace the input with a div that highlights on focus
//  - render the existing filters as pills, pushing the input to the right
//  - focus the input when a suggestion is selected
//  - filter suggestions by q on the server
//  - remove Go button and automatically update on enter or date change

function reducer(state, action) {
    switch(action.type) {
        case 'set_dates':
            return {
                ...state,
                dates: action.dates
            };

        case 'add_filter': {
            const before = state[action.key] ?? [];
            const after = [...before, action.value];

            return {
                ...state,
                [action.key]: after
            };
        }
        
        case 'remove_filter': {
            const before = state[action.key] ?? [];
            const after = before.filter(v => v !== action.value);

            return {
                ...state,
                [action.key]: after
            };
        }

        default:
            return state;
    }
}

export function NewFilter({ disabled, filters, onSubmit }) {
    const [state, dispatch] = useReducer(reducer, filters);
    const [search, setSearch] = useState('');

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedSuggestion, setHighlightedSuggestion] = useState(0);

    const { dates: { start, end } } = state;

    function onFocus() {
        if(search !== '' && suggestions.length > 0) {
            setHighlightedSuggestion(0);
            setShowSuggestions(true);
        }
    }

    function onBlur() {
        setShowSuggestions(false);
    }

    function onChange(e) {
        setSearch(e.target.value);
    }

    function buildSuggestionMouseEnter(ix) {
        return () => {
            setHighlightedSuggestion(ix);
        }
    }

    function buildSuggestionClick(ix) {
        return () => {
            const { key, value } = suggestions[ix];
            
            dispatch({
                type: 'add_filter',
                key,
                value
            });

            setShowSuggestions(false);
            setHighlightedSuggestion(0);
            setSearch('');
        }
    }

    function buildPillRemove(key, value) {
        return () => {
            const newState = { ...state };
            delete newState[key];

            dispatch({
                type: 'remove_filter',
                key,
                value
            });
        }
    }

    function onKeyDown(e) {
        if(e.key === 'ArrowDown') {
            if(search === '' && suggestions.length === 0) {
                performSearch(search).then(({ results }) => {
                    setSuggestions(results);
                });
            } else if(!showSuggestions && suggestions.length > 0) {
                setHighlightedSuggestion(0);
                setShowSuggestions(true);
            } else if(showSuggestions) {
                const nextHighlightedSuggestion = (highlightedSuggestion + 1) % suggestions.length;
                setHighlightedSuggestion(nextHighlightedSuggestion);
            }
        } else if(e.key === 'ArrowUp') {
            if(showSuggestions) {
                const nextHighlightedSuggestion = highlightedSuggestion - 1;
                setHighlightedSuggestion(nextHighlightedSuggestion >= 0 ? nextHighlightedSuggestion : (suggestions.length - 1));
            }
        } else if(e.key === 'Enter') {
            if(showSuggestions) {
                buildSuggestionClick(highlightedSuggestion)();
            } else if(!search) {
                console.log(state);
                onSubmit(state);
            }
        }
    }

    useEffect(() => {
        const handle = setTimeout(() => {
            if(search !== '') {
                performSearch(search).then(({ results }) => {
                    setSuggestions(results);
                });
            }
        }, 300);

        return () => {
            clearTimeout(handle);
        }
    }, [search]);

    useEffect(() => {
        if(suggestions.length > 0) {
            setShowSuggestions(true);
        }
    }, [suggestions]);

    const filtersToDisplay = Object.entries({ ...state })
        .filter(([key]) => key !== 'dates')
        .flatMap(([key, values]) => values.map(value => [key, value]));

    return (
        <div className="requests-filter panel">
            <div className="standard-filter">
                <div className="date-field">
                    <DateRangePicker
                        onChange={(dates) =>
                            dispatch({ type: 'set_dates', dates })
                        }
                        onEnter={() => {}}
                        start={start}
                        end={end} />
                </div>

                <div className="search-field">
                    <Icon icon="search" className="search-icon" />

                    <div className="input-wrapper">
                        <dl className="pill-wrapper">
                            {filtersToDisplay.map(([key, value]) =>
                                <div className='pill' key={key + value}>
                                    <dt>{key}</dt>
                                    <dd>{value}</dd>
                                    <Icon icon="times" className="clear-icon" onClick={buildPillRemove(key, value)} />
                                </div>
                            )}
                        </dl>

                        <input type="text"
                            className="value"
                            placeholder={filtersToDisplay.length === 0 ? "Search..." : undefined}
                            value={search || ""}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                        />
                    </div>

                    {suggestions.length > 0 && showSuggestions ?
                        <ul className="suggestions panel">
                            {suggestions.map(({ key, value }, ix) =>
                                <li
                                    key={key + value} className={highlightedSuggestion === ix ? 'highlighted' : ''}
                                    onClick={buildSuggestionClick(ix)}
                                    onMouseEnter={buildSuggestionMouseEnter(ix)}
                                >
                                    {key}: {value}
                                </li>
                            )}
                        </ul>
                    : false}
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