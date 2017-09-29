import React from 'react';
import Radium, { Style } from 'radium';
import NavLink from './NavLink';
import { NavCss } from '../../style/Nav.css.js';

class NavPanel extends React.Component {

	render() {
		return (
			<div className='pane pane-sm sidebar' style={{minWidth:'220px', color:'white', backgroundColor:'#6d6c6d'}}>
				<Style rules={NavCss}/>
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

export default Radium(NavPanel);