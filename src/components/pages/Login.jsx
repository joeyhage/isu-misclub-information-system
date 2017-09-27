import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { isValidInput } from '../../utils/validation';
import { setUserId, setAccessLevel } from '../../actions';
import { ipcMysql } from '../../actions/ipcActions';
import '../../style/Login.css';

const { ipcRenderer } = window.require('electron');

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			netid: '',
			password: '',
			showFormErrors: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
	}

	render() {
		return (
			<div className='pane-group'>
				<div className='pane padded-more'>
					<h3>Login</h3>
					<form id='login-form' onSubmit={this._handleSubmit}>
						<div className='form-group'>
							<label htmlFor='netid'>Net-ID</label>
							<input type='text' value={this.state.netid} onChange={this._handleChange}
								   className={`form-control required ${this._setValidationState(this.state.netid)}`}
								   id='netid' autoFocus/>
						</div>
						<div className='form-group'>
							<label htmlFor='password'>Password</label>
							<input type='password' value={this.state.password} onChange={this._handleChange}
								   className={`form-control required ${this._setValidationState(this.state.password)}`}/>
						</div>
						<div className='form-actions'>
							<button type='submit' className='btn btn-form btn-primary red' id='login'>Login</button>
						</div>
					</form>
					{this.state.showFormErrors &&
						<h5 id='invalid'>Invalid netid or password.</h5>
					}
				</div>
				<div id='app-info'>
					<hr/>
					<h5 className='float-left'>ISU MIS Club Check-In System</h5>
					<h5 className='float-right' id='copyright'>&copy; {moment().format('YYYY')} ISU MIS Club</h5>
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

	_setValidationState(value) {
		return !isValidInput(value) && this.state.showFormErrors ? 'invalid' : '';
	}
}

const mapDispatchToProps = dispatch => ({
	updateAuthorization: ({userId, accessLevel}) => {
		dispatch(setUserId(userId));
		dispatch(setAccessLevel(accessLevel));
	}
});

export default connect(undefined, mapDispatchToProps)(Login);