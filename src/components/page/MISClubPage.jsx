import React from 'react';
import { connect } from 'react-redux';
import { selectView, updateAuthorization } from '../../actions/reduxActions';
import { ipcGeneral } from '../../actions/ipcActions';
import AdminTools from './AdminTools';
import AttendanceReports from './AttendanceReports';
import CheckIn from './CheckIn';
import Events from './Events';
import Finances from './Finances';
import GraphsTrends from './GraphsTrends';
import Help from './Help';
import Members from './Members';
import NavPanel from '../navigation/NavPanel';

const { ipcRenderer } = window.require('electron');

class MISClubPage extends React.Component {

	render() {
		return (
			<div>
				<NavPanel/>
				{this._renderActiveView()}
			</div>
		);
	}

	componentWillMount() {
		ipcRenderer.send(ipcGeneral.CHECK_PRIVILEGES);
		ipcRenderer.once(ipcGeneral.CHECK_PRIVILEGES, (event, isAuthorized) => {
			if (!isAuthorized) {
				this.props.updateAuthorization({userId: '', accessLevel: ''});
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.view === 'admin-tools' && !nextProps.isAdmin) {
			this.props.redirectNonAdmin();
		}
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
	view: state.navigation.view,
	isAdmin: state.authorization.accessLevel === 'exec-admin'
});

const mapDispatchToProps = dispatch => ({
	redirectNonAdmin: () => dispatch(selectView('events')),
	updateAuthorization: authorization => {
		dispatch(updateAuthorization(authorization));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(MISClubPage);