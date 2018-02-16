import React from 'react';
import { primaryRed } from '../../../../style/CssConstants';
import { Column } from '../../../common';

export default class ReportHeader extends React.Component {

	render() {
		const {event, attendance, onReset, exportAttendance} = this.props;
		return (
			<div className='columns'>
				<Column is={10} style={{paddingBottom:0}}>
					<h1 className='title is-4 is-spaced'>{event.eventName}</h1>
					<h2 className='subtitle is-6'>Date: {event.eventDate}</h2>
					<h2 className='subtitle is-6'>Total Attendance: {attendance.length}</h2>
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
								<a onClick={exportAttendance}>
									<span className='icon'>
										<i className='fa fa-file-excel-o'/>
									</span>
									<span>Export Attendance</span>
								</a>
							</li>
							<li>
								<div className='dropdown is-hoverable'>
									<div className='dropdown-trigger'>
										<a aria-haspopup='true' aria-controls='dropdown-menu'>
											<span className='icon'>
												<i className='fa fa-floppy-o'/>
											</span>
											<span>Save Page</span>
										</a>
									</div>
									<div className='dropdown-menu' id='dropdown-menu' role='menu'>
										<div className='dropdown-content'>
											<div className='dropdown-item'>
												<p>
													Click File
													<span className='icon'>
														<i className='fa fa-arrow-right'/>
													</span>
													Save Page As PDF
												</p>
											</div>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</Column>
			</div>
		);
	}
}