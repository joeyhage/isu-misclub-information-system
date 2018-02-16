import { SET_ACTIVE_EVENT, RESET_ACTIVE_EVENT, SET_EVENTS_TODAY, ADD_REPORT_DATA } from '../actions/reduxActions';

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
				eventName: action.eventName
			};
		case ADD_REPORT_DATA: {
			return {
				...state,
				reportData: action.reportData
			};
		}
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