import React from 'react';
import { Button, ButtonGroup, Column, Message } from '../../common';
import { MemberInfo } from '../../member';
import { ipcGeneral } from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class CreateMember extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: {
				netid: props.netid,
				first_name: '',
				last_name: '',
				major: '',
				classification: ''
			},
			noResults: false,
			isLoading: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getDirectoryInfo();
	}

	render() {
		return (
			<div className='columns'>
				<Column is={6}>
					{this.state.noResults &&
						<Message heading='No Results' danger>
							<p>No results were found for Net-ID <span style={{fontStyle:'italic',fontWeight:'bold'}}>
								{this.props.netid}</span>.
							</p>
							<p>Please complete the fields below manually.</p>
						</Message>
					}
					<form onSubmit={this._handleSubmit}>
						<MemberInfo member={this.state.member} onChange={this._handleChange}>
							<ButtonGroup isLoading={this.state.isLoading} horizontal>
								<Button id='check-in' type='submit' info>
									Check-In
								</Button>
								<Button id='cancel-member' onClick={this.props.onCancel} black>
									Cancel
								</Button>
							</ButtonGroup>
						</MemberInfo>
					</form>
				</Column>
			</div>
		);
	}

	_getDirectoryInfo() {
		if (this.props.netid) {
			ipcRenderer.send(ipcGeneral.REQUEST_DIRECTORY_INFO, null, {netid: this.props.netid});
			ipcRenderer.once(ipcGeneral.REQUEST_DIRECTORY_INFO, (event, member) => {
				if (member && member.netid && member.first_name && member.last_name) {
					this.setState({member});
				} else {
					this.setState({noResults: true});
				}
			});
		}
	}

	_handleChange(event) {
		const {target} = event;
		this.setState(prevState => ({
			member: {
				...prevState.member,
				[target.id]: target.value
			}
		}));
	}

	_handleSubmit(event) {
		event.preventDefault();
	}
}