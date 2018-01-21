import React from 'react';
import { Column, Table } from '../../common';
import { ipcMysql } from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class EventsToday extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventsTable: this._populateEventsTable(props.eventsToday)
		};
		this._handleRowClick = this._handleRowClick.bind(this);
	}

	render() {
		const {eventsTable} = this.state;
		return (
			<Column title='Events Today'>
				<p>{Boolean(eventsTable) ?
					'Click an event to start check-in' :
					'No events today. To start check-in, create an event.'
				}</p>
				{Boolean(eventsTable) &&
				<Table id='events-today'>
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
				</Table>
				}
			</Column>
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
}