import React from 'react';
import { Column, Table, Card } from '../../common';
import ReactHighcharts from 'react-highcharts';

export default class Report extends React.Component {

	constructor(props) {
		super(props);
		const {attendance, majorStats, classificationStats} = props.reportData;
		this.state = {
			attendanceTable: this._populateAttendanceTable(attendance),
			majorChartConfig: this._formatMajorStats(majorStats),
			classificationChartConfig: this._formatClassificationStats(classificationStats)
		};
	}

	render() {
		const {attendanceTable, majorChartConfig, classificationChartConfig} = this.state;
		return (
			<Column title={this.props.event.eventName}
					subtitle={[
						`Event ID: ${this.props.event.eventId} | Date: ${this.props.event.eventDate}`,
						`Total Attendance: ${attendanceTable.length}`
					]}>
				<div style={{height:'500px'}}>
					<ReactHighcharts config={majorChartConfig} domProps={{id:'major-chart'}}/>
					<ReactHighcharts config={classificationChartConfig} domProps={{id:'classification-chart'}}/>
				</div>
				<Card title='Attendance List'>
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
							{attendanceTable}
						</tbody>
					</Table>
				</Card>
			</Column>
		);
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

	_formatMajorStats(majorStats) {
		if (!majorStats) {
			return;
		}
		return {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
				width: 500,
				height: 400
			},
			title: {
				text: 'Major Breakdown'
			},
			tooltip: {
				pointFormat: '<b>{point.y}</b>'
			},
			plotOptions: {
				pie: {
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '{point.y}'
					},
					showInLegend: true
				}
			},
			series: [{
				name: 'Classifications',
				colorByPoint: true,
				data: majorStats.map(stat => ({
					name: stat.major,
					y: stat.count
				}))
			}]
		};
	}

	_formatClassificationStats(classificationStats) {
		if (!classificationStats) {
			return;
		}
		return {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
				width: 500,
				height: 400
			},
			title: {
				text: 'Classification Breakdown'
			},
			tooltip: {
				pointFormat: '<b>{point.y}</b>'
			},
			plotOptions: {
				pie: {
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '{point.y}'
					},
					showInLegend: true
				}
			},
			series: [{
				name: 'Classifications',
				colorByPoint: true,
				data: classificationStats.map(stat => ({
					name: stat.classification,
					y: stat.count
				}))
			}]
		};
	}
}