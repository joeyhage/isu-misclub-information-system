import React from 'react';

export class Button extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			className: `btn btn-form ${(props.primary && 'btn-primary') || (props.red && 'btn-red') || 'btn-default'}`,
			type: props.type || 'button',
			id: props.id,
			children: props.children,
			onClick: props.onClick
		};
	}

	render() {
		const {className, type, id, children, onClick} = this.state;
		return (
			<button type={type} className={className} id={id} disabled={this.props.disabled} onClick={onClick}>
				{children}
			</button>
		);
	}
}