import React from 'react';
import { Column } from '../common/index';
import MajorPieChart from '../highcharts/MajorPieChart';
import ClassificationPieChart from '../highcharts/ClassificationPieChart';
import AttendanceList from './AttendanceList';
import ReportHeader from './ReportHeader';
import { ipcGeneral } from '../../actions/ipcActions';

const { ipcRenderer } = window.require('electron');

export default class Report extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			attendanceTable: this._populateAttendanceTable(props.reportData.attendance)
		};
		this._exportAttendance = this._exportAttendance.bind(this);
	}

	render() {
		const {attendanceTable} = this.state;
		const {event} = this.props;
		const {majorStats, classificationStats} = this.props.reportData;
		return (
			<Column>
				<ReportHeader event={event} attendanceCount={attendanceTable.length} onReset={this.props.onReset}
							  exportAttendance={this._exportAttendance}/>
				<hr className='divider'/>
				{Boolean(attendanceTable && attendanceTable.length) ?
					<div>
						<div style={{height:'500px'}}>
							<MajorPieChart stats={majorStats}/>
							<ClassificationPieChart stats={classificationStats}/>
						</div>
						<AttendanceList attendanceTable={attendanceTable}/>
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
		)) : [];
	}

	_exportAttendance() {
		const {attendance} = this.props.reportData;
		const {eventName, eventDate} = this.props.event;
		if (attendance && attendance.length) {
			ipcRenderer.send(ipcGeneral.WRITE_ATTENDANCE_TO_CSV, null, {attendance, eventName, eventDate});
		}
	}
}