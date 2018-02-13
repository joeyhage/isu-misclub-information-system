import React from 'react';
import { Message } from '../common';

export default class MemberMessages extends React.Component {

	render() {
		const {member, isCheckIn} = this.props;
		return (
			<div>
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
				{member.isUpdated &&
					<Message header='Information Updated' info>
						{member.first_name}'s Information was updated from the directory. Please verify
						the information above.
					</Message>
				}
			</div>
		);
	}
}