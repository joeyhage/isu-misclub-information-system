import { primaryRed } from './CssConstants';

export const AppCss = {
	'#page-view': {
		width: '100%'
	},
	'.pane.padded-more': {
		height: '100%'
	},
	'.pane.padded-more:nth-of-type(1)': {
		width: '50%',
		float: 'left'
	},
	'div.pane>hr:nth-of-type(1)': {
		borderBottom: '3px groove rgba(109, 108, 109, 0.49)'
	},
	'h3': {
		color: primaryRed
	},

	'[class^="icon-"], [class*=" icon-"]': {
		display: 'inline-block',
		width: '100%'
	},

	'input:disabled': {
		backgroundColor: '#ddd'
	},
	'input.form-control.invalid': {
		backgroundColor: '#ffdddd',
		borderColor: '#c00000'
	},

	'tr:hover, tr:active, tr:hover:active, tr:active:nth-child(even)': {
		color: '#fff',
		backgroundColor: '#1195ff'
	},

	'.btn-form:focus, input:focus': {
		outline: '-webkit-focus-ring-color auto 5px'
	},
	'.btn.btn-form:focus:active, input:focus:active': {
		outline: 'none'
	},

	'.btn-red': {
		color: '#fff',
		background: `rgba(198, 32, 44, 0.49) linear-gradient(to bottom, rgba(198, 32, 44, 0.49) 0%, ${primaryRed} 100%)`,
		borderColor: primaryRed
	},
	'.btn-red:hover': {
		background: `rgba(198, 32, 44, 0.83) linear-gradient(to bottom, rgba(198, 32, 44, 0.84) 0%, ${primaryRed} 100%)`
	},
	'.btn-red:active': {
		background: 'rgba(182, 29, 40, 0.83) linear-gradient(to bottom, rgba(175, 28, 39, 0.84) 0%, #b51d28 100%)'
	},

	'.btn-primary:hover': {
		backgroundImage: 'linear-gradient(to bottom, #6eabee 0, #1976ec 100%)'
	},
	'.btn-primary:active': {
		backgroundImage: 'linear-gradient(to bottom, #699ede 0, #176bd6 100%)'
	},

	'.btn-default:hover': {
		backgroundImage: 'linear-gradient(to bottom, #f7f7f7 0, #ececec 100%)'
	},
	'.btn-default:active': {
		backgroundImage: 'linear-gradient(to bottom, #ececec 0, #dfdfdf 100%)'
	}
};