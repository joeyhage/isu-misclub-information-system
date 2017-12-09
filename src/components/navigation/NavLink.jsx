import React from 'react';
import {connect} from 'react-redux';
import {selectView} from '../../actions/index';

class NavLink extends React.Component {

	render() {
		return (
			<li className={Boolean(this.props.view === this.props.id) && 'is-active'}>
				<a onClick={this.props.selectView}
				   id={this.props.id}>
					<span className='icon is-small'>
						<i className={this.props.icon}/>
					</span>
					{this.props.children}
				</a>
			</li>
		);
	}
}

const mapStateToProps = state => ({
	view: state.navigation.view
});

const mapDispatchToProps = dispatch => ({
	selectView: event => dispatch(selectView(event.target.id))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavLink);