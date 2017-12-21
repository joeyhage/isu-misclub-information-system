import React from 'react';
import { InputGroup } from '../common/index';

export class MemberInfo extends React.Component {
	
	render() {
		const {member, disabled} = this.props;
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
							disabled={disabled} horizontal>
					First Name
				</InputGroup>
				<InputGroup id='last_name' value={Boolean(member) && member.last_name} onChange={this.props.onChange}
							disabled={disabled} horizontal>
					Last Name
				</InputGroup>
				<InputGroup id='major' value={Boolean(member) && member.major} onChange={this.props.onChange}
							disabled={disabled} horizontal>
					Major|Dept
				</InputGroup>
				<div className='field is-horizontal'>
					<div className='field-label'>
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
				{disabled && [
					<div className='field is-horizontal' key={1}>
						<div className='field-label'>
							<label className='label'>Semesters Paid</label>
						</div>
						<div className='field-body'>
							{member.semesters_remaining}
						</div>
					</div>,
					<div className='field is-horizontal' key={2}>
						<div className='field-label'>
							<label className='label'>Used Free Meeting</label>
						</div>
						<div className='field-body'>
							{Boolean(member.free_meeting_used) ? 'Yes' : 'No'}
						</div>
					</div>
				]}
				{this.props.children}
				{/*<PaymentRadios checked={this.props.payment}/>*/}
			</div>
		);
	}
}

// const PaymentRadios = props => {
// 	const {checked} = props;
// 	return (
// 		<div className='field is-horizontal' >
// 			<div className='field-label'>
// 				<label className='label'>Payment</label>
// 			</div>
// 			<div className='field-body'>
// 				<div className='field'>
// 					<div className='control'>
// 						<label className='radio'>
// 							<input type='radio' name='payment' value='2' checked={checked === 2}/> 2 Semesters
// 						</label>
// 						<label className='radio'>
// 							<input type='radio' name='payment' value='1' checked={checked === 1}/> 1 Semester
// 						</label>
// 						<label className='radio'>
// 							<input type='radio' name='payment' value='0' checked={checked === 0}/> No Change
// 						</label>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };