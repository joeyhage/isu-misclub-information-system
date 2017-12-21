import React from 'react';

export class Field extends React.Component {

	render() {
		return this.props.horizontal ? (
			<div className='field is-horizontal' style={this.props.style}>
				<div className='field-label is-normal'>
					{Boolean(this.props.label) &&
						<label className='label'>{this.props.label}</label>
					}
				</div>
				<div className='field-body'>
					<div className={`field ${Boolean(this.props.grouped) && 'is-grouped' }`}>
						{this.props.children}
					</div>
				</div>
			</div> ) : (
			<div className={`field ${Boolean(this.props.grouped) && 'is-grouped' }`} style={this.props.style}>
				{Boolean(this.props.label) &&
					<label className='label'>{this.props.label}</label>
				}
				{this.props.children}
			</div>
		);
	}
}