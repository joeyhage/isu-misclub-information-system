import React from 'react';
import { connect } from 'react-redux';
import Radium, { Style } from 'radium';
import moment from 'moment';
import { selectView, setActiveEvent, resetActiveEvent } from '../../actions/index';
import { isValidInput } from '../../utils/validation';
import { ipcMysql } from '../../actions/ipcActions';
import { CreateEventCss } from '../../style/CreateEvent.css.js';

const { ipcRenderer } = window.require('electron');

class CreateEvent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventName: '',
			eventsToday: [],
			showFormErrors: false,
			today: moment().format('YYYY-MM-DD')
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._handleRowClick = this._handleRowClick.bind(this);
	}

	render() {
		return (
			<div id='page-view'>
				<Style rules={CreateEventCss}/>
				<div className='pane padded-more'>
					<h3>Create Event</h3>
					<hr/>
					<form onSubmit={this._handleSubmit}>
						<div className='form-group'>
							<label htmlFor='event-name'>Event Name</label>
							<input type='text' value={this.state.eventName} onChange={this._handleChange}
								   className={`form-control required ${this._getValidationState()}`}
								   id='event-name' placeholder='e.g. MIS Club Career Night' autoFocus/>
						</div>
						<div className='form-actions'>
							<button type='reset' className='btn btn-form btn-default' onClick={this._handleChange}>
								Clear
							</button>
							<button type='submit' className='btn btn-form btn-primary'>
								Create
							</button>
						</div>
					</form>
				</div>
				<div className='pane padded-more'>
					<h3>Events Today</h3>
					<hr/>
					<p>Click an event to start check-in</p>
					<table className='table-striped' id='events-today'>
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
				</div>
			</div>
		);
	}

	componentWillMount() {
		this._updateEventsToday();
	}

	_updateEventsToday() {
		ipcRenderer.send(ipcMysql.RETRIEVE_SQL_DATA, ipcMysql.RETRIEVE_EVENTS_TODAY);
		ipcRenderer.once(ipcMysql.RETRIEVE_EVENTS_TODAY, (event, results) => {
			const eventsToday = [];
			for (const result of results) {
				eventsToday.push(
					<tr key={result.event_id}>
						<td className='event-id'>{result.event_id}</td>
						<td className='event-name'>{result.event_name}</td>
						<td><span className='icon icon-cancel-squared'/></td>
					</tr>
				);
			}
			this.setState({eventsToday});
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
		this.setState({showFormErrors: true});
		if (isValidInput(this.state.eventName)) {
			const {eventName, today} = this.state;
			ipcRenderer.send(ipcMysql.RETRIEVE_SQL_DATA, ipcMysql.ADD_EVENT, {eventName});
			ipcRenderer.once(ipcMysql.ADD_EVENT, (event, eventId) => {
				this.props.setActiveEvent({eventId, eventName, eventDate: today});
				this.props.selectEventCheckInView();
			});
		}
	}

	_handleRowClick({target}) {
		if (target.className === 'icon icon-cancel-squared') {
			const eventId = target.parentNode.parentNode.firstChild.innerHTML;
			ipcRenderer.send(ipcMysql.RETRIEVE_SQL_DATA, ipcMysql.DELETE_EVENT, {eventId});
			ipcRenderer.once(ipcMysql.DELETE_EVENT, (event, eventId) => {
				this._updateEventsToday();
				if (eventId && eventId.toString() === this.props.eventId.toString()) {
					this.props.resetActiveEvent();
				}
			});
		} else {
			const event = {
				eventId: '',
				eventName: this.state.eventName,
				eventDate: this.state.today
			};
			if (target.nodeName === 'TR') {
				event.eventId = target.firstChild.innerHTML;
			} else if (target.className === 'event-id') {
				event.eventId = target.innerHTML;
			} else if (target.className === 'event-name') {
				event.eventId = target.previousSibling.innerHTML;
			}
			this.props.setActiveEvent(event);
			this.props.selectEventCheckInView();
		}
	}

	_getValidationState() {
		return !isValidInput(this.state.eventName) && this.state.showFormErrors ? 'invalid' : '';
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId
});

const mapDispatchToProps = dispatch => ({
	selectEventCheckInView: () => dispatch(selectView('event-check-in')),
	setActiveEvent: ({eventId, eventName, eventDate}) => dispatch(setActiveEvent(eventId, eventName, eventDate)),
	resetActiveEvent: () => dispatch(resetActiveEvent())
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(CreateEvent));