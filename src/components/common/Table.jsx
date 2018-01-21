import React from 'react';
import classNames from 'classnames';

export class Table extends React.Component {

	render() {
		const {className, id, style, children} = this.props;
		const tableClasses = classNames('table', 'is-striped', 'is-hoverable', 'is-fullwidth', className);
		return (
			<table className={tableClasses} id={id}
				   style={style}>
				{children}
			</table>
		);
	}
}