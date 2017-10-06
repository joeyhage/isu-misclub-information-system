import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormGroup, Button } from '../common';
import { isValidInput } from '../../utils/validation';
import { setUserId, setAccessLevel } from '../../actions';
import { ipcMysql } from '../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			netid: '',
			password: '',
			showFormErrors: false
		};
		this._getValidationState = this._getValidationState.bind(this);
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);

		this.style = {
			h5: {
				padding: '15px 2vw 0 2vw'
			}
		};
	}

	render() {
		return (
			<div className='pane-group'>
				<div className='pane padded-more'>
					<h3 style={{padding:'0 4%'}}>Login</h3>
					<form onSubmit={this._handleSubmit} style={{padding:'0 5%'}}>
						<FormGroup id='netid' value={this.state.netid} onChange={this._handleChange}
								   showValidation={this._getValidationState} required autoFocus>
							Net-ID
						</FormGroup>
						<FormGroup type='password' value={this.state.password} onChange={this._handleChange}
								   showValidation={this._getValidationState} required>
							Password
						</FormGroup>
						<div className='form-actions'>
							<Button type='submit' id='login' red>
								Login
							</Button>
						</div>
					</form>
					{this.state.showFormErrors &&
						<h5 style={{color:'rgba(255, 0, 0, 0.69)'}}>Invalid netid or password.</h5>
					}
				</div>
				<div style={{position:'absolute', right:0, bottom:0, left:0, height:'100px'}}>
					<hr style={{borderBottom:'3px groove white', marginBottom: 0}}/>
					<h5 style={{float:'left', width:'70%', textAlign:'left', ...this.style.h5}}>
						ISU MIS Club Check-In System
					</h5>
					<h5 style={{float:'right', width:'30%', textAlign:'right', ...this.style.h5}}>
						&copy; {moment().format('YYYY')} ISU MIS Club
					</h5>
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
			ipcRenderer.send(ipcMysql.RETRIEVE_SQL_DATA, ipcMysql.VERIFY_CREDENTIALS, {netid, password});
			ipcRenderer.once(ipcMysql.VERIFY_CREDENTIALS, (event, auth) => {
				this.setState({showFormErrors: true});
				if (auth && auth.userId && auth.accessLevel) {
					this.props.updateAuthorization(auth);
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

export default connect(undefined, mapDispatchToProps)(Login);