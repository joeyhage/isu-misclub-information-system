export const SELECT_VIEW = 'SELECT_VIEW';
export const selectView = view => ({
	type: SELECT_VIEW,
	view
});

export const SET_ACTIVE_EVENT = 'SET_ACTIVE_EVENT';
export const setActiveEvent = (eventId, eventName, eventDate) => ({
	type: SET_ACTIVE_EVENT,
	eventId,
	eventName,
	eventDate
});

export const RESET_ACTIVE_EVENT = 'RESET_ACTIVE_EVENT';
export const resetActiveEvent = () => ({
	type: RESET_ACTIVE_EVENT
});

export const SET_ACCESS_LEVEL = 'SET_ACCESS_LEVEL';
export const setAccessLevel = accessLevel => ({
	type: SET_ACCESS_LEVEL,
	accessLevel
});

export const SET_USER_ID = 'SET_USER_ID';
export const setUserId = userId => ({
	type: SET_USER_ID,
	userId
});

export const SET_CURRENT_MEMBER = 'SET_CURRENT_MEMBER';
export const setCurrentMember = member => ({
	type: SET_CURRENT_MEMBER,
	member
});

export const RESET_CURRENT_MEMBER = 'RESET_MEMBER';
export const resetCurrentMember = () => ({
	type: RESET_CURRENT_MEMBER
});