import React from 'react';
import { connect } from 'react-redux';
import { selectView } from '../../actions/index';

class NavLink extends React.Component {

	render() {
		return (
			<a onClick={this.props.selectView}
			   className={`nav-group-item ${this.props.view === this.props.id && 'active'}`}
			   id={this.props.id}>
				<span className={`icon ${this.props.icon}`}/>
				{this.props.children}
			</a>
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