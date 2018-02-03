import { primaryGold } from './CssConstants';

export const CardCss = {
	'.card-header': {
		backgroundColor: primaryGold
	},
	'.fa.fa-angle-down': {
		transition: 'all .5s'
	},
	'.fa.fa-angle-down.up': {
		transform: 'rotate(-180deg)'
	},
	'#header-options:hover, #header-title:hover': {
		textDecoration: 'underline'
	},
	'.card .card-content>.content>table>thead>tr:hover': {
		backgroundColor: '#fff'
	}
};