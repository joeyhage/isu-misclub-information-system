import React from 'react';

export class Button extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			type: props.type || 'button',
			id: props.id,
			onClick: props.onClick
		};
	}

	render() {
		const {children, primary, action, autoFocus, danger} = this.props;
		const {type, id, onClick} = this.state;
		const className = `button is-outlined ${(primary && 'is-info') || (action && 'is-primary') || (danger && 'is-danger') || 'is-black'}`;
		return (
			<div className='control'>
				<button type={type} className={className} id={id} disabled={this.props.disabled} onClick={onClick} autoFocus={autoFocus}>
					{children}
				</button>
			</div>
		);
	}
}