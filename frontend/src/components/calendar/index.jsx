import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_FAILED } from '../../constants';
import { fetchCalendars } from '../../redux/actions';

import Loading from '../common/loading';

import './styles/index.scss';

function CalendarEmbed({ ids }) {
    const url = new URL("https://calendar.google.com/calendar/embed");
    
    url.searchParams.append('mode', 'WEEK');
    url.searchParams.append('hl', 'en_GB');
    url.searchParams.append('showTitle', '0');

    for(const id of ids) {
        url.searchParams.append('src', id);
    }

    return <iframe
        title='Foodbank Calendar'
        className='calendar-embed'
        src={url.toString()}
        frameBorder='0'
        scrolling='no'
        style={{border: 0}}
    />;
}

export default function Calendar() {
    const dispatch = useDispatch();
    const { status, ids } = useSelector(({ calendars }) => calendars);

    useEffect(() => {
        dispatch(fetchCalendars());
    }, [dispatch]);

    if(status === STATUS_FAILED) {
        return <span>Error loading calendars</span>;
    }

    if(ids.length > 0) {
        return <CalendarEmbed ids={ids} />;
    }

    return <Loading />;
}