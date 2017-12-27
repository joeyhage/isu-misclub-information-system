import { SET_ACTIVE_EVENT, RESET_ACTIVE_EVENT } from '../actions';

const initialState = {
	eventId: '',
	eventName: ''
};

const activeEvent = (state = initialState, action) => {
	switch (action.type) {
		case SET_ACTIVE_EVENT:
			return {
				...state,
				eventId: action.eventId,
				eventName: action.eventName
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