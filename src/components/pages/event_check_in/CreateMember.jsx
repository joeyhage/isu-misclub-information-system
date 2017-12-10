import React from 'react';
import { Button, MemberInfo, Message } from '../../common';
import { ipcGeneral } from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class CreateMember extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: {
				netid: this.props.netid
			},
			noResults: false
		};
	}

	render() {
		return (
			<div>
				{this.state.noResults &&
					<Message heading='No Results' danger>
						<p>No results were found for Net-ID <span style={{fontStyle:'italic',fontWeight:'bold'}}>{this.props.netid}</span>.</p>
						<p>Please complete the fields below manually.</p>
					</Message>
				}
				<form>
					<MemberInfo member={this.state.member}>
						<div className='field is-horizontal' style={{width:'70%'}}>
							<div className='field-label'>
								{/* Left empty for spacing */}
							</div>
							<div className='field-body'>
								<div className='field is-grouped'>
									<Button id='check-in' info>
										Check-In
									</Button>
									<Button id='cancel-member' onClick={this.props.onCancel} black>
										Cancel
									</Button>
								</div>
							</div>
						</div>
					</MemberInfo>
				</form>
			</div>
		);
	}

	componentWillMount() {
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
}