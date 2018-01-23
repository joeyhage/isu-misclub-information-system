import React from 'react';
import { Button, ButtonGroup, Column, Message } from '../common/index';
import { MemberInfo, PaymentRadio } from './index';
import { isValidInput } from '../../utils/validation';
import { ipcMysql } from '../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class CreateMember extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: props.member,
			isCheckIn: Boolean(props.eventId),
			showFormErrors: false,
			isLoading: false,
			didFindMember: this._didFindMember(props.member)
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getFormValidationState = this._getFormValidationState.bind(this);
	}

	render() {
		return (
			<div className='columns'>
				<Column is={6}>
					{!this.state.didFindMember &&
						<Message header={`No Results for Net-ID - ${this.state.member.netid}`} danger>
							<p>Please complete the fields below manually.</p>
						</Message>
					}
					<form onSubmit={this._handleSubmit}>
						<MemberInfo member={this.state.member} onChange={this._handleChange}
									showErrors={this._getFormValidationState} autoFocus>
							<PaymentRadio checked={this.state.member.payment} onChange={this._handleChange}/>
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

	_didFindMember(member) {
		return member && member.first_name && member.last_name;
	}

	_handleChange(event) {
		const {target} = event;
		if (['first_name', 'last_name', 'major', 'classification'].includes(target.id)) {
			this.setState(prevState => ({
				member: {
					...prevState.member,
					[target.id]: target.value
				}
			}));
		} else if (target.name === 'payment') {
			this.setState(prevState => ({
				member: {
					...prevState.member,
					payment: parseInt(target.value, 10)
				}
			}));
		}
	}

	_handleSubmit(event) {
		event.preventDefault();
		const {first_name, last_name, major} = this.state.member;
		if (isValidInput(first_name) && isValidInput(last_name) && isValidInput(major)) {
			this.setState({showFormErrors: false, isLoading: true});
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.CREATE_MEMBER, {
				member: this.state.member,
				eventId: this.state.isCheckIn ? this.props.eventId : null
			});
			ipcRenderer.once(ipcMysql.CREATE_MEMBER, (event, results, status) => {
				if (status === ipcMysql.SUCCESS) {
					this.props.onSubmit(this.state.isCheckIn ?
						`Successfully checked in ${first_name} ${last_name}. Please welcome them to the meeting!` :
						`Successfully created member, ${first_name} ${last_name}.`
					);
				} else {
					this.setState({isLoading: false});
				}
			});
		} else {
			this.setState({showFormErrors: true});
		}
	}

	_getFormValidationState(value) {
		return !isValidInput(value) && this.state.showFormErrors;
	}
}