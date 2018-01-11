import React from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import { Column, Message, PageView } from '../common';
import CheckInMember from './check_in/CheckInMember';
import MemberLookup from './check_in/MemberLookup';
import CreateMember from './check_in/CreateMember';
import { CheckInCss } from '../../style/CheckIn.css';

class CheckIn extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: {},
			createMember: false,
			message: '',
			eventDate: dateFormat('mediumDate')
		};
		this._resetState = this._resetState.bind(this);
		this._setMember = this._setMember.bind(this);
		this._createMemberForNetID = this._createMemberForNetID.bind(this);
	}

	render() {
		return !this.props.eventId ? (
			<PageView>
				<Column title={'No Event Selected'} subtitle={'Please select an event from the Events page.'} title-is-spaced/>
			</PageView>
		) : (
			<PageView rules={CheckInCss}>
				<Column title={this.props.eventName} subtitle={`Event ID: ${this.props.eventId} | Date: ${this.state.eventDate}`}>
					{!Boolean(this.state.member.netid) && !this.state.createMember &&
						<MemberLookup setMember={this._setMember} onCreateMember={this._createMemberForNetID}/>
					}
					{Boolean(this.state.member) && Boolean(this.state.member.netid) &&
						<CheckInMember member={this.state.member} eventId={this.props.eventId}
									   onCancel={this._resetState} onCheckIn={this._resetState}/>
					}
					{this.state.createMember &&
						<CreateMember netid={this.state.createMember} eventId={this.props.eventId}
									  onCancel={this._resetState}/>
					}
					{Boolean(this.state.message) &&
						<Message header='Info' onDelete={() => this.setState({message: ''})} timeout={4000} info>
							{this.state.message}
						</Message>
					}
				</Column>
			</PageView>
		);
	}

	_setMember(member) {
		this.setState({member});
	}

	_createMemberForNetID(netid) {
		this.setState({createMember: netid});
	}

	_resetState(message = '') {
		this.setState({
			member: {},
			createMember: false,
			message: typeof message === 'string' ? message : ''
		});
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName,
	eventDate: state.activeEvent.eventDate
});
		
export default connect(mapStateToProps)(CheckIn);