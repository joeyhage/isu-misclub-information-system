import React from 'react';
import { connect } from 'react-redux';
import AdminTools from './AdminTools';
import AttendanceReports from './AttendanceReports';
import CheckIn from './CheckIn';
import Events from './Events';
import Finances from './Finances';
import GraphsTrends from './GraphsTrends';
import Help from './Help';
import Members from './Members';
import NavPanel from '../navigation/NavPanel';

class MISClubPage extends React.Component {

	render() {
		return (
			<div>
				<NavPanel/>
				{this._renderActiveView()}
			</div>
		);
	}

	_renderActiveView() {
		return {
			'events': <Events/>,
			'check-in': <CheckIn/>,
			'attendance-reports': <AttendanceReports/>,
			'members': <Members/>,
			'graphs': <GraphsTrends/>,
			'finances': <Finances/>,
			'admin-tools': <AdminTools/>,
			'help': <Help/>
		}[this.props.view];
	}
}

const mapStateToProps = state => ({
	view: state.navigation.view
});

export default connect(mapStateToProps)(MISClubPage);