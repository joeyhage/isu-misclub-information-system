import React from 'react';

export class PaymentRadio extends React.Component {

	render() {
		return (
			<div className='field is-horizontal' style={{margin:'20px 0'}}>
				<div className='field-label'>
					<label className='label'>Payment</label>
				</div>
				<div className='field-body'>
					<div className='field'>
						<div className='control'>
							<label className='radio'>
								<input type='radio' name='payment' value={0} checked={this.props.checked === 0}
									   onChange={this.props.onChange}/> No Payment
							</label>
							<label className='radio'>
								<input type='radio' name='payment' value={1} checked={this.props.checked === 1}
									   onChange={this.props.onChange}/> 1 Semester
							</label>
							<label className='radio'>
								<input type='radio' name='payment' value={2} checked={this.props.checked === 2}
									   onChange={this.props.onChange}/> 2 Semesters
							</label>
						</div>
					</div>
				</div>
			</div>
		);
	}
}