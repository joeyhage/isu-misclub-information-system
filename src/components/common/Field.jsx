import React from 'react';
import classNames from 'classnames';

export class Field extends React.Component {

	render() {
		const fieldClasses = classNames('field', {
			'is-grouped': this.props.grouped
		});
		return this.props.horizontal ? (
			<div className='field is-horizontal' style={this.props.style} ref={this.props.innerRef}>
				<div className='field-label is-normal'>
					{Boolean(this.props.label) &&
						<label className='label'>{this.props.label}</label>
					}
				</div>
				<div className='field-body'>
					<div className={fieldClasses}>
						{this.props.children}
					</div>
				</div>
			</div> ) : (
			<div className={fieldClasses} style={this.props.style}>
				{Boolean(this.props.label) &&
					<label className='label'>{this.props.label}</label>
				}
				{this.props.children}
			</div>
		);
	}
}