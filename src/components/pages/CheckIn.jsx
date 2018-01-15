import React from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import { Column, Message, PageView } from '../common';
import CheckInMember from './check_in/CheckInMember';
import MemberLookup from './check_in/MemberLookup';
import CreateMember from './check_in/CreateMember';
import { CheckInCss } from '../../style/CheckIn.css';
import setMemberDefaults from '../../utils/setMemberDefaults';

class CheckIn extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: setMemberDefaults(),
			checkInMember: false,
			createMember: false,
			message: null,
			eventDate: dateFormat('mediumDate')
		};
		this._resetState = this._resetState.bind(this);
		this._setMember = this._setMember.bind(this);
		this._checkInMember = this._checkInMember.bind(this);
		this._createMember = this._createMember.bind(this);
	}

	render() {
		return !this.props.eventId ? (
			<PageView>
				<Column title={'No Event Selected'} subtitle={'Please select an event from the Events page.'} title-is-spaced/>
			</PageView>
		) : (
			<PageView rules={CheckInCss}>
				<Column title={this.props.eventName} subtitle={`Event ID: ${this.props.eventId} | Date: ${this.state.eventDate}`}>
					{this._determineSubpage()}
					{Boolean(this.state.message) &&
						<Message header='Info' onDelete={() => this.setState({message: null})} timeout={4000} info>
							{this.state.message}
						</Message>
					}
				</Column>
			</PageView>
		);
	}

	_determineSubpage() {
		if (this.state.checkInMember) {
			return (
				<CheckInMember member={this.state.member} eventId={this.props.eventId}
							   onCancel={this._resetState} onCheckIn={this._resetState}/>
			);
		} else if (this.state.createMember) {
			return (
				<CreateMember member={this.state.member} eventId={this.props.eventId}
							  onCancel={this._resetState} onCheckIn={this._resetState}/>
			);
		} else {
			return (
				<MemberLookup setMember={this._setMember} checkInMember={this._checkInMember}
							  createMember={this._createMember}/>
			);
		}
	}

	_setMember(member) {
		this.setState({member});
	}

	_checkInMember() {
		this.setState({checkInMember: true});
	}

	_createMember() {
		this.setState({createMember: true});
	}

	_resetState(message = '') {
		this.setState({
			member: {},
			createMember: false,
			checkInMember: false,
			message: typeof message === 'string' ? message : null
		});
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName,
	eventDate: state.activeEvent.eventDate
});
		
export default connect(mapStateToProps)(CheckIn);