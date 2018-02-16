const fs = require('fs'),
	os = require('os');

const formatAttendanceData = data => {
	const formatted = data.map(member =>
		`"${member.netid}@iastate.edu",` +
		`"${member.last_name ? member.last_name : ''}, ${member.first_name ? member.first_name : ''}",` +
		`"${member.major}",` +
		`"${member.classification}"`
	);
	formatted.unshift('"Iowa State Email", "Name", "Major", "Classification"');
	return formatted.join(os.EOL);
};

const writeCsv = (filename, data) => {
	return new Promise((resolve, reject) => {
		const formattedData = formatAttendanceData(data);
		fs.writeFile(filename, formattedData, error => {
			if (error) {
				return reject(error);
			}
			resolve();
		});
	});
};

module.exports = {
	writeCsv
};