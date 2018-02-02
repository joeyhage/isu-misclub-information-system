import { combineReducers } from 'redux';
import navigation from './navigation';
import event from './event';
import authorization from './authorization';

export const checkinApp = combineReducers({
	navigation,
	event,
	authorization
});