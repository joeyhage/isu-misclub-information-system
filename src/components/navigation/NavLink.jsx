import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { selectView, setEventsToday } from '../../actions/reduxActions';
import {ipcMysql} from '../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

class NavLink extends React.Component {

	constructor(props) {
		super(props);
		this.selectView = props.selectView.bind(this, props.id);
	}

	render() {
		const navLinkClasses = classNames({'is-active': this.props.view === this.props.id});
		return (
			<li className={navLinkClasses}>
				<a onClick={this.selectView}
				   id={this.props.id}>
					<span className='icon is-small' onClick={this.selectView}>
						<i className={this.props.icon} onClick={this.selectView}/>
					</span>
					<span>{this.props.children}</span>
				</a>
			</li>
		);
	}
}

const mapStateToProps = state => ({
	view: state.navigation.view
});

const mapDispatchToProps = dispatch => ({
	selectView: targetId => {
		switch (targetId) {
			case 'events':
				ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.RETRIEVE_EVENTS_TODAY);
				ipcRenderer.once(ipcMysql.RETRIEVE_EVENTS_TODAY, (event, eventsToday) => {
					dispatch(setEventsToday(eventsToday));
					dispatch(selectView(targetId));
				});
				break;
			default:
				dispatch(selectView(targetId));
		}
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(NavLink);