import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import DateRangePicker from '../common/date-range-picker';
import { performSearch } from '../../service';

// TODO:
//  - replace the input with a div that highlights on focus
//  - render the existing filters as pills, pushing the input to the right
//  - focus the input when a suggestion is selected
//  - filter suggestions by q on the server
//  - remove Go button and automatically update on enter or date change

export function NewFilter({ disabled, filters, onSubmit }) {
    const [state, setState] = useState(filters);
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

            setState({
                ...state,
                [key]: value
            });

            setShowSuggestions(false);
            setHighlightedSuggestion(0);
            setSearch('');
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
                        placeholder="Search..."
                        value={search || ""}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                    />

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