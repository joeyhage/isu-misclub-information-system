import React from 'react';
import { Button, InputGroup, Message } from '../../common';
import { isValidInput } from '../../../utils/validation';
import { ipcMysql } from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class MemberLookup extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			netid: '',
			notFound: false,
			showMemberLookupFormErrors: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getMemberLookupFormValidationState = this._getMemberLookupFormValidationState.bind(this);
	}

	render() {
		return (
			<form id='member-lookup' onSubmit={this._handleSubmit} onReset={this._handleChange}>
				<InputGroup id='netid' value={this.state.netid} onChange={this._handleChange}
							showValidation={this._getMemberLookupFormValidationState}
							placeholder={'e.g. johndoe'} style={{width:'25%'}} required autoFocus>
					Net-ID
				</InputGroup>
				{this.state.notFound ?
					<Message header='Not Found' info onDelete={this._handleChange}>
						<p>Net-ID <span style={{fontStyle:'italic',fontWeight:'bold'}}>{this.state.notFound}</span> not found.</p>
						<Button id='create-member' onClick={this._handleChange}
								style={{marginTop:'2%'}} info autoFocus>
							Create Member?
						</Button>
					</Message> :
					<div className='field is-grouped'>
						<Button type='submit' info>Lookup</Button>
						<Button type='reset' black>Clear</Button>
					</div>
				}
			</form>
		);
	}

	_handleChange({target}) {
		if (target.id === 'netid') {
			this.setState({netid: target.value});
		} else if (target.id === 'member-lookup') {
			this.setState({netid: ''});
		} else if (target.id === 'create-member') {
			this.props.onCreateMember(this.state.netid);
		} else if (target.className === 'delete') {
			this.setState({notFound: false, netid: ''});
		}
	}

	_handleSubmit(event) {
		event.preventDefault();
		const {netid} = this.state;
		if (isValidInput(netid)) {
			this.setState({showMemberLookupFormErrors: false});
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.LOOKUP_NETID, {netid});
			ipcRenderer.once(ipcMysql.LOOKUP_NETID, (event, member) => {
				if (member) {
					this.setState({notFound: false});
					this.props.setMember(member);
				} else {
					this.setState({notFound: netid});
					this.props.setMember({});
				}
			});
		} else {
			this.setState({showMemberLookupFormErrors: true});
		}
	}

	_getMemberLookupFormValidationState(value) {
		return !isValidInput(value) && this.state.showMemberLookupFormErrors;
	}
}