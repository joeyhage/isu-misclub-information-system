module.exports = member => {
	return {
		netid: '',
		first_name: '',
		last_name: '',
		major: '',
		classification: 'Freshman',
		payment: 0,
		...(member ? member : {})
	};
};