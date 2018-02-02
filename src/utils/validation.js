const isValidInput = value => Boolean(value && value.trim());

const isValidEventId = eventId => {
	if (!parseInt(eventId, 10)) {
		throw new Error(`Event ID: ${eventId} is not numeric`);
	}
};

module.exports = {
	isValidInput,
	isValidEventId
};