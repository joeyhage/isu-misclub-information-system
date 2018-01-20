import React from 'react';
import Radium, { Style } from 'radium';
import classNames from 'classnames';
import { CardCss } from '../../style/Card.css';

class Card extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showContent: !Boolean(props.up),
		};
		this._onClick = this._onClick.bind(this);
	}

	render() {
		const iClasses = classNames('fa', 'fa-angle-down', {
			'up': !this.state.showContent
		});
		return (
			<div className='card' style={{margin:'10px 0'}}>
				<Style rules={CardCss}/>
				<header className='card-header'>
					<a className='card-header-title has-text-black' onClick={this._onClick}>
						<span id='header-title'>{this.props.title}</span>
					</a>
					<a className='card-header-icon has-text-black' aria-label='more options' onClick={this._onClick}>
						<span id='header-options'>{this.state.showContent ? 'Hide' : 'Show'}</span>
						<span className='icon' onClick={this._onClick}>
							<i className={iClasses} aria-hidden='true'
							   onClick={this._onClick}/>
						</span>
					</a>
				</header>
				{this.state.showContent &&
					<div className='card-content'>
						<div className='content'>
							{this.props.children}
						</div>
					</div>
				}
			</div>
		);
	}

	_onClick(event) {
		event.preventDefault();
		this.setState(prevState => ({
			showContent: !prevState.showContent
		}));
	}
}

export default Radium(Card);