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
		const {children, autoFocus, style, isLoading} = this.props;
		const {type, id, onClick, color} = this.state;
		const className = `button is-outlined ${color} ${Boolean(isLoading) && 'is-loading'}`;
		return (
			<div className='control' style={style}>
				<button type={type} className={className} id={id}
						disabled={this.props.disabled} onClick={onClick} autoFocus={autoFocus}>
					{children}
				</button>
			</div>
		);
	}
}