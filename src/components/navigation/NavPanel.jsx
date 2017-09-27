import React from 'react';
import NavLink from './NavLink';
import '../../style/Nav.css';

export default class NavPanel extends React.Component {

	render() {
		return (
			<div className='pane pane-sm sidebar' style={{minWidth:'220px'}}>
				<nav className='nav-group'>
					<h5 className='nav-group-title'>Menu</h5>
					<NavLink id='create-event' icon='icon-calendar'>Create Event</NavLink>
					<NavLink id='event-check-in' icon='icon-login'>Check-In</NavLink>
					<NavLink id='attendance-report' icon='icon-doc-text-inv'>Attendance Report</NavLink>
					<NavLink id='graphs-trends' icon='icon-chart-bar'>Graphs & Trends</NavLink>
					<NavLink id='admin-tools' icon='icon-tools'>Admin Tools</NavLink>
					<NavLink id='help' icon='icon-help'>Help</NavLink>
				</nav>
			</div>
		);
	}
}