import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_FAILED } from '../../constants';
import { fetchCalendars } from '../../redux/actions';

import Loading from '../common/loading';

import './styles/index.scss';

function CalendarEmbed({ calendars }) {
    const url = new URL("https://calendar.google.com/calendar/embed");
    
    url.searchParams.append('mode', 'WEEK');
    url.searchParams.append('hl', 'en_GB');
    url.searchParams.append('showTitle', '0');

    for(const calendar of calendars) {
        url.searchParams.append('src', calendar.id);
    }

    for(const calendar of calendars) {
        url.searchParams.append('color', calendar.colour);
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
    const { status, calendars } = useSelector(({ calendars }) => calendars);

    useEffect(() => {
        dispatch(fetchCalendars());
    }, [dispatch]);

    if(status === STATUS_FAILED) {
        return <span>Error loading calendars</span>;
    }

    if(calendars.length > 0) {
        return <CalendarEmbed calendars={calendars} />;
    }

    return <Loading />;
}