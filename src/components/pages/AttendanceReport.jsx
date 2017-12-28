import React from 'react';
import { connect } from 'react-redux';
import { PageView } from '../common';
import EventLookup from './attendance_report/EventLookup';
import Report from './attendance_report/Report';

class AttendanceReport extends React.Component {

	render() {
		return (
			<PageView>
				{this.props.eventId ?
					<Report/> :
					<EventLookup/>
				}
			</PageView>
		);
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName,
	eventDate: state.activeEvent.eventDate
});

export default connect(mapStateToProps)(AttendanceReport);