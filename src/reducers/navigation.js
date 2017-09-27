import { SELECT_VIEW } from '../actions'

const initialState = {
	view: 'create-event'
};

const navigation = (state = initialState, action) => {
	switch (action.type) {
		case SELECT_VIEW:
			return {
				...state,
				view: action.view
			};
		default:
			return state;
	}
};

export default navigation;