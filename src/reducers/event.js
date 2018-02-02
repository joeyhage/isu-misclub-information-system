import { SET_ACTIVE_EVENT, RESET_ACTIVE_EVENT, SET_EVENTS_TODAY } from '../actions/reduxActions';

const initialState = {
	eventId: '',
	eventName: '',
	eventsToday: [],
	reportData: {}
};

const event = (state = initialState, action) => {
	switch (action.type) {
		case SET_ACTIVE_EVENT:
			return {
				...state,
				eventId: action.eventId,
				eventName: action.eventName,
				reportData: action.reportData
			};
		case SET_EVENTS_TODAY:
			return {
				...state,
				eventsToday: action.eventsToday
			};
		case RESET_ACTIVE_EVENT:
			return {
				...initialState
			};
		default:
			return state;
	}
};

export default event;