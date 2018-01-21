import React from 'react';
import { connect } from 'react-redux';
import Radium, { Style } from 'radium';
import MISClubPage from './components/MISClubPage';
import Login from './components/pages/Login';
import { ipcGeneral } from './actions/ipcActions';
import { AppCss } from './style/App.css.js';
import './style/bulma.min.css';
import './style/font-awesome.min.css';

const { ipcRenderer, remote } = window.require('electron');

class App extends React.Component {

	render() {
		return (
			<div>
				<Style rules={AppCss}/>
				{this.props.userId && this.props.accessLevel ?
					<MISClubPage/> :
					<Login/>
				}
			</div>
		);
	}

	componentDidMount() {
		this._updateWindow();
	}

	componentWillReceiveProps(nextProps) {
		this._updateWindow(nextProps);
	}

	componentDidCatch(error, info) {
		const logger = remote.getGlobal('logger');
		if (logger) {
			logger.error(error, info);
		}
	}

	_updateWindow(props) {
		if (!props) {
			if (!(this.props && this.props.userId && this.props.accessLevel)) {
				this._setLoginWindow();
			} else {
				this._setMISClubPageWindow();
			}
		} else {
			if (props.userId !== this.props.userId || props.accessLevel !== this.props.accessLevel) {
				if (!props.userId || !props.accessLevel) {
					this._setLoginWindow();
				} else {
					this._setMISClubPageWindow();
				}
			}
		}
	}

	_setLoginWindow() {
		ipcRenderer.send(ipcGeneral.SET_WINDOW, ipcGeneral.LOGIN_WINDOW);
	}

	_setMISClubPageWindow() {
		ipcRenderer.send(ipcGeneral.SET_WINDOW, ipcGeneral.MIS_CLUB_PAGE_WINDOW);
	}
}

const mapStateToProps = state => ({
	accessLevel: state.authorization.accessLevel,
	userId: state.authorization.userId
});

export default connect(mapStateToProps)(Radium(App));