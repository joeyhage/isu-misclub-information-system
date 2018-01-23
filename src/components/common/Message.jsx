import React from 'react';
import classNames from 'classnames';
import { determineColor } from '../../style/App.css';

export class Message extends React.Component {

	constructor(props) {
		super(props);
		if (props.timeout && typeof props.timeout === 'number' && this.props.onDelete) {
			this.timeout = setTimeout(() => {
				this.props.onDelete();
			}, props.timeout);
		}
		this._deleteMessage = this._deleteMessage.bind(this);
	}

	render() {
		const messageClasses = classNames('message', determineColor(this.props));
		return (
			<div className={messageClasses}>
				<div className='message-header'>
					<p>{this.props.header}</p>
					<button className='delete' onClick={(event) => {

					}}>Close</button>
				</div>
				<div className='message-body'>
					{this.props.children}
				</div>
			</div>
		);
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	_deleteMessage(event) {
		if (this.props.onDelete) {
			this.props.onDelete(event);
		} else {
			event.target.parentNode.parentNode.remove();
		}
	}
}