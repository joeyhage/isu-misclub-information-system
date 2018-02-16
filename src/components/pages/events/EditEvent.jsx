import React from 'react';
import {InputGroup, Modal} from '../../common';

export default class EditEvent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			eventName: props.eventName
		};
		this._handleChange = this._handleChange.bind(this);
		this._onSave = this._onSave.bind(this);
	}

	render() {
		const {eventName} = this.state;
		return (
			<Modal title='Edit Event' onSave={this._onSave} onClose={this.props.onClose} footer>
				<form onSubmit={event => {
					event.preventDefault();
					this._onSave();
				}}>
					<InputGroup id='event-name' value={eventName} onChange={this._handleChange}
								showErrors={this._getFormValidationState} placeholder='e.g. MIS Club Career Night'
								required autoFocus>
						Event Name
					</InputGroup>
				</form>
			</Modal>
		);
	}

	_handleChange({target}) {
		this.setState({eventName: target.value});
	}

	_onSave() {
		this.props.onSave(this.state.eventName);
	}
}