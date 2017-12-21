import React from 'react';
import {Card} from '../common/Card';

export class MemberAttendance extends React.Component {

	render() {
		return (
			<Card title='Attendance' up={this.props.up}>
				<table className='table is-striped is-hoverable is-fullwidth' id='attendance'>
					<thead>
						<tr>
							<th>Event ID</th>
							<th>Event Name</th>
							<th>Event Date</th>
						</tr>
					</thead>
					<tbody>
						{this.props.children}
					</tbody>
				</table>
			</Card>
		);
	}
}