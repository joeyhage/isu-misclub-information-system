import React from 'react';

export class Column extends React.Component {

	render() {
		return (
			<div className={`column ${Boolean(this.props.is) && `is-${this.props.is}`}`}>
				<h1 className={`title is-4 ${Boolean(this.props['title-is-spaced']) && 'is-spaced'}`}>{this.props.title}</h1>
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