import React from 'react';
import { connect } from 'react-redux';
import { PageView } from '../common';
import EventLookup from './attendance_report/EventLookup';
import Report from './attendance_report/Report';

class AttendanceReport extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventId: props.eventId,
			eventName: props.eventName
		};
	}

	render() {
		return (
			<PageView>
				{this.state.eventId ?
					<Report/> :
					<EventLookup/>
				}
			</PageView>
		);
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName
});

export default connect(mapStateToProps)(AttendanceReport);