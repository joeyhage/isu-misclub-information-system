import React from 'react';

export class Table extends React.Component {

	render() {
		const {className, id, style, children} = this.props;
		return (
			<table className={`table is-striped is-hoverable is-fullwidth ${className}`} id={id}
				   style={style}>
				{children}
			</table>
		);
	}
}