import React from 'react';
import { InputGroup } from '../common/index';

export class MemberInfo extends React.Component {
	
	render() {
		const {member, disabled, showValidation, autoFocus} = this.props;
		return (
			<div>
				<div className='field is-horizontal'>
					<div className='field-label'>
						<label className='label'>Net-ID</label>
					</div>
					<div className='field-body'>
						<span style={{padding:'0 10px'}}>
							{member.netid}
						</span>
					</div>
				</div>
				<InputGroup id='first_name' value={member.first_name} onChange={this.props.onChange}
							disabled={disabled} showValidation={showValidation} autoFocus={autoFocus} horizontal required>
					First
				</InputGroup>
				<InputGroup id='last_name' value={member.last_name} onChange={this.props.onChange}
							disabled={disabled} showValidation={showValidation} horizontal required>
					Last
				</InputGroup>
				<InputGroup id='major' value={member.major} onChange={this.props.onChange}
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
									<select className={Boolean(!member.classification) && 'is-danger'} id='classification'
											value={member.classification} onChange={this.props.onChange} disabled={disabled}>
										<option value='Freshman'>Freshman</option>
										<option value='Sophomore'>Sophomore</option>
										<option value='Junior'>Junior</option>
										<option value='Senior'>Senior</option>
										<option value='Graduate'>Graduate</option>
										<option value='Faculty'>Faculty</option>
										<option value='Other'>Other</option>
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