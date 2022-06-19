import React, { useEffect, useState, useReducer, useRef } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import DateRangePicker from '../common/date-range-picker';
import { performSuggestions } from '../../service';

// TODO MRB:
//  - disallow expiring cache when getting suggestions (to avoid unexpectedly long requests)
//  - reload suggestions once the input is completely cleared but still focused
//  - bump up exact matches on time_of_day (eg typing AM gets you delivery slot AM)
//  - add special case for collection delivery (time_of_day: '' I think?)
//  - put the two above in the default list
//  - score exact matches higher and allow searching by key name (eg finding AM or Time of day, collection centre delivery etc)
//  - add a q parameter that searches everything else, set with the non-pills part of the search
//  - reload suggestions after clear, de-focus, focus again and click down
//  - show suggestions when you click the up arrow
//  - allow free-style search for things not in the suggestions?
//  - human readable key names in pills
//  - debug and fix why the new date filtered search is slow
//  - fix searching by collection centre

function filtersToPills(filters) {
    const pills = [];

    for(const [key, values] of Object.entries(filters)) {
        if(key !== 'dates') {
            for(const value of values) {
                pills.push({ key, value });
            }
        }
    }

    return {
        dates: filters.dates,
        pills
    }
}

function pillsToFilters(pills) {
    const filters = {};

    for(const { key, value } of pills) {
        const before = filters[key] ?? [];
        const after = [...before, value];

        filters[key] = after;
    }

    return filters;
}

function reducer(state, action) {
    switch(action.type) {
        case 'set_dates':
            return {
                ...state,
                dates: action.dates
            };

        case 'add_filter': {
            const { key, value } = action;

            return {
                ...state,
                pills: [...state.pills, { key, value }]
            };
        }
        
        case 'remove_filter': {
            return {
                ...state,
                pills: state.pills.filter(({ key, value }) =>
                    !(action.key === key && action.value === value) 
                )
            }
        }

        default:
            return state;
    }
}

export function NewFilter({ disabled, filters, onSubmit }) {
    const [state, dispatch] = useReducer(reducer, filtersToPills(filters));
    const [search, setSearch] = useState('');

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedSuggestion, setHighlightedSuggestion] = useState(0);

    const inputRef = useRef();

    const { dates: { start, end } } = state;

    function submit() {
        onSubmit({
            dates: state.dates,
            ...pillsToFilters(state.pills)
        });
    }

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
            dispatch({
                type: 'remove_filter',
                key,
                value
            });

            if(inputRef.current) {
                inputRef.current.focus();
            }
        }
    }

    function onKeyDown(e) {
        switch(e.key) {
            case 'ArrowDown':
                if(search === '' && suggestions.length === 0) {
                    performSuggestions(search, start, end).then(({ suggestions }) => {
                        setSuggestions(suggestions);
                    });
                } else if(!showSuggestions && suggestions.length > 0) {
                    setHighlightedSuggestion(0);
                    setShowSuggestions(true);
                } else if(showSuggestions) {
                    const nextHighlightedSuggestion = (highlightedSuggestion + 1) % suggestions.length;
                    setHighlightedSuggestion(nextHighlightedSuggestion);
                }

                break;
            
            case 'ArrowUp':
                if(showSuggestions) {
                    const nextHighlightedSuggestion = highlightedSuggestion - 1;
                    setHighlightedSuggestion(nextHighlightedSuggestion >= 0 ? nextHighlightedSuggestion : (suggestions.length - 1));
                }

                break;
            
            case 'Enter':
                if(showSuggestions) {
                    buildSuggestionClick(highlightedSuggestion)();
                } else if(!search) {
                    submit();
                }

                break;
            
            case 'Backspace':
                if(!search && state.pills.length > 0) {
                    const { key, value } = state.pills[state.pills.length - 1];
                    buildPillRemove(key, value)();
                }

                break;

            default:
                break;
        }
    }

    useEffect(() => {
        const handle = setTimeout(() => {
            if(search !== '') {
                performSuggestions(search, start, end).then(({ suggestions }) => {
                    setSuggestions(suggestions);
                });
            }
        }, 300);

        return () => {
            clearTimeout(handle);
        }
    }, [search, start, end]);

    useEffect(() => {
        if(suggestions.length > 0) {
            setShowSuggestions(true);
        }
    }, [suggestions]);

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
                            {state.pills.map(({ key, value }) =>
                                <div className='pill' key={key + value}>
                                    <dt>{key}</dt>
                                    <dd>{value}</dd>
                                    <Icon icon="times" className="clear-icon" onClick={buildPillRemove(key, value)} />
                                </div>
                            )}
                        </dl>

                        <input type="text"
                            className="value"
                            placeholder={state.pills.length === 0 ? "Search..." : undefined}
                            value={search || ""}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            ref={inputRef}
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
                    onClick={submit}
                    disabled={disabled}
                >
                    Go
                </button>
            </div>
        </div>
    );
}