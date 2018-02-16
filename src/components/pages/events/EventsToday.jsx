import React from 'react';
import { Column, Table } from '../../common';
import { ipcMysql, ipcGeneral } from '../../../actions/ipcActions';

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
			<Column title='Events Today' style={{paddingLeft:'40px'}}>
				<p>{Boolean(eventsTable) ?
					'Click an event to start check-in.' :
					'No events today. To start check-in, create an event.'
				}</p>
				{Boolean(eventsTable) &&
					<Table id='events-today' style={{marginTop:'20px'}}>
						<thead>
							<tr>
								<th>Name</th>
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
		return events && events.length ? events.map(event => (
			<tr id={event.event_id} key={event.event_id}>
				<td className='event-name'>{event.event_name}</td>
				<td><button className='delete'/></td>
			</tr>
		)) : null;
	}

	_handleRowClick({target}) {
		if (target.className === 'delete') {
			const eventId = target.parentNode.parentNode.id;
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.DELETE_EVENT, {eventId});
			ipcRenderer.once(ipcMysql.DELETE_EVENT, (event, results, status) => {
				if (status === ipcGeneral.SUCCESS) {
					const eventsToday = this.props.eventsToday || [];
					this.setState({
						eventsTable: this._populateEventsTable(eventsToday.filter(event =>
							parseInt(event.event_id, 10) !== parseInt(eventId, 10)
						))
					});
					if (eventId && eventId.toString() === this.props.eventId.toString()) {
						this.props.resetActiveEvent();
					}
				}
			});
		} else {
			const event = {};
			if (target.nodeName === 'TR') {
				event.eventId = target.id;
				event.eventName = target.firstChild.innerHTML;
			} else if (target.className === 'event-name') {
				event.eventId = target.parentNode.id;
				event.eventName = target.innerHTML;
			}
			if (event && event.hasOwnProperty('eventId')) {
				this.props.setActiveEvent(event);
				this.props.selectEventCheckInView();
			}
		}
	}
}