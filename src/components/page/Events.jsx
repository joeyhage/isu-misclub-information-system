import React from 'react';
import { connect } from 'react-redux';
import { selectView, setActiveEvent, resetActiveEvent, setEventsToday } from '../../actions/reduxActions';
import { EventsCss } from '../../style/Events.css';
import { PageView } from '../common';
import CreateEvent from '../event/CreateEvent';
import EventsToday from '../event/EventsToday';

class Events extends React.Component {

	render() {
		return (
			<PageView rules={EventsCss}>
				<CreateEvent {...this.props}/>
				<EventsToday {...this.props}/>
			</PageView>
		);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}
}

const mapStateToProps = state => ({
	eventId: state.event.eventId,
	eventsToday: state.event.eventsToday,
	eventsTodayNeedUpdating: state.event.eventsTodayNeedUpdating
});

const mapDispatchToProps = dispatch => ({
	selectEventCheckInView: () => dispatch(selectView('check-in')),
	setActiveEvent: ({eventId, eventName}) => dispatch(setActiveEvent(eventId, eventName)),
	resetActiveEvent: () => dispatch(resetActiveEvent()),
	setEventsToday: eventsToday => dispatch(setEventsToday(eventsToday))
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);