import React from 'react';
import { connect } from 'react-redux';
import Radium, { Style } from 'radium';
import moment from 'moment';
import { Column, InputGroup, Button, ButtonGroup } from '../common/index';
import { selectView, setActiveEvent, resetActiveEvent } from '../../actions/index';
import { isValidInput } from '../../utils/validation';
import { ipcMysql } from '../../actions/ipcActions';
import { CreateEventCss } from '../../style/Events.css.js';

const { ipcRenderer } = window.require('electron');

class Events extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventName: '',
			eventsToday: this._getEventsToday(),
			showFormErrors: false,
			isLoading: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._handleRowClick = this._handleRowClick.bind(this);
		this._getValidationState = this._getValidationState.bind(this);
	}

	render() {
		return (
			<div className='container is-fluid columns' id='page-view'>
				<Style rules={CreateEventCss}/>
				<Column title='Create Event'>
					<form onSubmit={this._handleSubmit} onReset={this._handleChange}>
						<InputGroup id='event-name' value={this.state.eventName} onChange={this._handleChange}
									showValidation={this._getValidationState} placeholder='e.g. MIS Club Career Night'
									required autoFocus>Event Name</InputGroup>
						<ButtonGroup isLoading={this.state.isLoading}>
							<Button type='submit' info>Create</Button>
							<Button type='reset' black>Clear</Button>
						</ButtonGroup>
					</form>
				</Column>
				<Column title='Events Today'>
					<p>
						{Boolean(this.state.eventsToday) ?
							'Click an event to start check-in' :
							'No events today. To start check-in, create an event.'
						}
					</p>
					{Boolean(this.state.eventsToday) &&
						<table className='table is-striped is-hoverable is-fullwidth' id='events-today'>
							<thead>
								<tr>
									<th>Event ID</th>
									<th>Event Name</th>
									<th>Delete?</th>
								</tr>
							</thead>
							<tbody onClick={this._handleRowClick}>
								{this.state.eventsToday}
							</tbody>
						</table>
					}
				</Column>
			</div>
		);
	}

	_getEventsToday() {
		ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.RETRIEVE_EVENTS_TODAY);
		ipcRenderer.once(ipcMysql.RETRIEVE_EVENTS_TODAY, (event, results) => {
			return results ? results.map(result => (
				<tr key={result.event_id}>
					<td className='event-id'>{result.event_id}</td>
					<td className='event-name'>{result.event_name}</td>
					<td><button className='delete'/></td>
				</tr>
			)) : null;
		});
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
			ipcRenderer.once(ipcMysql.DELETE_EVENT, (event, eventId) => {
				this.setState({eventsToday: this._getEventsToday()});
				if (eventId && eventId.toString() === this.props.eventId.toString()) {
					this.props.resetActiveEvent();
				}
			});
		} else {
			const event = {
				eventId: '',
				eventName: ''
			};
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
			this.props.setActiveEvent(event);
			this.props.selectEventCheckInView();
		}
	}

	_getValidationState() {
		return !isValidInput(this.state.eventName) && this.state.showFormErrors;
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId
});

const mapDispatchToProps = dispatch => ({
	selectEventCheckInView: () => dispatch(selectView('check-in')),
	setActiveEvent: ({eventId, eventName, eventDate}) => dispatch(setActiveEvent(eventId, eventName, eventDate)),
	resetActiveEvent: () => dispatch(resetActiveEvent())
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Events));