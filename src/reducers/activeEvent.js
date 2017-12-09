import { SET_ACTIVE_EVENT, RESET_ACTIVE_EVENT } from '../actions';

const initialState = {
	eventId: '10006',
	eventName: 'Kingland Systems',
	eventDate: '2017-08-30'
};

const activeEvent = (state = initialState, action) => {
	switch (action.type) {
		case SET_ACTIVE_EVENT:
			return {
				...state,
				eventId: action.eventId,
				eventName: action.eventName,
				eventDate: action.eventDate
			};
		case RESET_ACTIVE_EVENT:
			return {
				...initialState
			};
		default:
			return state;
	}
};

export default activeEvent;