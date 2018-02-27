import React from 'react';
import ReactHighcharts from 'react-highcharts';

export default class MajorPieChart extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			config: this._initializeChart(props.stats)
		};
	}

	render() {
		return (
			<ReactHighcharts config={this.state.config} domProps={{id:'major-chart'}}/>
		);
	}

	_initializeChart(majorStats) {
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
				height: 475
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
}