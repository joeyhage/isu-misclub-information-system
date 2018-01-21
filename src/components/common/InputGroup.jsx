import React from 'react';
import classNames from 'classnames';
import { Field } from '.';

export class InputGroup extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hasErrors: this._hasErrors(props.value)
		};
	}

	render() {
		const {hasErrors} = this.state;
		const {type = 'text', id, placeholder, autoFocus, horizontal, isStatic, onChange} = this.props;
		const inputClasses = classNames('input', {
			'is-danger': hasErrors,
			'is-static': isStatic
		});

		return (
			<Field horizontal={horizontal} style={this.props.style} label={this.props.children}>
				<div className='control'>
					<input type={type} className={inputClasses} id={id} value={this.props.value} onChange={onChange}
						   placeholder={placeholder} disabled={this.props.disabled || isStatic} autoFocus={autoFocus}/>
				</div>
				{hasErrors &&
					<p className='help is-danger'>This field is required</p>
				}
			</Field>
		);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({hasErrors: this._hasErrors(nextProps.value)});
	}

	_hasErrors(value) {
		return this.props.required && this.props.showErrors && this.props.showErrors(value);
	}
}