import React from 'react';
import { Column } from '../common';
import { primaryRed } from '../../style/CssConstants';

export default class GraphsHeader extends React.Component {

	render() {
		const {onReset, toggleDetails} = this.props;
		return (
			<div className='columns'>
				<Column is={10}>
					<h1 className='title is-4 is-spaced'>MIS Club Attendance History</h1>
				</Column>
				<Column is={2} style={{padding:0}}>
					<div className='menu' style={{borderLeft:`2px solid ${primaryRed}`}}>
						<ul className='menu-list'>
							<li>
								<a onClick={onReset}>
									<span className='icon'>
										<i className='fa fa-search'/>
									</span>
									<span>Event Search</span>
								</a>
							</li>
							<li>
								<a onClick={toggleDetails}>
									<span className='icon'>
										<i className='fa fa-info-circle'/>
									</span>
									<span>Toggle Details</span>
								</a>
							</li>
						</ul>
					</div>
				</Column>
			</div>
		);
	}
}