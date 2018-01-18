import React from 'react';
import { Button, ButtonGroup, Column, Message } from '../../common';
import { isValidInput } from '../../../utils/validation';
import { MemberInfo, MemberAttendance, MemberActivity, PaymentRadio } from '../../member';
import { ipcMysql } from '../../../actions/ipcActions';
import { hasMemberInfoChanged } from '../../../utils/memberUtil';

const { ipcRenderer } = window.require('electron');

export default class CheckInMember extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: props.member,
			showCheckInFormErrors: false,
			editing: false,
			isLoading: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getCheckInFormValidationState = this._getCheckInFormValidationState.bind(this);
	}

	render() {
		return (
			<div className='columns'>
				<Column>
					<form onSubmit={this._handleSubmit}>
						<MemberInfo member={this.state.member} disabled={!this.state.editing} onChange={this._handleChange}
									showValidation={this._getCheckInFormValidationState} status>
							<PaymentRadio checked={this.state.member.payment} onChange={this._handleChange}/>
							{this.state.member.semesters_remaining === 0 && (this.state.member.free_meeting_used ?
									<Message header='Payment Needed' danger>
										Member has already used free meeting and has not yet paid dues.
									</Message> :
									<Message header='Free Meeting' warning>
										If checked in with no payment, member's free meeting will be used.
									</Message>
							)}
							<ButtonGroup isLoading={this.state.isLoading} horizontal>
								{!this.state.editing &&
									<Button id='check-in' type='submit' info autoFocus>
										Check-In
									</Button>
								}
								<Button id='edit-info' onClick={this._handleChange} primary>
									{this.state.editing ? 'Save' : 'Edit Info'}
								</Button>
								<Button id='cancel-member' onClick={this._handleChange} black>
									{this.state.editing ? 'Discard' : 'Cancel'}
								</Button>
							</ButtonGroup>
						</MemberInfo>
					</form>
				</Column>
				<Column>
					<MemberActivity>
						{this.state.activity}
					</MemberActivity>
					<MemberAttendance up>
						{this.state.attendance}
					</MemberAttendance>
				</Column>
			</div>
		);
	}

	componentDidMount() {
		let attendance, activity;
		if (this.state.member) {
			if (this.state.member.attendance) {
				attendance = this.state.member.attendance.map((row, index) => (
					<tr key={index}>
						<td className='event-id'>{row.event_id}</td>
						<td className='event-name'>{row.event_name}</td>
						<td className='event-date'>{row.event_date}</td>
					</tr>
				));
			}
			if (this.state.member.activity) {
				activity = this.state.member.activity.map((row, index) => (
					<tr key={index}>
						<td>{row.activity_type}</td>
						<td>{row.activity_time}</td>
					</tr>
				));
			}
			this.setState({attendance, activity});
		}
	}

	_handleChange(event) {
		const {target} = event;
		if (target.id === 'cancel-member') {
			if (this.state.editing) {
				this.setState({member: this.props.member, editing: false});
			} else {
				this.props.onCancel(event);
			}
		} else if (target.id === 'edit-info') {
			this.setState(prevState => ({
				editing: !prevState.editing
			}));
		} else if (['first_name', 'last_name', 'major', 'classification'].includes(target.id)) {
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
		const {first_name, last_name, major, isUpdated} = this.state.member;
		if (isValidInput(first_name) && isValidInput(last_name) && isValidInput(major)) {
			this.setState({showCheckInFormErrors: false, isLoading: true});
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.CHECK_IN_UPDATE_MEMBER, {
				member: {
					...this.state.member,
					isUpdated: isUpdated ? true : hasMemberInfoChanged(this.props.member, this.state.member)
				},
				eventId: this.props.eventId
			});
			ipcRenderer.once(ipcMysql.CHECK_IN_UPDATE_MEMBER, (event, results) => {
				if (results) {
					this.props.onCheckIn(`Successfully checked in ${first_name} ${last_name}. Please welcome them to the meeting!`);
				} else {
					this.setState({isLoading: false});
				}
			});
		} else {
			this.setState({showCheckInFormErrors: true});
		}
	}

	_getCheckInFormValidationState(value) {
		return !isValidInput(value) && this.state.showCheckInFormErrors;
	}
}
