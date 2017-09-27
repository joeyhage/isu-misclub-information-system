import React from 'react';
import { connect } from 'react-redux';
import '../../style/EventCheckIn.css';

class EventCheckIn extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			netid: ''
		};
		this._handleChange = this._handleChange.bind(this);
	}

	render() {
		return !this.props.eventId ? ( <h3 id='event-name'>No Event Selected</h3>) : (
			<div id='page-view'>
				<div className='pane padded-more' style={{width: '50%', float: 'left'}}>
					<div className='container pull-left'>
						<h3 id='event-name'>{this.props.eventName}</h3>
					</div>
					<div className='container pull-right'>
						<p id='event-id'>Event ID: {this.props.eventId}</p>
						<p id='event-date'>Date: {this.props.eventDate}</p>
					</div>
					<hr/>
					<form id='get-member' action='' onReset={() => {
						this.setState({netid: ''});
					}}>
						<div className='form-group'>
							<label htmlFor='netid' aria-hidden='true'/>
							<input type='text' value={this.state.netid} onChange={this._handleChange}
								   className='form-control required' id='netid' placeholder='Please enter Net-ID'
								   autoFocus/>
						</div>
						<div className='form-actions'>
							<button type='reset' className='btn btn-form btn-default'>Clear</button>
							<button type='submit' className='btn btn-form btn-primary' id='get-data'
									title='Click or Press Enter'>Get Data
							</button>
						</div>
					</form>
					<h5 id='no-results'/>
					<button type='button' className='btn btn-form btn-primary red' id='create-member'>Create
						Member?
					</button>
				</div>
				<div className='pane padded-more'>
					<h3>Member Data</h3>
					<hr/>
					<form id='member-data'>
						<div className='form-group'>
							<label htmlFor='first-name'>First Name</label>
							<input type='text' className='form-control' id='first-name' disabled/>
						</div>
						<div className='form-group'>
							<label htmlFor='last-name'>Last Name</label>
							<input type='text' className='form-control' id='last-name' disabled/>
						</div>
						<div className='form-group'>
							<label htmlFor='major'>Major</label>
							<input type='text' className='form-control' id='major' disabled/>
						</div>
						<div className='form-group'>
							<label htmlFor='class'>Classification</label>
							<input className='form-control' id='class' disabled/>
						</div>
						<h5>Semesters Remaining: <span id='semesters-remaining'/></h5>
						<h5>Used Free Meeting? <span id='free-meeting-status'/></h5>
						<hr/>
						<h5>Record Payment</h5>
						<div className='radio'>
							<label>
								<input type='radio' name='payment' value='2'/>
								2 Semesters
							</label>
						</div>
						<div className='radio'>
							<label>
								<input type='radio' name='payment' value='1'/>
								1 Semester
							</label>
						</div>
						<div className='radio'>
							<label>
								<input type='radio' name='payment' value='0'/>
								<span id='no-payment'>No Change</span>
							</label>
						</div>
						<hr/>
						<p id='payment-required'>Member has already used free meeting and needs to pay dues</p>
						<button type='button' className='btn btn-form btn-primary red' id='check-in'
								title='Click or Press Enter' disabled>Check-In & Submit Data
						</button>
						<button type='button' className='btn btn-form btn-primary' id='member-history'
								title='Click to view member history' disabled>View Member History
						</button>
					</form>
				</div>
			</div>
		);
	}

	_handleChange({target}) {
		if (target.id === 'netid') {
			this.setState({netid: target.value});
		}
	}
}

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName,
	eventDate: state.activeEvent.eventDate
});
		
export default connect(mapStateToProps)(EventCheckIn);