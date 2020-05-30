import { combineReducers } from 'redux';
import requests from './requests';
import lists from './lists';

export default combineReducers({ requests, lists });