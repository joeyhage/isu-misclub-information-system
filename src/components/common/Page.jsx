import React from 'react';
import classNames from 'classnames';

export class Page extends React.Component {

	render() {
		const {page, currentPage, onClick} = this.props;
		const pageClassNames = classNames('pagination-link', {
			'is-current': currentPage === page
		});
		return (
			<li>
				<a className={pageClassNames} onClick={() => onClick(page)}>{page + 1}</a>
			</li>
		);
	}
}