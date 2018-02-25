import React from 'react';
import { Column, Table } from '../common/index';
import EditEvent from './EditEvent';
import { ipcMysql, ipcGeneral } from '../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class EventsToday extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventsTable: this._populateEventsTable(props.eventsToday),
			editEvent: {}
		};
		this._handleRowClick = this._handleRowClick.bind(this);
		this._onModalSave = this._onModalSave.bind(this);
		this._onModalClose = this._onModalClose.bind(this);
	}

	render() {
		const {eventsTable, editEvent} = this.state;
		return (
			<Column title='Events Today' style={{paddingLeft:'40px'}}>
				{Boolean(eventsTable && eventsTable.length) ?
					<div>
						<p>Click an event to start check-in.</p>
						<Table id='events-today' style={{marginTop:'20px'}}>
							<thead>
								<tr>
									<th>Edit</th>
									<th>Name</th>
									<th>Delete?</th>
								</tr>
							</thead>
							<tbody>
								{eventsTable}
							</tbody>
						</Table>
					</div>:
					<p>No events today. To start check-in, create an event.</p>
				}
				{Boolean(editEvent.eventId && editEvent.eventName) &&
					<EditEvent eventName={editEvent.eventName} onSave={this._onModalSave} onClose={this._onModalClose}/>
				}
			</Column>
		);
	}

	componentDidMount() {
		if (this.props.eventsTodayNeedUpdating) {
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.RETRIEVE_EVENTS_TODAY);
			ipcRenderer.once(ipcMysql.RETRIEVE_EVENTS_TODAY, (event, eventsToday, status) => {
				if (status === ipcGeneral.SUCCESS) {
					this.props.setEventsToday(eventsToday);
				}
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		const {eventsToday} = this.props;
		const nextEventsToday = nextProps.eventsToday;
		const arraysAreEqual = eventsToday.length === nextEventsToday &&
			eventsToday.every((currentValue, index) => currentValue === nextEventsToday[index]);
		if (!arraysAreEqual) {
			this.setState({eventsTable: this._populateEventsTable(nextEventsToday)});
		}
	}

	_populateEventsTable(events) {
		const handleRowClick = this._handleRowClick.bind(this);
		return events && events.length ? events.map(event => (
			<tr data-event-id={event.event_id} data-event-name={event.event_name} key={event.event_id}
				onClick={handleRowClick}>
				<td><span className='icon'><i className='fa fa-edit'/></span></td>
				<td className='event-name'>{event.event_name}</td>
				<td><button className='delete'/></td>
			</tr>
		)) : [];
	}

	_handleRowClick(event) {
		const {target, currentTarget} = event;
		const {eventId, eventName} = currentTarget.dataset;
		if (target.className === 'delete') {
			this._onDelete(eventId);
		} else if (target.nodeName === 'SPAN' || target.nodeName === 'I') {
			this._onEditEvent(eventId, eventName);
		} else {
			if (eventId && eventName) {
				this.props.setActiveEvent({eventId, eventName});
				this.props.selectEventCheckInView();
			}
		}
	}

	_onEditEvent(eventId, eventName) {
		this.setState({editEvent: {eventId, eventName}});
	}

	_onDelete(eventId) {
		ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.DELETE_EVENT, {eventId});
		ipcRenderer.once(ipcMysql.DELETE_EVENT, (event, results, status) => {
			if (status === ipcGeneral.SUCCESS) {
				this.props.setEventsToday(this.props.eventsToday.filter(event =>
					!this._isSameEvent(event.event_id, eventId)
				));
				if (this._isSameEvent(eventId, this.props.eventId)) {
					this.props.resetActiveEvent();
				}
			}
		});
	}

	_onModalSave(eventName) {
		const {eventId} = this.state.editEvent;
		ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.EDIT_EVENT, {eventId, eventName});
		ipcRenderer.once(ipcMysql.EDIT_EVENT, (event, results, status) => {
			if (status === ipcGeneral.SUCCESS) {
				this.props.setEventsToday(this.props.eventsToday.map(event =>
					 this._isSameEvent(event.event_id, eventId) ? {...event, event_name: eventName} : event
				));
				if (this._isSameEvent(eventId, this.props.eventId)) {
					this.props.setActiveEvent({eventId, eventName});
				}
			}
		});
		this.setState({editEvent: {}});
	}

	_onModalClose() {
		this.setState({editEvent: {}});
	}

	_isSameEvent(firstEventId, secondEventId) {
		return parseInt(firstEventId, 10) === parseInt(secondEventId, 10);
	}
}