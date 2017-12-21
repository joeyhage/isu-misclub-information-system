import React from 'react';
import { InputGroup } from '../../common';
import moment from 'moment';
// import {ipcMysql} from '../../../actions/ipcActions';
// import {isValidInput} from '../../../utils/validation';

// const { ipcRenderer } = window.require('electron');

export default class EventLookup extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			dateRangeStart: moment().subtract(6, 'months').format('YYYY-MM-DD'),
			dateRangeEnd: moment().format('YYYY-MM-DD'),
			eventName: ''
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
	}

	render() {
		return (
			<form id='event-lookup' onSubmit={this._handleSubmit} onReset={this._handleChange}>
				<InputGroup id='date-range-start' value={this.state.dateRangeStart} onChange={this._handleChange} type='date'/>
				<InputGroup id='date-range-end' value={this.state.dateRangeEnd} onChange={this._handleChange} type='date'/>
				<InputGroup id='event-name' value={this.state.eventName} onChange={this._handleChange}
							placeholder={'e.g. MIS Club Career Night'} style={{width:'25%'}}>
					Event Name
				</InputGroup>
			</form>
		);
	}

	_handleChange({target}) {
		const targetIdSwitch = {
			'date-range-start': 'dateRangeStart',
			'date-range-end': 'dateRangeEnd',
			'event-name': 'eventName'
		};
		const stateValue = targetIdSwitch[target.id];
		if (stateValue) {
			let value = target.value;
			if (stateValue.includes('date')) {
				console.log(value);
				const dateValues = value.split('-');
				if (dateValues[0].length > 4) {
					console.log(dateValues[0]);
					dateValues[0] = dateValues[0].substring(0, 4);
					console.log(dateValues[0]);
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