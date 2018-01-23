import React from 'react';
import { Column, Table } from '../../common';

export default class Report extends React.Component {

	constructor(props) {
		super(props);
		const {attendance, majorStats, classificationStats} = props.reportData;
		this.state = {
			attendanceTable: this._populateAttendanceTable(attendance),
			majorStats: this._formatMajorStats(majorStats),
			classificationStats: this._formatClassificationStats(classificationStats)
		};
	}

	render() {
		const {classificationStats, majorStats} = this.state;
		return (
			<Column title={this.props.event.eventName}
					subtitle={`Event ID: ${this.props.event.eventId} | Date: ${this.props.event.eventDate}`}>
				<div className='level'>
					{classificationStats}
				</div>
				<div className='columns'>
					<Column>
						<Table/>
					</Column>
					<Column/>
				</div>
			</Column>
		);
	}

	_populateAttendanceTable(attendance) {
		return attendance ? attendance.map(member => (
			<tr>

			</tr>
		)) : null;
	}

	_formatMajorStats(majorStats) {
		if (!majorStats) {
			return;
		}
		majorStats.sort((a, b) => b.count - a.count);
		return majorStats.map(stat => (
			<div className='level-item has-text-centered' key={stat.major}>
				<div>
					<p className='heading'>{stat.major}</p>
					<p className='title'>{stat.count}</p>
				</div>
			</div>
		));
	}

	_formatClassificationStats(classificationStats) {
		if (!classificationStats) {
			return;
		}
		const classifications = classification => ({
				Freshman: 1,
				Sophomore: 2,
				Junior: 3,
				Senior: 4,
				Graduate: 5,
				Faculty: 6,
				Other: 7
		})[classification] || 8;
		classificationStats.sort((a, b) => classifications(a.classification) - classifications(b.classification));
		return classificationStats.map(stat => (
			<div className='level-item has-text-centered' key={stat.classification}>
				<div>
					<p className='heading'>{stat.classification}</p>
					<p className='title'>{stat.count}</p>
				</div>
			</div>
		));
	}
}