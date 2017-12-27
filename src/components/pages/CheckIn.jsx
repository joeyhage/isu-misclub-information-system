import React from 'react';
import { connect } from 'react-redux';
import Radium, { Style } from 'radium';
import CheckInMember from './event_check_in/CheckInMember';
import MemberLookup from './event_check_in/MemberLookup';
import CreateMember from './event_check_in/CreateMember';
import { CheckInCss } from '../../style/CheckIn.css';
import { Column } from '../common';
import moment from 'moment/moment';

class CheckIn extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: {},
			createMember: false,
			notification: '',
			eventDate: moment().format('MMM DD, YYYY')
		};
		this._resetState = this._resetState.bind(this);
		this._setMember = this._setMember.bind(this);
		this._createMemberForNetID = this._createMemberForNetID.bind(this);
	}

	render() {
		return !this.props.eventId ? (
			<div className='container is-fluid columns' id='page-view'>
				<Column title={'No Event Selected'} subtitle={'Please select an event from the Events page.'} title-is-spaced/>
			</div>
		) : (
			<div className='container is-fluid columns' id='page-view'>
				<Style rules={CheckInCss}/>
				<Column title={this.props.eventName} subtitle={`Event ID: ${this.props.eventId} | Date: ${this.state.eventDate}`}>
					{!this.state.member.netid && !this.state.createMember &&
						<MemberLookup setMember={this._setMember} onCreateMember={this._createMemberForNetID}/>
					}
					{this.state.member && this.state.member.netid &&
						<CheckInMember member={this.state.member} eventId={this.props.eventId}
									   onCancel={this._resetState} onCheckIn={this._resetState}/>
					}
					{this.state.createMember &&
						<CreateMember netid={this.state.createMember} eventId={this.props.eventId}
									  onCancel={this._resetState}/>
					}
				</Column>
			</div>
		);
	}

	_setMember(member) {
		this.setState({member});
	}

	_createMemberForNetID(netid) {
		this.setState({createMember: netid});
	}

	_resetState(notification = '') {
		this.setState({
			member: {},
			createMember: false,
			notification
		});
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName,
	eventDate: state.activeEvent.eventDate
});
		
export default connect(mapStateToProps)(Radium(CheckIn));