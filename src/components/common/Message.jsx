import React from 'react';
import { determineColor } from '../../style/App.css';

export class Message extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			color: determineColor(props)
		};
	}

	render() {
		return (
			<div className={`message ${this.state.color}`}>
				<div className='message-header'>
					<p>{this.props.header}</p>
					<button className='delete' onClick={(event) => {
						if (this.props.onDelete) {
							this.props.onDelete(event);
						} else {
							this._deleteMessage(event);
						}
					}}/>
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