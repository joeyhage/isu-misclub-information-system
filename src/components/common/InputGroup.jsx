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
			children: props.children,
			horizontal: props.horizontal
		};
	}

	render() {
		const {type, id, placeholder, onChange, autoFocus, required, showValidation, children, horizontal} = this.state;
		const {value, disabled} = this.props;
		const hasErrors = required && showValidation && showValidation(value);
		const className = `input ${hasErrors && 'is-danger'}`;

		return horizontal ? (
			<div className='field is-horizontal'>
				{children &&
					<div className='field-label is-normal'>
						<label className='label'>{children}</label>
					</div>
				}
				<div className='field-body'>
					<div className='field'>
						<div className='control'>
							<input type={type} className={className} id={id} value={value} onChange={onChange}
								   placeholder={placeholder} disabled={disabled} autoFocus={autoFocus}/>
						</div>
						{hasErrors && <p className='help is-danger'>This field is required</p>}
					</div>
				</div>
			</div> ) : (
			<div className='field'>
				{children &&
					<label className='label'>{children}</label>
				}
				<div className='control'>
					<input type={type} className={className} id={id} value={value} onChange={onChange}
						   placeholder={placeholder} disabled={disabled} autoFocus={autoFocus}/>
				</div>
				{hasErrors && <p className='help is-danger'>This field is required</p>}
			</div> )
		;
	}
}