import React from 'react';
import Radium, { Style } from 'radium';

class PageView extends React.Component {

	render() {
		return (
			<div className='container is-fluid columns' id='page-view'>
				{this.props.rules &&
					<Style rules={this.props.rules}/>
				}
				{this.props.children}
			</div>
		);
	}
}

export default Radium(PageView);