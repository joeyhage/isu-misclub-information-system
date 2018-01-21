import React from 'react';
import classNames from 'classnames';

export class Column extends React.Component {

	render() {
		const columnClasses = classNames('column', {
			[`is-${this.props.is}`]: this.props.is
		});
		const titleClasses = classNames('title', 'is-4', {
			'is-spaced': this.props.titleIsSpaced
		});
		return (
			<div className={columnClasses} style={this.props.style}>
				<h1 className={titleClasses}>{this.props.title}</h1>
				{this.props.subtitle &&
					<h2 className='subtitle is-6'>{this.props.subtitle}</h2>
				}
				{(this.props.title || this.props.subtitle) &&
					<hr className='divider'/>
				}
				{this.props.children}
			</div>
		);
	}
}