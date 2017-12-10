const ActiveDirectory = require('activedirectory');

const config = {
	url: 'ldaps://windc1.iastate.edu:636',
	baseDN: 'dc=iastate,dc=edu'
};

exports.verifyExecPassword = async (netid, password) => {
	const ad = new ActiveDirectory(config);

	return new Promise((resolve, reject) => {
		ad.authenticate(`${netid}@iastate.edu`, password, (error, auth) => {
			if (error && error['lde_message'].indexOf('AcceptSecurityContext') === -1) {
				return reject(new Error(error));
			}
			resolve(auth);
		});
	});
};