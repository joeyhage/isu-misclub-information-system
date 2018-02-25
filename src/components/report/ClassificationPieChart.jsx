import React from 'react';
import ReactHighcharts from 'react-highcharts';

export default class ClassificationPieChart extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			config: this._formatClassificationStats(props.stats)
		};
	}

	render() {
		return (
			<ReactHighcharts config={this.state.config} domProps={{id:'classification-chart'}}/>
		);
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
				height: 450
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