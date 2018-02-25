import React from 'react';
import dateFormat from 'dateformat';
import { connect } from 'react-redux';
import Radium, { Style } from 'radium';
import { InputGroup, Button, Message, ButtonGroup, Column, PageView } from '../common';
import { isValidInput } from '../../utils/validation';
import { updateAuthorization, setEventsToday } from '../../actions/reduxActions';
import { ipcMysql } from '../../actions/ipcActions';
import { LoginCss } from '../../style/Login.css';

const { ipcRenderer } = window.require('electron');

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			netid: '',
			password: '',
			showFormErrors: false,
			isLoading: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getValidationState = this._getValidationState.bind(this);
	}

	render() {
		return (
			<div>
				<Style rules={LoginCss}/>
				<PageView>
					<Column title='Login'>
						<form onSubmit={this._handleSubmit}>
							<InputGroup id='netid' value={this.state.netid} onChange={this._handleChange}
										showErrors={this._getValidationState} required autoFocus>
								Net-ID
							</InputGroup>
							<InputGroup type='password' value={this.state.password} onChange={this._handleChange}
										showErrors={this._getValidationState} required>
								Password
							</InputGroup>
							<ButtonGroup isLoading={this.state.isLoading}>
								<Button type='submit' id='login' info>
									Login
								</Button>
							</ButtonGroup>
						</form>
						{this.state.showFormErrors &&
							<Message header='Error' danger disableDelete>
								Invalid Net-ID or Password
							</Message>
						}
					</Column>
				</PageView>
				<div className='footer columns is-centered is-mobile'>
					<div className='column is-6'>
						<p className='has-text-centered'>ISU MIS Club Information System</p>
						<p className='has-text-centered'>&copy; {dateFormat('yyyy')} ISU MIS Club</p>
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	_handleChange({target}) {
		if (target.id === 'netid') {
			this.setState({netid: target.value});
		} else {
			this.setState({password: target.value});
		}
	}

	_handleSubmit(event) {
		event.preventDefault();
		const {netid, password} = this.state;
		if (isValidInput(netid) && isValidInput(password)) {
			this.setState({showFormErrors: false, isLoading: true});
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.VERIFY_CREDENTIALS, {netid, password});
			ipcRenderer.once(ipcMysql.VERIFY_CREDENTIALS, (event, auth) => {
				if (auth && auth.userId && auth.accessLevel) {
					ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.RETRIEVE_EVENTS_TODAY);
					ipcRenderer.once(ipcMysql.RETRIEVE_EVENTS_TODAY, (event, eventsToday) => {
						this.props.setEventsToday(eventsToday);
						this.props.updateAuthorization(auth);
					});
				} else {
					this.setState({showFormErrors: true, isLoading: false});
				}
			});
		} else {
			this.setState({showFormErrors: true});
		}
	}

	_getValidationState(value) {
		return !isValidInput(value) && this.state.showFormErrors;
	}
}

const mapDispatchToProps = dispatch => ({
	updateAuthorization: authorization => {
		dispatch(updateAuthorization(authorization));
	},
	setEventsToday: eventsToday => {
		dispatch(setEventsToday(eventsToday));
	}
});

export default connect(undefined, mapDispatchToProps)(Radium(Login));