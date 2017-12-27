import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { InputGroup, Button, Message, ButtonGroup, Column } from '../common';
import { isValidInput } from '../../utils/validation';
import { setUserId, setAccessLevel } from '../../actions';
import { ipcMysql } from '../../actions/ipcActions';
import Radium, { Style } from 'radium';
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
				<div className='container is-fluid columns' id='page-view'>
					<Column title='Login'>
						<form onSubmit={this._handleSubmit}>
							<InputGroup id='netid' value={this.state.netid} onChange={this._handleChange}
										showValidation={this._getValidationState} required autoFocus>
								Net-ID
							</InputGroup>
							<InputGroup type='password' value={this.state.password} onChange={this._handleChange}
										showValidation={this._getValidationState} required>
								Password
							</InputGroup>
							<ButtonGroup isLoading={this.state.isLoading}>
								<Button type='submit' id='login' info>
									Login
								</Button>
							</ButtonGroup>
						</form>
						{this.state.showFormErrors &&
							<Message header='Error' danger>
								Invalid Net-ID or Password
							</Message>
						}
					</Column>
				</div>
				<div className='footer columns is-mobile'>
					<div className='column'>
						ISU MIS Club Check-In System
					</div>
					<div className='column has-text-right'>
						&copy; {moment().format('YYYY')} ISU MIS Club
					</div>
				</div>
			</div>
		);
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
					this.props.updateAuthorization(auth);
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
	updateAuthorization: ({userId, accessLevel}) => {
		dispatch(setUserId(userId));
		dispatch(setAccessLevel(accessLevel));
	}
});

export default connect(undefined, mapDispatchToProps)(Radium(Login));