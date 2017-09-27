export const primaryRed = '#C6202C';

const AppCss = {
	'#page-view': {
		width: '100%'
	},
	'.pane.padded-more': {
		height: '100%'
	},
	'div.pane>hr:nth-of-type(1)': {
		borderBottom: '3px groove rgba(109, 108, 109, 0.49)'
	},
	'.table-striped tbody>tr': {
		':hover, :active, :hover:active, :active:nth-child(even)': {
			color: '#FFF',
			backgroundColor: '#1195ff'
		}
	},
	'.btn': {
		'.btn-form': {
			'.red:hover': {
				background: `rgba(198, 32, 44, 0.83) linear-gradient(to bottom, rgba(198, 32, 44, 0.84) 0%, ${primaryRed} 100%)`
			},
			'.red:active': {
				background: 'rgba(182, 29, 40, 0.83) linear-gradient(to bottom, rgba(175, 28, 39, 0.84) 0%, #b51d28 100%)'
			}
		},
		'.btn-primary': {
			':hover': {
				backgroundImage: 'linear-gradient(to bottom, #6eabee 0, #1976ec 100%)'
			},
			':active': {
				backgroundImage: 'linear-gradient(to bottom, #699ede 0, #176bd6 100%)'
			}
		},
		'.btn-default': {
			':hover': {
				backgroundImage: 'linear-gradient(to bottom, #f7f7f7 0, #ececec 100%)'
			},
			':active': {
				backgroundImage: 'linear-gradient(to bottom, #ececec 0, #dfdfdf 100%)'
			}
		},
		'.red': {
			color: '#FFF',
			background: `rgba(198, 32, 44, 0.49) linear-gradient(to bottom, rgba(198, 32, 44, 0.49) 0%, ${primaryRed} 100%)`,
			borderColor: primaryRed
		}
	}
};

export default AppCss;