import React from 'react';
import { connect } from 'react-redux';
import { selectView, setActiveEvent, resetActiveEvent } from '../../actions/reduxActions';
import { EventsCss } from '../../style/Events.css';
import { PageView } from '../common';
import CreateEvent from './events/CreateEvent';
import EventsToday from './events/EventsToday';

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
	eventsToday: state.event.eventsToday
});

const mapDispatchToProps = dispatch => ({
	selectEventCheckInView: () => dispatch(selectView('check-in')),
	setActiveEvent: ({eventId, eventName}) => dispatch(setActiveEvent(eventId, eventName)),
	resetActiveEvent: () => dispatch(resetActiveEvent())
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);