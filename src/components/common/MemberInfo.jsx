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
				<InputGroup id='first-name' value={member.firstName} onChange={this.state.onChange}
							disabled={disabled} horizontal>
					First Name
				</InputGroup>
				<InputGroup id='last-name' value={member.lastName} onChange={this.state.onChange}
							disabled={disabled} horizontal>
					Last Name
				</InputGroup>
				<InputGroup id='major' value={member.major} onChange={this.state.onChange}
							disabled={disabled} horizontal>
					Major|Dept
				</InputGroup>
				<InputGroup id='class' value={member.class} onChange={this.state.onChange}
							disabled={disabled} horizontal>
					Class
				</InputGroup>
				<PaymentRadios disabled={disabled}/>
			</div>
		);
	}
}

const PaymentRadios = props => {
	return (
		<div className='field is-horizontal' >
			<div className='field-label'>
				<label className='label'>Payment</label>
			</div>
			<div className='field-body'>
				<div className='field'>
					<div className='control'>
						<label className='radio'>
							<input type='radio' name='payment' value='2' disabled={props.disabled}/> 2 Semesters
						</label>
						<label className='radio'>
							<input type='radio' name='payment' value='1' disabled={props.disabled}/> 1 Semester
						</label>
						<label className='radio'>
							<input type='radio' name='payment' value='0' disabled={props.disabled}/> No Change
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};