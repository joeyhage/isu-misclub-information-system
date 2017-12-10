const request = require('request');

exports.requestDirectoryInfo = netid => {
	return new Promise((resolve, reject) => {
		request(`http://info.iastate.edu/individuals/search/${netid}@iastate.edu`, (error, response, body) => {
			if (error) {
				return reject(error);
			}
			if (body.indexOf('<title>Individual Search Results') === -1) {
				resolve(parseDirectoryInfo(netid, body));
			}
			resolve();
		});
	});
};

const parseDirectoryInfo = (netid, body) => {
	if (body) {
		const member = {netid};
		const nameResults = body.match(new RegExp('<div class="wd-l-Content-inner">\\s*<h1>(.{1,20}),\\s(.{1,20})</h1>'));
		if (nameResults && nameResults.length === 3) {
			member.last_name = nameResults[1].replace(/&#039;/g, '\'');
			member.first_name = nameResults[2].replace(/&#039;/g, '\'');
		}

		const majorResults = body.match(new RegExp('Major:</span>\\s*([ a-zA-Z\\(\\)&;-]*)'));
		if (majorResults && majorResults.length === 2) {
			member.major = majorResults[1].replace(/&amp;/g, '&');
		} else {
			const deptResults = body.match(new RegExp('Dept:</span>\\s*([ a-zA-Z\\(\\)&;-]*)'));
			if (deptResults && deptResults.length === 2) {
				member.major = 'Dept: ' + deptResults[1].replace(/&amp;/g, '&');
			}
		}

		const classResults = body.match(new RegExp('Classification:</span>\\s*([ a-zA-Z\\(\\)-]*)'));
		if (classResults && classResults.length === 2) {
			member.classification = classResults[1];
		} else {
			const titleResults = body.match(new RegExp('Title:</span>\\s*([ a-zA-Z\\(\\)-]*)'));
			if (titleResults && titleResults.length === 2) {
				member.classification = 'Faculty';
			}
		}

		if (Object.keys(member) && Object.keys(member).length) {
			return member;
		}
	}
};