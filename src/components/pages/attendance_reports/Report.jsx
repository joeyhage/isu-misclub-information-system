import React from 'react';
import { Column } from '../../common';
import MajorPieChart from './report/MajorPieChart';
import ClassificationPieChart from './report/ClassificationPieChart';
import AttendanceList from './report/AttendanceList';
import ReportHeader from './report/ReportHeader';
import { ipcGeneral } from '../../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class Report extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			attendanceTable: this._populateAttendanceTable(props.reportData ? props.reportData.attendance : null)
		};
		this._exportAttendance = this._exportAttendance.bind(this);
	}

	render() {
		const {attendanceTable} = this.state;
		const {event} = this.props;
		const {majorStats, classificationStats} = this.props.reportData;
		return (
			<Column>
				<ReportHeader event={event} attendance={attendanceTable} onReset={this.props.onReset}
							  exportAttendance={this._exportAttendance}/>
				<hr className='divider'/>
				{Boolean(attendanceTable && attendanceTable.length) ?
					<div>
						<div style={{height:'500px'}}>
							<MajorPieChart stats={majorStats}/>
							<ClassificationPieChart stats={classificationStats}/>
						</div>
						<AttendanceList {...{attendanceTable}}/>
					</div> :
					<p>No results</p>
				}
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

	_exportAttendance() {
		const {attendance} = this.props.reportData;
		const {eventName, eventDate} = this.props.event;
		if (attendance && attendance.length) {
			ipcRenderer.send(ipcGeneral.WRITE_ATTENDANCE_TO_CSV, null, {attendance, eventName, eventDate});
		}
	}
}