import React from 'react';
import { Card, Table } from '../../../common/index';

export default class AttendanceList extends React.Component {

	render() {
		return (
			<Card title='Attendance List' up>
				<Table id='attendance' className='is-narrow'>
					<thead>
						<tr>
							<th>Net-ID</th>
							<th>Name</th>
							<th>Major</th>
							<th>Classification</th>
						</tr>
					</thead>
					<tbody>
						{this.props.attendanceTable}
					</tbody>
				</Table>
			</Card>
		);
	}
}