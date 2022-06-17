import { combineReducers } from 'redux';
import requests from './requests';
import lists from './lists';
import calendars from './calendars';
import features from './features';

export default combineReducers({ requests, lists, calendars, features });