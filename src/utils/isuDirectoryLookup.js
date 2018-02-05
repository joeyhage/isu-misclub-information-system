const got = require('got-lite'),
	  unescape = require('unescape-html');

exports.requestDirectoryInfo = async netid => {
	if (process.argv[2] === 'offline') {
		return;
	}
	try {
		const {body} = await got(`https://www.info.iastate.edu/individuals/search/${netid}@iastate.edu`);
		if (body.includes('<title>Individual Search Results')) {
			return;
		}
		return parseDirectoryInfo(netid, body);
	} catch (error) {
		console.log(error.response.body);
	}
};

const parseDirectoryInfo = (netid, body) => {
	if (body) {
		const member = {netid};
		const nameResults = body.match(new RegExp('<div class="wd-l-Content-inner">\\s*<h1>(.+),\\s(.+)</h1>'));
		if (nameResults && nameResults.length === 3) {
			const [, lastName, firstName] = nameResults;
			member.last_name = unescape(lastName);
			member.first_name = unescape(firstName);
		}

		const majorResults = body.match(_buildRegex('Major'));
		if (majorResults && majorResults.length === 2) {
			const [, major] = majorResults;
			member.major = unescape(major);
		} else {
			const deptResults = body.match(_buildRegex('Dept'));
			if (deptResults && deptResults.length === 2) {
				const [, dept] = deptResults;
				member.major = `Dept: ${unescape(dept)}`;
			}
		}

		const classResults = body.match(_buildRegex('Classification'));
		if (classResults && classResults.length === 2) {
			const [, classification] = classResults;
			member.classification = unescape(classification);
		} else {
			const titleResults = body.match(_buildRegex('Title'));
			if (titleResults && titleResults.length === 2) {
				member.classification = 'Faculty';
			}
		}

		if (!member || !Object.keys(member) || !Object.keys(member).length) {
			return;
		}
		return member;
	}
};

const _buildRegex = attributeName => new RegExp(`${attributeName}:</span>\\s*([ a-zA-Z()-]+)`);
