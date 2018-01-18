const setMemberDefaults = member => {
	return Object.assign({
		netid: '',
		first_name: '',
		last_name: '',
		major: '',
		classification: 'Freshman',
		payment: 0,
		last_updated: ''
	}, member);
};

const buildMemberFromInfo = info => {
	return [
		info.netid,
		info.first_name,
		info.last_name,
		info.major,
		info.classification
	];
};

const hasMemberInfoChanged = (oldInfo, newInfo) => {
	const oldMember = buildMemberFromInfo(oldInfo);
	const newMember = buildMemberFromInfo(newInfo);
	return !oldMember.every((value, index) => value === newMember[index]);
};

module.exports = {
	setMemberDefaults,
	hasMemberInfoChanged
};