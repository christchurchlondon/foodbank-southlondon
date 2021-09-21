import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_FAILED } from '../../constants';
import { fetchCalendars } from '../../redux/actions';

import Loading from '../common/loading';

import './styles/index.scss';

function today() {
    const now = new Date();
    const year = now.getFullYear();
    
    // months are zero-based
    let month = '' + (now.getMonth() + 1);
    if(month.length === 1) {
        month = '0' + month;
    }

    // horrible horrible JS API for getting the day of the month
    let day = '' + now.getDate();
    if(day.length === 1) {
        day = '0' + day;
    }

    return year + month + day;
}

function CalendarEmbed({ calendars }) {
    const url = new URL("https://calendar.google.com/calendar/embed");
    
    url.searchParams.append('hl', 'en_GB');
    url.searchParams.append('showTitle', '0');

    for(const calendar of calendars) {
        url.searchParams.append('src', calendar.id);
    }

    for(const calendar of calendars) {
        url.searchParams.append('color', calendar.colour);
    }

    // weeks start on Monday
    url.searchParams.append('wkst', '2');

    // default to showing a single day view of today
    url.searchParams.append('mode', 'day');
    url.searchParams.append('dates', `${today()}/${today()}`);

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