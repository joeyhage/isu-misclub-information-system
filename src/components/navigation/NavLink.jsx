import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { addReportData, selectView, setEventsToday } from '../../actions/reduxActions';
import { ipcMysql, ipcGeneral } from '../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

class NavLink extends React.Component {

	constructor(props) {
		super(props);
		this._selectView = this._selectView.bind(this);
	}

	render() {
		const navLinkClasses = classNames({'is-active': this.props.view === this.props.id});
		return (
			<li className={navLinkClasses}>
				<a onClick={this._selectView}
				   id={this.props.id}>
					<span className='icon is-small'>
						<i className={this.props.icon}/>
					</span>
					<span>{this.props.children}</span>
				</a>
			</li>
		);
	}

	_selectView() {
		this.props.selectView(this.props);
	}
}

const mapStateToProps = state => ({
	view: state.navigation.view,
	eventId: state.event.eventId,
	eventName: state.event.eventName
});

const mapDispatchToProps = dispatch => ({
	selectView: ({id, eventId, eventName, view}) => {
		switch (id) {
			case 'events':
				smoothTransition(dispatch, id, () => {
					return new Promise(resolve => {
						ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.RETRIEVE_EVENTS_TODAY);
						ipcRenderer.once(ipcMysql.RETRIEVE_EVENTS_TODAY, (event, eventsToday, status) => {
							if (status === ipcGeneral.SUCCESS) {
								dispatch(setEventsToday(eventsToday));
							}
							resolve();
						});
					});
				});
				break;
			case 'attendance-reports':
				if (eventId && view !== 'attendance-reports') {
					smoothTransition(dispatch, id, () => {
						return new Promise(resolve => {
							ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.RETRIEVE_ATTENDANCE, {eventId});
							ipcRenderer.once(ipcMysql.RETRIEVE_ATTENDANCE, (event, reportData, status) => {
								if (status === ipcGeneral.SUCCESS) {
									dispatch(addReportData(reportData));
								}
								resolve();
							});
						});
					});
				} else {
					dispatch(selectView(id));
				}
				break;
			default:
				dispatch(selectView(id));
		}
	}
});

const smoothTransition = (dispatch, id, promise) => {
	let dispatchedView = false;
	const timeout = setTimeout(() => {
		if (!dispatchedView) {
			dispatchedView = true;
			dispatch(selectView(id));
		}
	}, 3000);
	promise().then(() => {
		if (!dispatchedView) {
			clearTimeout(timeout);
			dispatch(selectView(id));
		}
	});
};

export default connect(mapStateToProps, mapDispatchToProps)(NavLink);