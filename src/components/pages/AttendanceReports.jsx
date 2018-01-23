import React from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import { PageView } from '../common';
import EventLookup from './attendance_reports/EventLookup';
import Report from './attendance_reports/Report';
import LookupResults from './attendance_reports/LookupResults';
import { ipcMysql } from '../../actions/ipcActions';
import { AttendanceReportsCss } from '../../style/AttendanceReports.css';

const { ipcRenderer } = window.require('electron');

class AttendanceReports extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventId: props.eventId,
			eventName: props.eventName,
			eventDate: dateFormat('isoDate'),
			lookupResults: null,
			reportData: {}
		};
		this._resetState = this._resetState.bind(this);
		this._setLookupResults = this._setLookupResults.bind(this);
		this._getAttendanceForEvent = this._getAttendanceForEvent.bind(this);
	}

	render() {
		const {eventId, eventName, eventDate, lookupResults, reportData} = this.state;
		return (
			<PageView rules={AttendanceReportsCss}>
				{eventId &&
					<Report event={{eventId, eventName, eventDate}} reportData={reportData}
							onNewSearch={this._resetState}/>
				}
				{!eventId &&
					[
						<EventLookup key='event-lookup' onResults={this._setLookupResults}/>,
						<LookupResults key='lookup-results' events={lookupResults}
									   onEventSelected={this._getAttendanceForEvent}/>
					]
				}
			</PageView>
		);
	}

	_resetState() {
		this.setState({eventId: null, eventName: null, reportData: {}});
	}

	_setLookupResults(events) {
		this.setState({lookupResults: events});
	}

	_getAttendanceForEvent({eventId, eventName, eventDate}) {
		if (eventId) {
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.RETRIEVE_ATTENDANCE, {eventId});
			ipcRenderer.once(ipcMysql.RETRIEVE_ATTENDANCE, (event, reportData, status) => {
				if (status === ipcMysql.SUCCESS) {
					this.setState({eventId, eventName, eventDate, reportData});
				}
			});
		}
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName
});

export default connect(mapStateToProps)(AttendanceReports);