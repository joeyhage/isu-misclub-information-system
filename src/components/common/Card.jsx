import React from 'react';

export class Card extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showContent: !props.up,
		};
		this._onClick = this._onClick.bind(this);
	}

	render() {
		const cardCss = {
			'.fa.fa-angle-down': {
				transition: 'all .5s',
				transform: Boolean(!this.state.showContent) && 'rotate(-180deg)'
			}
		};
		return (
			<div className='card'>
				<header className='card-header'>
					<a className='card-header-title' onClick={this._onClick}>
						{this.props.title}
					</a>
					<a className='card-header-icon has-text-link' aria-label='more options' onClick={this._onClick}>
						{this.state.showContent ? 'Hide' : 'Show'}
						<span className='icon' onClick={this._onClick}>
							<i className={`fa fa-angle-down ${Boolean(!this.state.showContent) && 'up'}`} aria-hidden='true'
							   onClick={this._onClick} style={cardCss['.fa.fa-angle-down']}/>
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