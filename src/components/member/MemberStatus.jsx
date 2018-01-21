import React from 'react';

export default class MemberStatus extends React.Component {

	render() {
		return this.props.status ? (
			<div>
				<div className='field is-horizontal' style={{margin:'20px 0'}}>
					<div className='field-label'>
						<label className='label'>Status</label>
					</div>
					<div className='field-body'>
						{this._determineMemberStatus()}
					</div>
				</div>
			</div>
		) : null;
	}

	_determineMemberStatus() {
		const {semesters_remaining, free_meeting_used} = this.props.member;
		switch (semesters_remaining) {
			case 2:
				return 'Current Member | 2 Semesters Remaining';
			case 1:
				return 'Current Member | 1 Semester Remaining';
			default:
				return `Not a Member | Free Meeting ${Boolean(free_meeting_used) ? 'Used' : 'Unused'}`;
		}
	}
}