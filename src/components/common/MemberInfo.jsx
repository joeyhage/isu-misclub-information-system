import React from 'react';
import { InputGroup } from './index';

export class MemberInfo extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			onChange: props.onChange
		};
	}

	render() {
		const {member, disabled} = this.props;
		return (
			<div>
				<div className='field is-horizontal' style={{width:'70%'}}>
					<div className='field-label'>
						<label className='label'>Net-ID</label>
					</div>
					<div className='field-body'>
						{member.netid}
					</div>
				</div>
				<InputGroup id='first-name' value={Boolean(member) && member.first_name} onChange={this.state.onChange}
							disabled={disabled} style={{width:'70%'}} horizontal>
					First Name
				</InputGroup>
				<InputGroup id='last-name' value={Boolean(member) && member.last_name} onChange={this.state.onChange}
							disabled={disabled} style={{width:'70%'}} horizontal>
					Last Name
				</InputGroup>
				<InputGroup id='major' value={Boolean(member) && member.major} onChange={this.state.onChange}
							disabled={disabled} style={{width:'70%'}} horizontal>
					Major|Dept
				</InputGroup>
				<InputGroup id='class' value={Boolean(member) && member.classification} onChange={this.state.onChange}
							disabled={disabled} style={{width:'70%'}} horizontal>
					Class
				</InputGroup>
				{disabled && [
					<div className='field is-horizontal' style={{width:'70%'}} key={1}>
						<div className='field-label'>
							<label className='label'>Semesters Paid</label>
						</div>
						<div className='field-body'>
							{member.semesters_remaining}
						</div>
					</div>,
					<div className='field is-horizontal' style={{width:'70%'}} key={2}>
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