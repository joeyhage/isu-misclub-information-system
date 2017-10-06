import React from 'react';

export class Button extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			className: `btn btn-form ${(props.primary && 'btn-primary') || (props.red && 'btn-red') || 'btn-default'}`,
			type: props.type || 'button',
			id: props.id,
			children: props.children
		};
	}

	render() {
		const {className, type, id, children} = this.state;
		return (
			<button type={type} className={className} id={id} disabled={this.props.disabled}>
				{children}
			</button>
		);
	}
}