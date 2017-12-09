import React from 'react';
import { connect } from 'react-redux';
import { MemberInfo, InputGroup, Button } from '../common';
import { isValidInput } from '../../utils/validation';
import { primaryRed } from '../../style/CssConstants';

// const { ipcRenderer } = window.require('electron');

class EventCheckIn extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			netid: '',
			isMemberEditable: false,
			isNewMember: false,
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
			<div className='container is-fluid columns' id='page-view'>
				<div className='column is-6'>
					<h1 className='title is-4'>{this.props.eventName}</h1>
					<h2 className='subtitle is-6'>Event ID: {this.props.eventId} | Date: {this.props.eventDate}</h2>
					<hr/>
					<form id='member-lookup' onSubmit={this._handleSubmit} onReset={this._handleChange}>
						<InputGroup id='netid' value={this.state.netid} onChange={this._handleChange}
									showValidation={this._getMemberLookupFormValidationState}
									placeholder={'e.g. johndoe'} required autoFocus>Net-ID</InputGroup>
						{this.state.isNewMember ?
							<div className='field'>
								<div className='notification is-warning'>
									<button className='delete'/>
									<p>Net-ID Not Found</p>
									<button className='button is-warning is-inverted is-outlined'>Create Member?</button>
								</div>
							</div> :
							<div className='field is-grouped'>
								<Button type='reset'>Clear</Button>
								<Button type='submit' primary>Lookup</Button>
							</div>
						}
					</form>
				</div>
				<div className='column is-6'>
					<h1 className='title is-4'>Member Data</h1>
					<hr/>
					<form>
						<MemberInfo member={{}} disabled={!this.state.isMemberEditable}/>
						<hr/>
						<p style={{color:primaryRed, fontWeight:'bold', display: 'none'}}>
							Member has already used free meeting and needs to pay dues
						</p>
						<div className='field is-grouped'>
							<Button id='check-in' disabled={Boolean(this.props.eventId)} primary>
								Check-In & Submit Data
							</Button>
							<Button id='member-history' disabled={Boolean(this.props.eventId)} action>
								View Member History
							</Button>
						</div>
					</form>
				</div>
			</div>
		);
	}

	_handleChange({target}) {
		if (target.id === 'netid') {
			this.setState({netid: target.value});
		} else {
			this.setState({netid: ''});
		}
	}

	_handleSubmit(event) {
		event.preventDefault();
		const {target} = event;
		if (target.id === 'member-lookup') {
			if (isValidInput(this.state.netid)) {
				this.setState({showMemberLookupFormErrors:false, showCheckInFormErrors: false});
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
			isMemberEditable: false,
			isNewMember: false,
			showMemberLookupFormErrors: false,
			showCheckInFormErrors: false
		});
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName,
	eventDate: state.activeEvent.eventDate
});
		
export default connect(mapStateToProps)(EventCheckIn);