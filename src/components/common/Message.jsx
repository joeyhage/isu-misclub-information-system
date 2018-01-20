import React from 'react';
import classNames from 'classnames';
import { determineColor } from '../../style/App.css';

export class Message extends React.Component {

	constructor(props) {
		super(props);
		if (props.timeout && typeof props.timeout === 'number' && this.props.onDelete) {
			setTimeout(() => {
				this.props.onDelete();
			}, props.timeout);
		}
	}

	render() {
		const messageClasses = classNames('message', determineColor(this.props));
		return (
			<div className={messageClasses}>
				<div className='message-header'>
					<p>{this.props.header}</p>
					<button className='delete' onClick={(event) => {
						if (this.props.onDelete) {
							this.props.onDelete(event);
						} else {
							this._deleteMessage(event);
						}
					}}>Close</button>
				</div>
				<div className='message-body'>
					{this.props.children}
				</div>
			</div>
		);
	}

	_deleteMessage({target}) {
		target.parentNode.parentNode.remove();
	}
}