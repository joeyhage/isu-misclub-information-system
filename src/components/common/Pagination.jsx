import React from 'react';
import { Page } from './';

export class Pagination extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			disablePrevious: this._shouldDisablePrevious(props),
			disableNext: this._shouldDisableNext(props),
			showLeftEllipses: this._shouldShowLeftEllipses(props),
			showRightEllipses: this._shouldShowRightEllipses(props),
			pageList: this._determinePageList(props)
		};
		this._onClick = this._onClick.bind(this);
	}

	render() {
		const {currentPage, pageCount} = this.props;
		const {disablePrevious, disableNext, showLeftEllipses, showRightEllipses, pageList} = this.state;
		return (
			<div className='pagination is-rounded' role='navigation'>
				<button className='button pagination-previous' onClick={() => this._onClick(currentPage - 1)} disabled={disablePrevious}>
					Previous
				</button>
				<button className='button pagination-next' onClick={() => this._onClick(currentPage + 1)} disabled={disableNext}>
					Next page
				</button>
				<ul className='pagination-list'>
					<li style={{minWidth:'2.75em', minHeight:'2.75em'}}>
						<a className='pagination-link' onClick={() => this._onClick(0)}
						   style={{display: showLeftEllipses ? 'inline-flex' : 'none'}}>
							1
						</a>
					</li>
					<li style={{minWidth:'2.42em', minHeight:'2.75em'}}>
						<span className='pagination-ellipsis' style={{display: showLeftEllipses ? 'inline-flex' : 'none'}}>
							&hellip;
						</span>
					</li>
					{pageList}
					<li style={{minWidth:'2.42em', minHeight:'2.75em'}}>
						<span className='pagination-ellipsis' style={{display: showRightEllipses ? 'inline-flex' : 'none'}}>
							&hellip;
						</span>
					</li>
					<li style={{minWidth:'2.75em', minHeight:'2.75em'}}>
						<a className='pagination-link' onClick={() => this._onClick(pageCount - 1)}
						   style={{display: showRightEllipses ? 'inline-flex' : 'none'}}>
							{pageCount}
						</a>
					</li>
				</ul>
			</div>
		);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentPage !== this.props.currentPage || nextProps.pageCount !== this.props.pageCount) {
			this.setState({
				disablePrevious: this._shouldDisablePrevious(nextProps),
				disableNext: this._shouldDisableNext(nextProps),
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

	_shouldDisablePrevious({currentPage}) {
		return currentPage === 0;
	}

	_shouldDisableNext({currentPage, pageCount}) {
		return currentPage === pageCount - 1;
	}

	_shouldShowLeftEllipses({currentPage, pageCount}) {
		return currentPage > 1 && pageCount > 3;
	}

	_shouldShowRightEllipses({currentPage, pageCount}) {
		return pageCount - currentPage > 2 && pageCount > 3;
	}
}