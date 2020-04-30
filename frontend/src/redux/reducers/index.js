import { combineReducers } from 'redux';
import header from './header';
import requests from './requests';

export default combineReducers({ header, requests });