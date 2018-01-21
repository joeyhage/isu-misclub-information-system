import React from 'react';
import { Column, Table } from '../../common';

export default class LookupResults extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventsTable: this._populateEventsTable(props.events)
		};
	}

	render() {
		const {eventsTable} = this.state;
		return (
			<Column title='Results' style={{paddingLeft:'40px'}}>
				<p>{Boolean(eventsTable) ?
					'Click an event to view attendance' :
					'Search for an event using the Lookup button on the left.'
				}</p>
				{Boolean(eventsTable) &&
					<Table id='lookup-results' style={{marginTop:'20px', maxHeight:'40vh', overflow:'scroll'}}>
						<thead>
							<tr>
								<th>ID</th>
								<th>Name</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{eventsTable}
						</tbody>
					</Table>
				}
			</Column>
		);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.events !== this.props.events) {
			this.setState({eventsTable: this._populateEventsTable(nextProps.events)});
		}
	}

	_populateEventsTable(events) {
		return events ? events.map(event => (
			<tr key={event.event_id}>
				<td className='event-id'>{event.event_id}</td>
				<td className='event-name'>{event.event_name}</td>
				<td className='event-date'>{event.event_date}</td>
			</tr>
		)) : null;
	}
}