import React from 'react';
import { Field } from '.';

export class ButtonGroup extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: false
		};
		this.timeout = null;
	}

	render() {
		return (
			<Field grouped horizontal={this.props.horizontal}>
				{!this.state.isLoading ?
					this.props.children :
					this._createLoadingButton()
				}
			</Field>
		);
	}

	componentWillReceiveProps(nextProps) {
		this._manageLoadingState(nextProps);
	}

	componentDidMount() {
		this._manageLoadingState();
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.setState({isLoading: false});
	}

	_manageLoadingState(nextProps) {
		const props = nextProps || this.props;
		if (props.isLoading && !this.timeout) {
			this.timeout = setTimeout(() => {
				this.setState({isLoading: true});
			}, 500);
		} else if (!props.isLoading) {
			if (this.state.isLoading) {
				this.setState({isLoading: false});
			}
			if (this.timeout) {
				clearTimeout(this.timeout);
			}
		}
	}

	_createLoadingButton() {
		// Loading CSS cannot be applied to type 'submit'
		// this changes each submit button to 'button' type
		return React.Children.map(this.props.children, (element, index) => React.cloneElement(
			element,
			{key: index, type: 'button', isLoading: element.props.type === 'submit'}
		));
	}
}