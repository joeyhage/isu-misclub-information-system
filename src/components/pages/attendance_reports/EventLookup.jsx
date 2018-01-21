import React from 'react';
import {Column, InputGroup} from '../../common';
import dateFormat from 'dateformat';
// import {ipcMysql} from '../../../actions/ipcActions';
// import {isValidInput} from '../../../utils/validation';

// const { ipcRenderer } = window.require('electron');

export default class EventLookup extends React.Component {

	constructor(props) {
		super(props);
		const dateRangeStart = new Date();
		dateRangeStart.setMonth(dateRangeStart.getMonth() - 6);
		this.state = {
			dateRangeStart: dateFormat(dateRangeStart, 'isoDate'),
			dateRangeEnd: dateFormat('isoDate'),
			eventName: ''
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
	}

	render() {
		return (
			<Column title='Event Lookup'>
				<form onSubmit={this._handleSubmit} onReset={this._handleChange}>
					<InputGroup id='date-range-start' value={this.state.dateRangeStart} onChange={this._handleChange} type='date'/>
					<InputGroup id='date-range-end' value={this.state.dateRangeEnd} onChange={this._handleChange} type='date'/>
					<InputGroup id='event-name' value={this.state.eventName} onChange={this._handleChange}
								placeholder={'e.g. MIS Club Career Night'}>
						Event Name
					</InputGroup>
				</form>
			</Column>
		);
	}

	_handleChange({target}) {
		const stateValue = {
			'date-range-start': 'dateRangeStart',
			'date-range-end': 'dateRangeEnd',
			'event-name': 'eventName'
		}[target.id];
		if (stateValue) {
			let value = target.value;
			if (stateValue.includes('date')) {
				const dateValues = value.split('-');
				if (dateValues[0].length > 4) {
					dateValues[0] = dateValues[0].substring(0, 4);
					value = dateValues.join('-');
				}
			}
			this.setState({[stateValue]: value});
		}
	}

	_handleSubmit(event) {
		event.preventDefault();
		// const {netid} = this.state;
		// if (isValidInput(netid)) {
		// 	this.setState({showMemberLookupFormErrors: false});
		// 	ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.LOOKUP_NETID, {netid});
		// 	ipcRenderer.once(ipcMysql.LOOKUP_NETID, (event, member) => {
		// 		if (member && member[0] && member[0][0] && member[0][0].netid) {
		// 			this.setState({notFound: false});
		// 			this.props.setMember({
		// 				...member[0][0],
		// 				attendance: member[1],
		// 				activity: member[2]
		// 			});
		// 		} else {
		// 			this.setState({notFound: netid});
		// 			this.props.setMember({});
		// 		}
		// 	});
		// } else {
		// 	this.setState({showMemberLookupFormErrors: true});
		// }
	}
}