import React from 'react';
import { Field } from '.';

export class InputGroup extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			type: props.type || 'text',
			id: props.id,
			placeholder: props.placeholder,
			onChange: props.onChange,
			autoFocus: props.autoFocus,
			required: props.required,
			showValidation: props.showValidation,
			horizontal: props.horizontal
		};
	}

	render() {
		const {type, id, placeholder, onChange, autoFocus, required, showValidation, horizontal} = this.state;
		const hasErrors = required && showValidation && showValidation(this.props.value);
		const className = `input ${Boolean(hasErrors) && 'is-danger'}`;

		return (
			<Field horizontal={horizontal} style={this.props.style} label={this.props.children}>
				<div className='control'>
					<input type={type} className={className} id={id} value={this.props.value} onChange={onChange}
						   placeholder={placeholder} disabled={this.props.disabled} autoFocus={autoFocus}/>
				</div>
				{hasErrors &&
					<p className='help is-danger'>This field is required</p>
				}
			</Field>
		);
	}
}