import { UPDATE_AUTHORIZATION } from '../actions/reduxActions';

const initialState = {
	accessLevel: '',
	userId: ''
};

const authorization = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_AUTHORIZATION:
			return {
				...state,
				userId: action.userId,
				accessLevel: action.accessLevel
			};
		default:
			return state;
	}
};

export default authorization;