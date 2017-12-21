import { primaryRed } from './CssConstants';

export const AppCss = {
	'#root>div, #root>div>div': {
		height: '100%',
		margin: 0,
		padding: 0
	},
	'#root>div>div>div': {
		padding: 0
	},
	'#page-view': {
		height: '90%'
	},
	'#page-view:not(.columns)': {
		padding: '0 .75rem'
	},
	'#page-view>div.column:nth-of-type(1)': {
		borderRight: '1px solid #eee'
	},
	'#page-view hr.divider': {
		margin: '10px 0',
		borderBottom: '3px groove rgba(109, 108, 109, 0.49)'
	},
	'h1.title.is-4': {
		color: primaryRed
	},
	'input:disabled': {
		backgroundColor: '#ddd'
	}
};

export const determineColor = props => {
	if (props.white) return 'is-white';
	if (props.black) return 'is-black';
	if (props.light) return 'is-light';
	if (props.dark) return 'is-dark';
	if (props.primary) return 'is-primary';
	if (props.link) return 'is-link';
	if (props.info) return 'is-info';
	if (props.success) return 'is-success';
	if (props.warning) return 'is-warning';
	if (props.danger) return 'is-danger';
};