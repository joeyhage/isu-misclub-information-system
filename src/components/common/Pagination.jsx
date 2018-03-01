import React from 'react';
import { Page } from './';

export class Pagination extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showLeftEllipses: this._shouldShowLeftEllipses(props),
			showRightEllipses: this._shouldShowRightEllipses(props),
			pageList: this._determinePageList(props)
		};
		this._onClick = this._onClick.bind(this);
	}

	render() {
		const {pageCount} = this.props;
		const {showLeftEllipses, showRightEllipses, pageList} = this.state;
		return (
			<div className='pagination is-centered' role='navigation' aria-label='pagination'>
				<ul className='pagination-list'>
					{showLeftEllipses &&
						[
							<li key={1}>
								<a className='pagination-link' onClick={() => this._onClick(0)}>
									1
								</a>
							</li>,
							<li key={2}>
								<span className='pagination-ellipsis'>&hellip;</span>
							</li>
						]
					}
					{pageList}
					{showRightEllipses &&
						[
							<li key={1}>
								<span className='pagination-ellipsis'>&hellip;</span>
							</li>,
							<li key={2}>
								<a className='pagination-link' onClick={() => this._onClick(pageCount - 1)}>
									{pageCount}
								</a>
							</li>
						]
					}
				</ul>
			</div>
		);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentPage !== this.props.currentPage) {
			this.setState({
				showLeftEllipses: this._shouldShowLeftEllipses(nextProps),
				showRightEllipses: this._shouldShowRightEllipses(nextProps),
				pageList: this._determinePageList(nextProps)
			});
		}
	}

	_onClick(nextPage) {
		this.props.onPageChange(nextPage);
	}

	_determinePageList({currentPage, pageCount}) {
		const onClick = this._onClick.bind(this);
		const isStatic = pageCount < 4;
		let firstPageNumber, secondPageNumber, thirdPageNumber;
		if (isStatic || currentPage === 0) {
			firstPageNumber = 0;
			secondPageNumber = 1;
			thirdPageNumber = 2;
		} else if (currentPage === pageCount - 1) {
			firstPageNumber = currentPage - 2;
			secondPageNumber = currentPage - 1;
			thirdPageNumber = currentPage;
		} else {
			firstPageNumber = currentPage - 1;
			secondPageNumber = currentPage;
			thirdPageNumber = currentPage + 1;
		}
		return [
			<Page key={0}
				  page={firstPageNumber}
				  currentPage={currentPage}
				  onClick={onClick}
			/>,
			<Page key={1}
				  page={secondPageNumber}
				  currentPage={currentPage}
				  onClick={onClick}
			/>,
			<Page key={2}
				  page={thirdPageNumber}
				  currentPage={currentPage}
				  onClick={onClick}
			/>
		];
	}

	_shouldShowLeftEllipses({currentPage, pageCount}) {
		return currentPage > 1 && pageCount > 3;
	}

	_shouldShowRightEllipses({currentPage, pageCount}) {
		return pageCount - currentPage > 2 && pageCount > 3;
	}
}