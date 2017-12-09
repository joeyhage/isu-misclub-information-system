import { SET_MEMBER, RESET_MEMBER } from '../actions';

const initialState = {
	netid: '',
	firstName: '',
	lastName: '',
	major: '',
	class: '',
	semestersRemaining: '',
	usedFreeMeeting: ''
};

const currentMember = (state = initialState, action) => {
	switch (action.type) {
		case SET_MEMBER:
			return {
				...state,
				...action.member
			};
		case RESET_MEMBER:
			return {
				...initialState
			};
		default:
			return state;
	}
};

export default currentMember;