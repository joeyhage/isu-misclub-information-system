import React from 'react';
import { InputGroup } from '../common/index';

export class MemberInfo extends React.Component {
	
	render() {
		const {member, disabled, showValidation} = this.props;
		return (
			<div>
				<div className='field is-horizontal'>
					<div className='field-label'>
						<label className='label'>Net-ID</label>
					</div>
					<div className='field-body'>
						{member.netid}
					</div>
				</div>
				<InputGroup id='first_name' value={Boolean(member) && member.first_name} onChange={this.props.onChange}
							disabled={disabled} showValidation={showValidation} horizontal required>
					First
				</InputGroup>
				<InputGroup id='last_name' value={Boolean(member) && member.last_name} onChange={this.props.onChange}
							disabled={disabled} showValidation={showValidation} horizontal required>
					Last
				</InputGroup>
				<InputGroup id='major' value={Boolean(member) && member.major} onChange={this.props.onChange}
							disabled={disabled} horizontal>
					Major
				</InputGroup>
				<div className='field is-horizontal'>
					<div className='field-label is-normal'>
						<label className='label'>Class</label>
					</div>
					<div className='field-body'>
						<div className='field'>
							<div className='control'>
								<div className='select is-fullwidth'>
									<select id='classification' value={Boolean(member) && member.classification}
											onChange={this.props.onChange} disabled={disabled}>
										<option>Freshman</option>
										<option>Sophomore</option>
										<option>Junior</option>
										<option>Senior</option>
										<option>Graduate</option>
										<option>Faculty</option>
										<option>Other</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>
				{this.props.status &&
					<div>
						<hr/>
						<div className='field is-horizontal' style={{margin:'20px 0'}}>
							<div className='field-label'>
								<label className='label'>Status</label>
							</div>
							<div className='field-body'>
								{this._determineMemberStatus()}
							</div>
						</div>
					</div>
				}
				{this.props.children}
			</div>
		);
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