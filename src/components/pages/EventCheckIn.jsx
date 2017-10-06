import React from 'react';
import { connect } from 'react-redux';
import { MemberInfo, FormGroup, Button } from '../common';
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
						<FormGroup id='netid' value={this.state.netid} onChange={this._handleChange}
								   placeholder={'Please enter Net-ID'} required autoFocus/>
						<div className='form-actions'>
							<Button type='reset'>
								Clear
							</Button>
							<Button type='submit' primary>
								Get Data
							</Button>
						</div>
					</form>
					<h5>No Results</h5>
					<Button red>
						Create Member?
					</Button>
				</div>
				<div className='pane padded-more'>
					<h3>Member Data</h3>
					<hr/>
					<form>
						<MemberInfo member={{}}/>
						<hr/>
						<h5>Record Payment</h5>
						<PaymentRadios/>
						<hr/>
						<p style={{color:primaryRed, fontWeight:'bold', display: 'none'}}>
							Member has already used free meeting and needs to pay dues
						</p>
						<Button id='check-in' disabled={Boolean(this.props.eventId)} red>
							Check-In & Submit Data
						</Button>
						<Button id='member-history' disabled={Boolean(this.props.eventId)} primary>
							View Member History
						</Button>
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

const PaymentRadios = () => {
	return (
		<div>
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
					No Change
				</label>
			</div>
		</div>
	);
};

const mapStateToProps = state => ({
	eventId: state.activeEvent.eventId,
	eventName: state.activeEvent.eventName,
	eventDate: state.activeEvent.eventDate
});
		
export default connect(mapStateToProps)(EventCheckIn);