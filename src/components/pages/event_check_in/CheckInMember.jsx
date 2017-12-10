import React from 'react';
import { Button, MemberInfo, Message } from '../../common';
import { isValidInput } from '../../../utils/validation';

export default class CheckInMember extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showCheckInFormErrors: false
		};
		this._getCheckInFormValidationState = this._getCheckInFormValidationState.bind(this);
	}

	render() {
		return (
			<form>
				<MemberInfo member={this.props.member} disabled={this.props.disabled}>
					{!this.props.member.semesters_remaining && this.props.member.free_meeting_used &&
						<Message header='Payment Needed' danger>
							Member has already used free meeting and needs to pay dues
						</Message>
					}
					<div className='field is-horizontal' style={{width:'70%'}}>
						<div className='field-label'>
							{/* Left empty for spacing */}
						</div>
						<div className='field-body'>
							<div className='field is-grouped'>
								<Button id='check-in' info autoFocus>
									Check-In
								</Button>
								<Button id='member-history' primary>
									View History
								</Button>
								<Button id='cancel-member' onClick={this.props.onCancel} black>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</MemberInfo>
			</form>
		);
	}

	_getCheckInFormValidationState(value) {
		return !isValidInput(value) && this.state.showCheckInFormErrors;
	}
}