import React from 'react';
import { connect } from 'react-redux';
import { PageView } from '../common';
import EventLookup from './attendance_reports/EventLookup';
import Report from './attendance_reports/Report';
import LookupResults from './attendance_reports/LookupResults';
import { AttendanceReportsCss } from '../../style/AttendanceReports.css';

class AttendanceReports extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventId: props.eventId,
			eventName: props.eventName,
			lookupResults: []
		};
		this._resetState = this._resetState.bind(this);
		this._setLookupResults = this._setLookupResults.bind(this);
	}

	render() {
		return (
			<PageView rules={AttendanceReportsCss}>
				{this.state.eventId ?
					<Report/> :
					[
						<EventLookup key='event-lookup' onResults={this._setLookupResults}/>,
						<LookupResults key='lookup-results' events={this.state.lookupResults}/>
					]
				}
			</PageView>
		);
	}

	_resetState() {
		this.setState({eventId: null, eventName: null});
	}

	_setLookupResults(events) {
		this.setState({lookupResults: events});
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName
});

export default connect(mapStateToProps)(AttendanceReports);