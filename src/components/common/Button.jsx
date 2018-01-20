import React from 'react';
import classNames from 'classnames';
import { determineColor } from '../../style/App.css';

export class Button extends React.Component {

	render() {
		const {type = 'button', id, children, autoFocus, style, isLoading, onClick} = this.props;
		const buttonClasses = classNames('button', 'is-outlined', determineColor(this.props), {
			'is-loading': isLoading
		});
		return (
			<div className='control' style={style}>
				<button type={type} className={buttonClasses} id={id}
						disabled={this.props.disabled} onClick={onClick} autoFocus={autoFocus}>
					{children}
				</button>
			</div>
		);
	}
}