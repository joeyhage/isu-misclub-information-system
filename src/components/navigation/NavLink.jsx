import React from 'react';
import {connect} from 'react-redux';
import {selectView} from '../../actions/index';

class NavLink extends React.Component {

	constructor(props) {
		super(props);
		this.selectView = props.selectView.bind(this, props.id);
	}

	render() {
		return (
			<li className={Boolean(this.props.view === this.props.id) && 'is-active'}>
				<a onClick={this.selectView}
				   id={this.props.id}>
					<span className='icon is-small' onClick={this.selectView}>
						<i className={this.props.icon} onClick={this.selectView}/>
					</span>
					<span>{this.props.children}</span>
				</a>
			</li>
		);
	}
}

const mapStateToProps = state => ({
	view: state.navigation.view
});

const mapDispatchToProps = dispatch => ({
	selectView: targetId => dispatch(selectView(targetId))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavLink);