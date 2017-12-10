import React from 'react';
import { connect } from 'react-redux';
import CheckInMember from './event_check_in/CheckInMember';
import MemberLookup from './event_check_in/MemberLookup';
import CreateMember from './event_check_in/CreateMember';

class EventCheckIn extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: {},
			createMember: false,
			memberFieldsEditable: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._setMember = this._setMember.bind(this);
		this._createMemberForNetID = this._createMemberForNetID.bind(this);
	}

	render() {
		return !this.props.eventId ? ( <h3>No Event Selected</h3>) : (
			<div className='container is-fluid' id='page-view'>
				<h1 className='title is-4'>{this.props.eventName}</h1>
				<h2 className='subtitle is-6'>Event ID: {this.props.eventId} | Date: {this.props.eventDate}</h2>
				<hr className='divider'/>
				{!this.state.member.netid && !this.state.createMember &&
					<MemberLookup setMember={this._setMember} onCreateMember={this._createMemberForNetID}/>
				}
				{this.state.member && this.state.member.netid &&
					<CheckInMember member={this.state.member} onCancel={this._handleChange}
								   disabled={!this.props.memberFieldsEditable}/>
				}
				{this.state.createMember &&
					<CreateMember netid={this.state.createMember} onCancel={this._handleChange}/>
				}
			</div>
		);
	}

	_handleChange({target}) {
		if (target.id === 'cancel-member') {
			this._resetState();
		}
	}

	_setMember(member) {
		this.setState({member});
	}

	_createMemberForNetID(netid) {
		this.setState({createMember: netid});
	}

	_resetState() {
		this.setState({
			member: {},
			memberFieldsEditable: false,
			createMember: false
		});
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName,
	eventDate: state.activeEvent.eventDate
});
		
export default connect(mapStateToProps)(EventCheckIn);