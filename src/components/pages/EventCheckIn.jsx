import React from 'react';
import { connect } from 'react-redux';
import { primaryRed } from '../../style/CssConstants';

class EventCheckIn extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			netid: ''
		};
		this._handleChange = this._handleChange.bind(this);
	}

	render() {
		return !this.props.eventId ? ( <h3>No Event Selected</h3>) : (
			<div id='page-view'>
				<div className='pane padded-more'>
					<div className='container pull-left' style={{width:'75%'}}>
						<h3 style={{fontSize:'1.75vw'}}>{this.props.eventName}</h3>
					</div>
					<div className='container pull-right' style={{width:'25%'}}>
						<p style={{margin:'20px 0 0 0', textAlign:'right'}}>
							Event ID: {this.props.eventId}
						</p>
						<p style={{marginTop: 0, textAlign:'right'}}>
							Date: {this.props.eventDate}
						</p>
					</div>
					<hr style={{marginTop:'74px'}}/>
					<form action='' onReset={() => {this.setState({netid: ''});}}>
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
					<h5>No Results</h5>
					<button type='button' className='btn btn-form btn-primary red' style={{display:'none'}}>
						Create Member?
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
						<h5>Semesters Remaining: <span style={{color: primaryRed}}/></h5>
						<h5>Used Free Meeting? <span style={{color: primaryRed}}/></h5>
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
						<p style={{color:primaryRed, fontWeight:'bold', display: 'none'}}>
							Member has already used free meeting and needs to pay dues
						</p>
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