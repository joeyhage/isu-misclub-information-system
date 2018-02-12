import React from 'react';
import { Button, ButtonGroup, Column, Message } from '../common/index';
import { isValidInput } from '../../utils/validation';
import { MemberInfo, MemberAttendance, MemberActivity, PaymentRadio } from './index';
import { ipcMysql } from '../../actions/ipcActions';
import { hasMemberInfoChanged } from '../../utils/memberUtil';

const { ipcRenderer } = window.require('electron');

export default class UpdateMember extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: props.member,
			isCheckIn: Boolean(props.eventId),
			showFormErrors: false,
			editing: false,
			isLoading: false,
			activity: [],
			attendance: []
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getFormValidationState = this._getFormValidationState.bind(this);
	}

	render() {
		const {member, editing, isLoading, activity, attendance, isCheckIn} = this.state;
		return (
			<div className='columns'>
				<Column>
					<form onSubmit={this._handleSubmit}>
						<MemberInfo member={member} disabled={!editing} onChange={this._handleChange}
									showErrors={this._getFormValidationState} status>
							<PaymentRadio checked={member.payment} onChange={this._handleChange}/>
							{member.semesters_remaining === 0 && isCheckIn &&
								(member.free_meeting_used ?
									<Message header='Payment Needed' danger>
										Member has already used free meeting and has not yet paid dues.
									</Message> :
									<Message header='Free Meeting' warning>
										If checked in with no payment, member's free meeting will be used.
									</Message>
								)
							}
							<ButtonGroup isLoading={isLoading} horizontal>
								{!editing &&
									(isCheckIn ?
										<Button id='check-in' type='submit' info autoFocus>
											Check-In
										</Button> :
										<Button id='update' type='submit' info autoFocus>
											Update
										</Button>
									)
								}
								<Button id='edit-info' onClick={this._handleChange} primary>
									{editing ? 'Save' : 'Edit Info'}
								</Button>
								<Button id='cancel-member' onClick={this._handleChange} black>
									{editing ? 'Discard' : 'Cancel'}
								</Button>
							</ButtonGroup>
						</MemberInfo>
					</form>
				</Column>
				<Column>
					<MemberActivity>
						{activity}
					</MemberActivity>
					<MemberAttendance>
						{attendance}
					</MemberAttendance>
				</Column>
			</div>
		);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
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
			this.setState({showFormErrors: false, isLoading: true});
			ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.UPDATE_MEMBER, {
				member: {
					...this.state.member,
					isUpdated: isUpdated ? true : hasMemberInfoChanged(this.props.member, this.state.member)
				},
				eventId: this.state.isCheckIn ? this.props.eventId : null
			});
			ipcRenderer.once(ipcMysql.UPDATE_MEMBER, (event, results, status) => {
				if (status === ipcMysql.SUCCESS) {
					this.props.onSubmit(this.state.isCheckIn ?
						`Successfully checked in ${first_name} ${last_name}. Please welcome them to the meeting!` :
						`Successfully updated member, ${first_name} ${last_name}.`
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