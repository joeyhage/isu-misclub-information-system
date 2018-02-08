export const AttendanceReportsCss = {
	'.subtitle:not(:last-of-type)': {
		marginBottom: 0
	},
	'.subtitle:last-of-type': {
		fontWeight: 'bold'
	},
	'label.label, div.field-label.is-normal': {
		width: '96px',
		minWidth: '96px'
	},
	'#lookup-results>tbody>tr': {
		cursor: 'pointer'
	},
	'#lookup-results th:nth-of-type(2), #lookup-results td:nth-of-type(2)': {
		width: '140px',
		textAlign: 'left'
	},
	'#attendance th:nth-of-type(1), #attendance td:nth-of-type(1)': {
		width: '100px',
		textAlign: 'left'
	},
	'#attendance th:nth-of-type(4), #attendance td:nth-of-type(4)': {
		width: '100px',
		textAlign: 'left'
	},
	'#major-chart, #classification-chart': {
		float: 'left'
	},
	'text.highcharts-credits': {
		display: 'none'
	}
};