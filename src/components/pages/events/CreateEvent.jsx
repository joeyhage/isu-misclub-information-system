import React from 'react';
import { Column, InputGroup, ButtonGroup, Button } from '../../common';
import { isValidInput } from '../../../utils/validation';
import { ipcMysql } from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class CreateEvent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventName: '',
			showFormErrors: false,
			isLoading: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getValidationState = this._getValidationState.bind(this);
	}

	render() {
		const {eventName, isLoading} = this.state;
		return (
			<Column title='Create Event'>
				<form onSubmit={this._handleSubmit} onReset={this._handleChange}>
					<InputGroup id='event-name' value={eventName} onChange={this._handleChange}
								showValidation={this._getValidationState} placeholder='e.g. MIS Club Career Night'
								required autoFocus>Event Name</InputGroup>
					<ButtonGroup isLoading={isLoading}>
						<Button type='submit' info>Create</Button>
						<Button type='reset' black>Clear</Button>
					</ButtonGroup>
				</form>
			</Column>
		);
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
		if (isValidInput(this.state.eventName)) {
			this.setState({showFormErrors: false, isLoading: true});
			const {eventName} = this.state;
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.CREATE_EVENT, {eventName});
			ipcRenderer.once(ipcMysql.CREATE_EVENT, (event, eventId) => {
				this.props.setActiveEvent({eventId, eventName});
				this.props.selectEventCheckInView();
			});
		} else {
			this.setState({showFormErrors: true});
		}
	}

	_getValidationState() {
		return !isValidInput(this.state.eventName) && this.state.showFormErrors;
	}
}