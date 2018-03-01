import React from 'react';
import ReactHighcharts from 'react-highcharts';
import dateFormat from 'dateformat';
import GraphsHeader from '../graphs/GraphsHeader';
import { Column } from '../common';

export default class AttendanceHistoryChart extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			config: this._initializeChart(props.attendanceHistory),
			showDetails: false
		};
		this._toggleDetails = this._toggleDetails.bind(this);
	}

	render() {
		return (
			<Column>
				<GraphsHeader onReset={this.props.onReset} toggleDetails={this._toggleDetails}/>
				<hr className='divider' style={{marginBottom:'50px'}}/>
				<ReactHighcharts config={this.state.config} domProps={{id:'attendance-history'}}/>
			</Column>
		);
	}

	_toggleDetails() {
		const config = {...this.state.config};
		if (this.state.showDetails) {
			config.xAxis.labels.formatter = function () {
				return this.value.split('-')[0];
			};
			config.yAxis.stackLabels.enabled = false;
		} else {
			config.xAxis.labels.formatter = function () {
				return this.value;
			};
			config.yAxis.stackLabels.enabled = true;
		}
		this.setState(prevState => ({config, showDetails: !prevState.showDetails}));
	}

	_initializeChart(attendanceHistory) {
		if (!attendanceHistory) {
			return;
		}
		const categories = this._mapAttendanceHistoryToCategories(attendanceHistory);
		const series = this._reduceAttendanceHistoryToSeries(attendanceHistory);
		return {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'column',
				width: 1200,
				height: 550
			},
			title: null,
			xAxis: {
				categories: categories,
				labels: {
					formatter: function () {
						return this.value.split('-')[0];
					}
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Attendance Count'
				},
				stackLabels: {
					style: {
						fontWeight: 'bold',
						color: 'gray'
					},
					verticalAlign: 'top',
					enabled: false
				}
			},
			legend: {
				backgroundColor: 'white',
				borderColor: '#AAA',
				borderWidth: 2
			},
			tooltip: {
				headerFormat: '<b>{point.x}</b><br/>',
				pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: false,
						color: 'white'
					}
				}
			},
			series: series,
			exporting: {
				buttons: {
					contextButton: {
						menuItems: [
							'downloadPNG',
							'downloadJPEG',
							'downloadPDF'
						],
						symbol: 'download'
					}
				},
				filename: 'MIS_Club_Attendance_History'
			}
		};
	}

	_mapAttendanceHistoryToCategories(attendanceHistory) {
		return attendanceHistory.map(event => {
			const eventDate = dateFormat(event.event_date, 'shortDate');
			const eventName = event.event_name;
			return `${eventDate}-${eventName}`;
		});
	}

	_reduceAttendanceHistoryToSeries(attendanceHistory) {
		return attendanceHistory.reduce((seriesArray, event) => {
			seriesArray[0].data.push(event.freshmen);
			seriesArray[1].data.push(event.sophomores);
			seriesArray[2].data.push(event.juniors);
			seriesArray[3].data.push(event.seniors);
			seriesArray[4].data.push(event.graduates);
			seriesArray[5].data.push(event.faculty);
			seriesArray[6].data.push(event.other);
			return seriesArray;
		}, [
			{name: 'Freshmen', data: []},
			{name: 'Sophomores', data: []},
			{name: 'Juniors', data: []},
			{name: 'Seniors', data: []},
			{name: 'Graduates', data: []},
			{name: 'Faculty', data: []},
			{name: 'Other', data: []},
		]);
	}
}