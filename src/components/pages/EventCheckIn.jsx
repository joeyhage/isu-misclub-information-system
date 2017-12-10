import React from 'react';
import { connect } from 'react-redux';
import { MemberInfo, InputGroup, Button } from '../common';
import { setCurrentMember, resetCurrentMember } from '../../actions';
import { isValidInput } from '../../utils/validation';
import { ipcMysql } from '../../actions/ipcActions';
import { primaryRed } from '../../style/CssConstants';

const { ipcRenderer } = window.require('electron');

class EventCheckIn extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			netid: '',
			member: {},
			notFound: false,
			memberFieldsEditable: false,
			createNewMember: false,
			showMemberLookupFormErrors: false,
			showCheckInFormErrors: false
		};
		this._handleChange = this._handleChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
		this._getMemberLookupFormValidationState = this._getMemberLookupFormValidationState.bind(this);
		this._getCheckInFormValidationState = this._getCheckInFormValidationState.bind(this);
	}

	render() {
		return !this.props.eventId ? ( <h3>No Event Selected</h3>) : (
			<div className='container is-fluid' id='page-view'>
				<h1 className='title is-4'>{this.props.eventName}</h1>
				<h2 className='subtitle is-6'>Event ID: {this.props.eventId} | Date: {this.props.eventDate}</h2>
				<hr className='divider'/>
				{!this.state.member.netid && !this.state.createNewMember &&
					<form id='member-lookup' onSubmit={this._handleSubmit} onReset={this._handleChange}>
						<InputGroup id='netid' value={this.state.netid} onChange={this._handleChange}
									showValidation={this._getMemberLookupFormValidationState}
									placeholder={'e.g. johndoe'} style={{width:'25%'}} required autoFocus>
							Net-ID
						</InputGroup>
						{this.state.notFound ?
							<div className='field'>
								<div className='notification is-warning'>
									<button className='delete'/>
									<p>Net-ID Not Found</p>
									<button className='button is-warning is-inverted is-outlined' id='create-member'
											onClick={this._handleChange}>
										Create Member?
									</button>
								</div>
							</div> :
							<div className='field is-grouped'>
								<Button type='reset'>Clear</Button>
								<Button type='submit' primary>Lookup</Button>
							</div>
						}
					</form>
				}
				{this.state.member.netid &&
					<form>
						<MemberInfo member={this.state.member} disabled={!this.state.memberFieldsEditable}/>
						<hr/>
						<p style={{color:primaryRed, fontWeight:'bold', display: 'none'}}>
							Member has already used free meeting and needs to pay dues
						</p>
						<div className='field is-horizontal' style={{width:'70%'}}>
							<div className='field-label'>
								{/* Left empty for spacing */}
							</div>
							<div className='field-body'>
								<div className='field is-grouped'>
									<Button id='check-in' disabled={!Boolean(this.props.eventId)} primary autoFocus>
										Check-In
									</Button>
									<Button id='member-history' disabled={!Boolean(this.props.eventId)} action>
										View History
									</Button>
									<Button id='cancel-member' disabled={!Boolean(this.props.eventId)}
											onClick={this._handleChange} danger>
										Cancel
									</Button>
								</div>
							</div>
						</div>
					</form>
				}
				{this.state.createNewMember &&
					<form>
						<MemberInfo member={this.state.member}/>
					</form>
				}
			</div>
		);
	}

	_handleChange({target}) {
		if (target.id === 'netid') {
			this.setState({netid: target.value});
		} else if (target.id === 'member-lookup') {
			this.setState({netid: ''});
		} else if (target.id === 'create-member') {
			this.setState({createNewMember: true});
		} else if (target.id === 'cancel-member') {
			this.props.resetCurrentMember();
			this.setState({member: {}});
		}
	}

	_handleSubmit(event) {
		event.preventDefault();
		const {target} = event;
		const {netid} = this.state;
		if (target.id === 'member-lookup') {
			if (isValidInput(netid)) {
				this.setState({showMemberLookupFormErrors: false});
				ipcRenderer.send(ipcMysql.EXECUTE_SQL, ipcMysql.LOOKUP_NETID, {netid});
				ipcRenderer.once(ipcMysql.LOOKUP_NETID, (event, member) => {
					if (member) {
						this.props.setCurrentMember(member);
						this.setState({member, notFound: false});
					} else {
						this.props.resetCurrentMember();
						this.setState({member: {}, notFound: true});
					}
				});
			} else {
				this.setState({showMemberLookupFormErrors: true});
			}
		} else {
			if (isValidInput(this.state.netid)) {
				this._resetState();
			} else {
				this.setState({showCheckInFormErrors: true});
			}
		}
	}

	_getMemberLookupFormValidationState(value) {
		return !isValidInput(value) && this.state.showMemberLookupFormErrors;
	}

	_getCheckInFormValidationState(value) {
		return !isValidInput(value) && this.state.showCheckInFormErrors;
	}

	_resetState() {
		this.setState({
			netid: '',
			memberFieldsEditable: false,
			createNewMember: false,
			showMemberLookupFormErrors: false,
			showCheckInFormErrors: false
		});
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName,
	eventDate: state.activeEvent.eventDate,
	member: state.currentMember
});

const mapDispatchToProps = dispatch => ({
	setCurrentMember: member => dispatch(setCurrentMember(member)),
	resetCurrentMember: () => dispatch(resetCurrentMember())
});
		
export default connect(mapStateToProps, mapDispatchToProps)(EventCheckIn);