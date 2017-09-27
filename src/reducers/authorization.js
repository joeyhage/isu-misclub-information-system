import { SET_ACCESS_LEVEL, SET_USER_ID } from '../actions';

const initialState = {
	accessLevel: 'test',
	userId: 'test'
};

const authorization = (state = initialState, action) => {
	switch (action.type) {
		case SET_ACCESS_LEVEL:
			return {
				...state,
				accessLevel: action.accessLevel
			};
		case SET_USER_ID:
			return {
				...state,
				userId: action.userId
			};
		default:
			return state;
	}
};

export default authorization;