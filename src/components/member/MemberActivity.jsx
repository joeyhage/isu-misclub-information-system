import React from 'react';
import { Card, Table } from '../common';

export class MemberActivity extends React.Component {

	render() {
		return (
			<Card title='Activity'>
				<Table id='activity'>
					<thead>
						<tr>
							<th>Type</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{this.props.children}
					</tbody>
				</Table>
			</Card>
		);
	}
}