import { combineReducers } from 'redux';
import navigation from './navigation';
import activeEvent from './activeEvent';
import authorization from './authorization'

export const checkinApp = combineReducers({
	navigation,
	activeEvent,
	authorization
});