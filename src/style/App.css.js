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
		height: '100%'
	},
	'#page-view>div.column:nth-of-type(1)': {
		borderRight: '1px solid #eee'
	},
	'#page-view>div.column>hr:nth-of-type(1)': {
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