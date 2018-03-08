import React from 'react';
import { connect } from 'react-redux';
import Radium, { Style } from 'radium';
import NavLink from './NavLink';
import { NavCss } from '../../style/Nav.css.js';

class NavPanel extends React.Component {

	render() {
		return (
			<div className='tabs'>
				<Style rules={NavCss}/>
				<ul>
					<NavLink id='events' icon='fa fa-calendar-plus-o'>Events</NavLink>
					<NavLink id='check-in' icon='fa fa-sign-in'>Check-In</NavLink>
					<NavLink id='attendance-reports' icon='fa fa-file-text-o'>Reports</NavLink>
					<NavLink id='members' icon='fa fa-user-o'>Members</NavLink>
					<NavLink id='graphs' icon='fa fa-bar-chart'>Graphs</NavLink>
					<NavLink id='finances' icon='fa fa-money'>Finances</NavLink>
					{this.props.isAdmin &&
						<NavLink id='admin-tools' icon='fa fa-cog'>Admin</NavLink>
					}
					<NavLink id='help' icon='fa fa-info-circle'>Help</NavLink>
				</ul>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	isAdmin: state.authorization.accessLevel === 'exec-admin'
});

export default connect(mapStateToProps)(Radium(NavPanel));