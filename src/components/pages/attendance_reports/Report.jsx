import React from 'react';
import { Column } from '../../common';
import MajorPieChart from './MajorPieChart';
import ClassificationPieChart from './ClassificationPieChart';
import AttendanceList from './AttendanceList';

export default class Report extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			attendanceTable: this._populateAttendanceTable(props.reportData.attendance)
		};
	}

	render() {
		const {attendanceTable} = this.state;
		const {majorStats, classificationStats} = this.props.reportData;
		return (
			<Column title={this.props.event.eventName}
					subtitle={[
						`Date: ${this.props.event.eventDate}`,
						`Total Attendance: ${attendanceTable.length}`
					]}>
				<div style={{height:'500px'}}>
					<MajorPieChart stats={majorStats}/>
					<ClassificationPieChart stats={classificationStats}/>
				</div>
				<AttendanceList {...{attendanceTable}}/>
			</Column>
		);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	_populateAttendanceTable(attendance) {
		return attendance ? attendance.map(member => (
			<tr key={member.netid}>
				<td>{member.netid}</td>
				<td>{member.last_name}, {member.first_name}</td>
				<td>{member.major}</td>
				<td>{member.classification}</td>
			</tr>
		)) : null;
	}
}