import React from 'react';
import { Column, Table, Pagination } from '../common/index';

export default class LookupResults extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventsTable: this._populateEventsTable(props.events),
			currentResultsPage: 0
		};
		this._handleRowClick = this._handleRowClick.bind(this);
		this._onPageChange = this._onPageChange.bind(this);
	}

	render() {
		const {eventsTable, currentResultsPage} = this.state;
		return (
			<Column title='Results' style={{paddingLeft:'40px'}}>
				<p>{Boolean(eventsTable) ?
					'Click an event to view attendance' :
					'Search for an event using the Lookup button on the left.'
				}</p>
				{Boolean(eventsTable) &&
					<div>
						<div style={{minHeight:'451px',marginTop:'20px'}}>
							<Table id='lookup-results'>
								<thead>
									<tr>
										<th>Name</th>
										<th>Date</th>
									</tr>
								</thead>
								<tbody onClick={this._handleRowClick}>
									{eventsTable.slice(currentResultsPage * 10, currentResultsPage * 10 + 10)}
								</tbody>
							</Table>
						</div>
						<Pagination currentPage={currentResultsPage} pageCount={Math.ceil(eventsTable.length / 10)}
									onPageChange={this._onPageChange}/>
					</div>
				}
			</Column>
		);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.events !== this.props.events) {
			this.setState({eventsTable: this._populateEventsTable(nextProps.events), currentResultsPage: 0});
		}
	}

	_populateEventsTable(events) {
		return events && events.length ? events.map(event => (
			<tr id={event.event_id} key={event.event_id}>
				<td className='event-name'>{event.event_name}</td>
				<td className='event-date'>{event.event_date}</td>
			</tr>
		)) : null;
	}

	_handleRowClick({target}) {
		let rowEl;
		if (target.nodeName === 'TR') {
			rowEl = target;
		} else {
			rowEl = target.parentNode;
		}
		const eventId = rowEl.id;
		const eventName = rowEl.querySelector('.event-name');
		const eventDate = rowEl.querySelector('.event-date');
		if (eventId && eventName && eventDate) {
			this.props.onEventSelected({
				eventId,
				eventName: eventName.innerHTML,
				eventDate: eventDate.innerHTML
			});
		}
	}

	_onPageChange(nextPage) {
		this.setState({currentResultsPage: nextPage});
	}
}