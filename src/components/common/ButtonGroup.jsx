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
		this._manageLoadingState();
		return (
			<Field grouped horizontal={this.props.horizontal}>
				{!this.state.isLoading ?
					this.props.children :
					this.props.children.map((element, index) => {
						return React.cloneElement(
							element,
							{key: index, type: 'button', isLoading: element.props.type === 'submit'}
						);
					})
				}
			</Field>
		);
	}

	_manageLoadingState() {
		if (this.props.isLoading && !this.state.timeout) {
			this.timeout = setTimeout(() => {
				this.setState({isLoading: true});
			}, 500);
		} else if (!this.props.isLoading) {
			if (this.state.isLoading) {
				this.setState({isLoading: false});
			}
			if (this.timeout) {
				clearTimeout(this.timeout);
			}
		}
	}
}