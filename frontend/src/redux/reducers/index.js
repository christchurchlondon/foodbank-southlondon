import { combineReducers } from 'redux';
import header from './header';
import requests from './requests';
import lists from './lists';

export default combineReducers({ header, requests, lists });