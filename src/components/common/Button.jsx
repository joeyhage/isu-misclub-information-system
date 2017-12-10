import React from 'react';
import { determineColor } from '../../style/App.css';

export class Button extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			type: props.type || 'button',
			id: props.id,
			onClick: props.onClick,
			color: determineColor(props)
		};
	}

	render() {
		const {children, autoFocus, style} = this.props;
		const {type, id, onClick} = this.state;
		return (
			<div className='control' style={style}>
				<button type={type} className={`button is-outlined ${this.state.color}`} id={id}
						disabled={this.props.disabled} onClick={onClick} autoFocus={autoFocus}>
					{children}
				</button>
			</div>
		);
	}
}