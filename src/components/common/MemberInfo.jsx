import React from 'react';
import { FormGroup } from './index';
import { primaryRed } from '../../style/CssConstants';

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
				<FormGroup id='first-name' value={member.firstName} onChange={this.state.onChange}
						   disabled={disabled}>
					First Name
				</FormGroup>
				<FormGroup id='last-name' value={member.lastName} onChange={this.state.onChange}
						   disabled={disabled}>
					Last Name
				</FormGroup>
				<FormGroup id='major' value={member.major} onChange={this.state.onChange}
						   disabled={disabled}>
					Major
				</FormGroup>
				<FormGroup id='class' value={member.class} onChange={this.state.onChange}
						   disabled={disabled}>
					Classification
				</FormGroup>
				<h5>Semesters Remaining: <span style={{color: primaryRed}}/></h5>
				<h5>Used Free Meeting? <span style={{color: primaryRed}}/></h5>
			</div>
		);
	}
}