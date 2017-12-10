import { SET_CURRENT_MEMBER, RESET_CURRENT_MEMBER } from '../actions';

const initialState = {
	netid: '',
	first_name: '',
	last_name: '',
	major: '',
	classification: '',
	semesters_remaining: '',
	free_meeting_used: ''
};

const currentMember = (state = initialState, action) => {
	switch (action.type) {
		case SET_CURRENT_MEMBER:
			return {
				...state,
				...action.member
			};
		case RESET_CURRENT_MEMBER:
			return {
				...initialState
			};
		default:
			return state;
	}
};

export default currentMember;