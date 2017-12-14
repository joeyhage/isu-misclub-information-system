import React from 'react';
import { Button, MemberInfo, Message, Card } from '../../common';
import { isValidInput } from '../../../utils/validation';

export default class CheckInMember extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: props.member,
			showCheckInFormErrors: false,
			disableEdit: true,
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
			))
		};
		this._getCheckInFormValidationState = this._getCheckInFormValidationState.bind(this);
		this._handleChange = this._handleChange.bind(this);
	}

	render() {
		return (
			<div className='columns'>
				<div className='column is-6'>
					<form>
						<MemberInfo member={this.state.member} disabled={this.state.disableEdit} onChange={this._handleChange}>
							{!this.state.member.semesters_remaining && this.state.member.free_meeting_used &&
								<Message header='Payment Needed' danger>
									Member has already used free meeting and needs to pay dues
								</Message>
							}
							<div className='field is-horizontal'>
								<div className='field-label'>
									{/* Left empty for spacing */}
								</div>
								<div className='field-body'>
									<div className='field is-grouped'>
										{this.state.disableEdit &&
											<Button id='check-in' info autoFocus>
												Check-In
											</Button>
										}
										<Button id='edit-info' onClick={this._handleChange} primary>
											{this.state.disableEdit ? 'Edit Info' : 'Save'}
										</Button>
										<Button id='cancel-member' onClick={this._handleChange} black>
											{this.state.disableEdit ? 'Cancel' : 'Discard'}
										</Button>
									</div>
								</div>
							</div>
						</MemberInfo>
					</form>
				</div>
				<div className='column is-6'>
					<Card title='Attendance' up>
						<table className='table is-striped is-hoverable is-fullwidth' id='attendance'>
							<thead>
								<tr>
									<th>Event ID</th>
									<th>Event Name</th>
									<th>Event Date</th>
								</tr>
							</thead>
							<tbody>
								{this.state.attendance}
							</tbody>
						</table>
					</Card>
					<Card title='Activity' up>
						<table className='table is-striped is-hoverable is-fullwidth' id='activity'>
							<thead>
								<tr>
									<th>Type</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								{this.state.activity}
							</tbody>
						</table>
					</Card>
				</div>
			</div>
		);
	}

	_handleChange(event) {
		const {target} = event;
		if (target.id === 'cancel-member') {
			if (this.state.disableEdit) {
				this.props.onCancel(event);
			} else {
				this.setState({member: this.props.member, disableEdit: true});
			}
		} else if (target.id === 'edit-info') {
			this.setState(prevState => ({
				disableEdit: !prevState.disableEdit
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

	_getCheckInFormValidationState(value) {
		return !isValidInput(value) && this.state.showCheckInFormErrors;
	}
}