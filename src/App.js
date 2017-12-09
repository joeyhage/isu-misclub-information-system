import React from 'react';
import { connect } from 'react-redux';
import Radium, { Style } from 'radium';
import MISClubPage from './components/MISClubPage';
import Login from './components/pages/Login';
import { ipcGeneral } from './actions/ipcActions';
import { AppCss } from './style/App.css.js';
import './style/bulma.min.css';
import './style/font-awesome.min.css';

const { ipcRenderer } = window.require('electron');

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

	componentWillMount() {
		this._updateWindow(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this._updateWindow(nextProps);
	}

	_updateWindow(props) {
		if (this.props.userId !== props.userId || this.props.accessLevel !== props.accessLevel) {
			ipcRenderer.send(
				ipcGeneral.SET_WINDOW,
				!(props.userId && props.accessLevel) ?
					ipcGeneral.LOGIN_WINDOW :
					ipcGeneral.MIS_CLUB_PAGE_WINDOW
			);
		}
	}
}

const mapStateToProps = state => ({
	accessLevel: state.authorization.accessLevel,
	userId: state.authorization.userId
});

export default connect(mapStateToProps)(Radium(App));