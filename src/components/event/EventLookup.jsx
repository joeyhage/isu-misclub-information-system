import React from 'react';
import dateFormat from 'dateformat';
import { Column, InputGroup, ButtonGroup, Button } from '../common/index';
import { isValidInput } from '../../utils/validation';
import { ipcGeneral } from '../../actions/ipcActions';

export default class EventLookup extends React.Component {

	constructor(props) {
		super(props);
		const dateRangeStart = new Date();
		dateRangeStart.setFullYear(dateRangeStart.getFullYear() - 1);
		this.state = {
			dateRangeStart: dateFormat(dateRangeStart, 'isoDate'),
			dateRangeEnd: dateFormat('isoDate'),
			eventName: '',
			showFormErrors: false,
			isLoading: false
		};
		this.initialState = {...this.state};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getFormValidationState = this._getFormValidationState.bind(this);
	}

	render() {
		const {dateRangeStart, dateRangeEnd, eventName, isLoading} = this.state;
		return (
			<Column title='Event Lookup' style={{paddingRight:'40px'}}>
				<form id='event-lookup' onSubmit={this._handleSubmit} onReset={this._handleChange}>
					<InputGroup id='date-range-start' value={dateRangeStart}
								onChange={this._handleChange} type='date'
								showErrors={this._getFormValidationState} horizontal required>
						Range Start
					</InputGroup>
					<InputGroup id='date-range-end' value={dateRangeEnd}
								onChange={this._handleChange} type='date'
								showErrors={this._getFormValidationState} horizontal required>
						Range End
					</InputGroup>
					<InputGroup id='event-name' value={eventName} onChange={this._handleChange}
								placeholder='Optional'
								showErrors={this._getFormValidationState} horizontal>
						Event Name
					</InputGroup>
					<ButtonGroup isLoading={isLoading} horizontal>
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

	async _handleSubmit(event) {
		event.preventDefault();
		if (isValidInput(this.state.dateRangeStart) && isValidInput(this.state.dateRangeEnd)) {
			this.setState({showFormErrors: false, isLoading: true});
			const status = await this.props.onSubmit(this.state);
			if (status !== ipcGeneral.SUCCESS) {
				this.setState({isLoading: false});
			}
		} else {
			this.setState({showFormErrors: true});
		}
	}

	_getFormValidationState(value) {
		return !isValidInput(value) && this.state.showFormErrors;
	}
}