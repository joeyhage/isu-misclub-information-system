import React from 'react';
import { connect } from 'react-redux';
import { Column, InputGroup, Button, ButtonGroup, PageView } from '../common';
import { selectView, setActiveEvent, resetActiveEvent } from '../../actions';
import { isValidInput } from '../../utils/validation';
import { ipcMysql } from '../../actions/ipcActions';
import { CreateEventCss } from '../../style/Events.css';

const { ipcRenderer } = window.require('electron');

class Events extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventName: '',
			eventsTable: this._populateEventsTable(props.eventsToday),
			showFormErrors: false,
			isLoading: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._handleRowClick = this._handleRowClick.bind(this);
		this._getValidationState = this._getValidationState.bind(this);
	}

	render() {
		const {eventName, isLoading, eventsTable} = this.state;
		return (
			<PageView rules={CreateEventCss}>
				<Column title='Create Event'>
					<form onSubmit={this._handleSubmit} onReset={this._handleChange}>
						<InputGroup id='event-name' value={eventName} onChange={this._handleChange}
									showValidation={this._getValidationState} placeholder='e.g. MIS Club Career Night'
									required autoFocus>Event Name</InputGroup>
						<ButtonGroup isLoading={isLoading}>
							<Button type='submit' info>Create</Button>
							<Button type='reset' black>Clear</Button>
						</ButtonGroup>
					</form>
				</Column>
				<Column title='Events Today'>
					<p>{Boolean(eventsTable) ?
						'Click an event to start check-in' :
						'No events today. To start check-in, create an event.'
					}</p>
					{Boolean(eventsTable) &&
						<table className='table is-striped is-hoverable is-fullwidth' id='events-today'>
							<thead>
							<tr>
								<th>Event ID</th>
								<th>Event Name</th>
								<th>Delete?</th>
							</tr>
							</thead>
							<tbody onClick={this._handleRowClick}>
								{eventsTable}
							</tbody>
						</table>
					}
				</Column>
			</PageView>
		);
	}

	_populateEventsTable(events) {
		return events ? events.map(event => (
			<tr key={event.event_id}>
				<td className='event-id'>{event.event_id}</td>
				<td className='event-name'>{event.event_name}</td>
				<td><button className='delete'/></td>
			</tr>
		)) : null;
	}

	_handleChange({target}) {
		if (target.id === 'event-name') {
			this.setState({eventName: target.value});
		} else {
			this.setState({eventName: ''});
		}
	}

	_handleSubmit(event) {
		event.preventDefault();
		if (isValidInput(this.state.eventName)) {
			this.setState({showFormErrors: false, isLoading: true});
			const {eventName} = this.state;
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.CREATE_EVENT, {eventName});
			ipcRenderer.once(ipcMysql.CREATE_EVENT, (event, eventId) => {
				this.props.setActiveEvent({eventId, eventName});
				this.props.selectEventCheckInView();
			});
		} else {
			this.setState({showFormErrors: true});
		}
	}

	_handleRowClick({target}) {
		if (target.className === 'delete') {
			const eventId = target.parentNode.parentNode.firstChild.innerHTML;
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.DELETE_EVENT, {eventId});
			ipcRenderer.once(ipcMysql.DELETE_EVENT, () => {
				const eventsToday = this.props.eventsToday || [];
				this.setState({
					eventsTable: this._populateEventsTable(eventsToday.filter(event =>
						parseInt(event.event_id, 10) !== parseInt(eventId, 10)
					))
				});
				if (eventId && eventId.toString() === this.props.eventId.toString()) {
					this.props.resetActiveEvent();
				}
			});
		} else {
			const event = {};
			if (target.nodeName === 'TR') {
				const eventIdTD = target.firstChild;
				event.eventId = eventIdTD.innerHTML;
				event.eventName = eventIdTD.nextSibling.innerHTML;
			} else if (target.className === 'event-id') {
				event.eventId = target.innerHTML;
				event.eventName = target.nextSibling.innerHTML;
			} else if (target.className === 'event-name') {
				event.eventId = target.previousSibling.innerHTML;
				event.eventName = target.innerHTML;
			}
			if (event && event.hasOwnProperty('eventId')) {
				this.props.setActiveEvent(event);
				this.props.selectEventCheckInView();
			}
		}
	}

	_getValidationState() {
		return !isValidInput(this.state.eventName) && this.state.showFormErrors;
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventsToday: state.activeEvent.eventsToday
});

const mapDispatchToProps = dispatch => ({
	selectEventCheckInView: () => dispatch(selectView('check-in')),
	setActiveEvent: ({eventId, eventName}) => dispatch(setActiveEvent(eventId, eventName)),
	resetActiveEvent: () => dispatch(resetActiveEvent())
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);