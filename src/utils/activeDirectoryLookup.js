const ldap = require('ldapjs');

exports.verifyExecPassword = async (netid, password) => {
	const client = ldap.createClient({
		url: 'ldaps://windc1.iastate.edu:636',
		baseDN: 'dc=iastate,dc=edu'
	});

	return new Promise((resolve, reject) => {
		client.bind(`${netid}@iastate.edu`, password, error => {
			if (error) {
				return reject(error);
			}
			resolve();
		});
	});
};