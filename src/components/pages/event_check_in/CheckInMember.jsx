import React from 'react';
import { Button, ButtonGroup, Message } from '../../common';
import { isValidInput } from '../../../utils/validation';
import { MemberInfo, MemberAttendance, MemberActivity } from '../../member';

export default class CheckInMember extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: props.member,
			showCheckInFormErrors: false,
			editing: false,
			attendance: props.member.attendance.map((row, index) => (
				<tr key={index}>
					<td className='event-id'>{row.event_id}</td>
					<td className='event-name'>{row.event_name}</td>
					<td className='event-date'>{row.event_date}</td>
				</tr>
			)),
			activity: props.member.activity.map((row, index) => (
				<tr key={index}>
					<td>{row.activity_type}</td>
					<td>{row.activity_time}</td>
				</tr>
			)),
			isLoading: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getCheckInFormValidationState = this._getCheckInFormValidationState.bind(this);
	}

	render() {
		return (
			<div className='columns'>
				<div className='column is-6'>
					<form onSubmit={this._handleSubmit}>
						<MemberInfo member={this.state.member} disabled={!this.state.editing} onChange={this._handleChange}>
							{!this.state.member.semesters_remaining && this.state.member.free_meeting_used &&
								<Message header='Payment Needed' danger>
									Member has already used free meeting and needs to pay dues.
								</Message>
							}
							<ButtonGroup isLoading={this.state.isLoading} horizontal>
								{!this.state.editing &&
									<Button id='check-in' type='submit' info autoFocus>
										Check-In
									</Button>
								}
								<Button id='edit-info' onClick={this._handleChange} primary>
									{!this.state.editing ? 'Edit Info' : 'Save'}
								</Button>
								<Button id='cancel-member' onClick={this._handleChange} black>
									{!this.state.editing ? 'Cancel' : 'Discard'}
								</Button>
							</ButtonGroup>
						</MemberInfo>
					</form>
				</div>
				<div className='column is-6'>
					<MemberAttendance up>
						{this.state.attendance}
					</MemberAttendance>
					<MemberActivity up>
						{this.state.activity}
					</MemberActivity>
				</div>
			</div>
		);
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
		}
	}

	_handleSubmit(event) {
		event.preventDefault();
	}

	_getCheckInFormValidationState(value) {
		return !isValidInput(value) && this.state.showCheckInFormErrors;
	}
}