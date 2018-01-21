import React from 'react';
import { Column, InputGroup, ButtonGroup, Button } from '../../common';
import dateFormat from 'dateformat';
import { isValidInput } from '../../../utils/validation';
import { ipcMysql } from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class EventLookup extends React.Component {

	constructor(props) {
		super(props);
		const dateRangeStart = new Date();
		dateRangeStart.setMonth(dateRangeStart.getMonth() - 6);
		this.state = {
			dateRangeStart: dateFormat(dateRangeStart, 'isoDate'),
			dateRangeEnd: dateFormat('isoDate'),
			eventName: '',
			showFormErrors: false
		};
		this.initialState = {...this.state};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getFormValidationState = this._getFormValidationState.bind(this);
	}

	render() {
		return (
			<Column title='Event Lookup' style={{paddingRight:'40px'}}>
				<form onSubmit={this._handleSubmit} onReset={this._handleChange}>
					<InputGroup id='date-range-start' value={this.state.dateRangeStart}
								onChange={this._handleChange} type='date'
								showErrors={this._getFormValidationState} horizontal required>
						Range Start
					</InputGroup>
					<InputGroup id='date-range-end' value={this.state.dateRangeEnd}
								onChange={this._handleChange} type='date'
								showErrors={this._getFormValidationState} horizontal required>
						Range End
					</InputGroup>
					<InputGroup id='event-name' value={this.state.eventName} onChange={this._handleChange}
								placeholder='Optional'
								showErrors={this._getFormValidationState} horizontal>
						Event Name
					</InputGroup>
					<ButtonGroup isLoading={this.state.isLoading} horizontal>
						<Button type='submit' info>Lookup</Button>
						<Button type='reset' black>Clear</Button>
					</ButtonGroup>
				</form>
			</Column>
		);
	}

	_handleChange({target}) {
		const propName = {
			'date-range-start': 'dateRangeStart',
			'date-range-end': 'dateRangeEnd',
			'event-name': 'eventName'
		}[target.id];
		if (propName) {
			this.setState({[propName]: target.value});
		} else {
			this.setState(this.initialState);
		}
	}

	_handleSubmit(event) {
		event.preventDefault();
		const {dateRangeStart, dateRangeEnd, eventName} = this.state;
		if (isValidInput(dateRangeStart) && isValidInput(dateRangeEnd)) {
			this.setState({showFormErrors: false});
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.FIND_EVENTS, {dateRangeStart, dateRangeEnd, eventName});
			ipcRenderer.once(ipcMysql.FIND_EVENTS, (event, events) => {
				this.props.onResults(events);
			});
		} else {
			this.setState({showFormErrors: true});
		}
	}

	_getFormValidationState(value) {
		return !isValidInput(value) && this.state.showFormErrors;
	}
}