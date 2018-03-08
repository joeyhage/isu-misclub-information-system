import React from 'react';
import { Button, InputGroup, Message, ButtonGroup } from '../common/index';
import { isValidInput } from '../../utils/validation';
import { ipcGeneral, ipcMysql } from '../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class MemberSearch extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			netid: '',
			netIdNotFound: null,
			showFormErrors: false,
			isLoading: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getFormValidationState = this._getFormValidationState.bind(this);
	}

	render() {
		return (
			<form onSubmit={this._handleSubmit} onReset={this._handleChange}>
				<InputGroup id='netid' value={this.state.netid} onChange={this._handleChange}
							showErrors={this._getFormValidationState}
							placeholder='e.g. johndoe' style={{width:'25%'}} required autoFocus>
					Net-ID
				</InputGroup>
				{Boolean(this.state.netIdNotFound) ?
					<Message header='Not Found' info onDelete={this._handleChange}>
						<p>Net-ID <span style={{fontStyle:'italic',fontWeight:'bold'}}>
							{this.state.netIdNotFound}
						</span> not found.</p>
						<Button id='create-member' onClick={this._handleChange}
								style={{marginTop:'2%'}} info autoFocus>
							Create Member?
						</Button>
					</Message> :
					<ButtonGroup isLoading={this.state.isLoading}>
						<Button type='submit' info>Search</Button>
						<Button type='reset' black>Clear</Button>
					</ButtonGroup>
				}
			</form>
		);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	_handleChange({target}) {
		if (target.id === 'netid') {
			this.setState({netid: target.value, netIdNotFound: null});
		} else if (target.id === 'create-member') {
			this._getDirectoryInfo();
		} else {
			this.setState({netid: '', netIdNotFound: null, showFormErrors: false});
		}
	}

	_handleSubmit(event) {
		event.preventDefault();
		const {netid} = this.state;
		if (isValidInput(netid)) {
			this.setState({showFormErrors: false, isLoading: true});
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.LOOKUP_NETID, {netid});
			ipcRenderer.once(ipcMysql.LOOKUP_NETID, (event, member) => {
				if (member && member.hasOwnProperty('netid')) {
					this.props.setMember(member);
					this.props.updateMember();
				} else {
					this.setState({netIdNotFound: netid, isLoading: false});
					this.props.setMember({netid});
				}
			});
		} else {
			this.setState({showFormErrors: true});
		}
	}

	_getDirectoryInfo() {
		if (this.state.netIdNotFound) {
			ipcRenderer.send(ipcGeneral.REQUEST_DIRECTORY_INFO, null, {netid: this.state.netIdNotFound});
			ipcRenderer.once(ipcGeneral.REQUEST_DIRECTORY_INFO, (event, member) => {
				if (member && member.netid && member.first_name && member.last_name) {
					this.props.setMember(member);
				} else {
					this.props.setMember({netid: this.state.netIdNotFound});
				}
				this.props.createMember();
			});
		}
	}

	_getFormValidationState(value) {
		return !isValidInput(value) && this.state.showFormErrors;
	}
}