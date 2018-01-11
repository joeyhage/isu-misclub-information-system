const isDev = require('electron-is-dev');

class tableNames {

	get tableNames() {
		return {
			is_acl: this.is_acl(),
			is_activity_history: this.is_activity_history(),
			is_admin_history: this.is_admin_history(),
			is_attendance: this.is_attendance(),
			is_event: this.is_event(),
			is_member: this.is_member()
		};
	}

	is_acl() {
		return this.determineTableNameForEnv('is_acl');
	}
	
	is_activity_history() { 
		return this.determineTableNameForEnv('is_activity_history'); 
	}

	is_admin_history() { 
		return this.determineTableNameForEnv('is_admin_history'); 
	}

	is_attendance() { 
		return this.determineTableNameForEnv('is_attendance'); 
	}

	is_event() {
		return this.determineTableNameForEnv('is_event');
	}

	is_member() {
		return this.determineTableNameForEnv('is_member');
	}

	determineTableNameForEnv(table) {
		return isDev ? `${table}_dev` : `${table}`;
	}
}

module.exports = tableNames;