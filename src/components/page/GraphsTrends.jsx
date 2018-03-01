import React from 'react';
import PageView from '../common/PageView';
import EventLookup from '../event/EventLookup';
import AttendanceHistoryChart from '../highcharts/AttendanceHistoryChart';
import { ipcGeneral, ipcMysql } from '../../actions/ipcActions';
import { GraphsTrendsCss } from '../../style/GraphsTrends.css';

const { ipcRenderer } = window.require('electron');

export default class GraphsTrends extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			attendanceHistory: []
		};
		this._resetState = this._resetState.bind(this);
		this._setAttendanceHistory = this._setAttendanceHistory.bind(this);
	}

	render() {
		const {attendanceHistory} = this.state;
		return (
			<PageView rules={GraphsTrendsCss}>
				{attendanceHistory && attendanceHistory.length ?
					<AttendanceHistoryChart attendanceHistory={attendanceHistory} onReset={this._resetState}/> :
					<EventLookup onSubmit={this._setAttendanceHistory}/>
				}
			</PageView>
		);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	_resetState() {
		this.setState({
			attendanceHistory: []
		});
	}

	_setAttendanceHistory({dateRangeStart, dateRangeEnd, eventName}) {
		return new Promise(resolve => {
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.QUERY_HISTORICAL_EVENTS, {dateRangeStart, dateRangeEnd, eventName});
			ipcRenderer.once(ipcMysql.QUERY_HISTORICAL_EVENTS, (event, attendanceHistory, status) => {
				if (status === ipcGeneral.SUCCESS) {
					this.setState({attendanceHistory});
				}
				resolve();
			});
		});
	}
}