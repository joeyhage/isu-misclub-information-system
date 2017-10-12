import React from 'react';

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
			children: props.children
		};
	}

	render() {
		const {type, id, placeholder, onChange, autoFocus, required, showValidation, children} = this.state;
		const {value, disabled} = this.props;
		const className = `form-control ${required && 'required'} ${showValidation && showValidation(value) && 'invalid'}`;

		return (
			<div className='form-group'>
				{children &&
					<label htmlFor={id}>{children}</label>
				}
				<input type={type} className={className} id={id} value={value} onChange={onChange}
					   placeholder={placeholder} disabled={disabled} autoFocus={autoFocus}/>
			</div>
		);
	}
}