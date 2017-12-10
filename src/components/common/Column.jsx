import React from 'react';

export class Column extends React.Component {

	render() {
		return (
			<div className='column is-6'>
				<h1 className='title is-4'>{this.props.title}</h1>
				{this.props.subtitle &&
					<h2 className='subtitle is-6'>{this.props.subtitle}</h2>
				}
				<hr className='divider'/>
				{this.props.children}
			</div>
		);
	}
}