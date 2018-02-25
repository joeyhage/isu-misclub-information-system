import React from 'react';


export default class Finances extends React.Component {

	render() {
		return (
// eslint-disable-next-line jsx-a11y/accessible-emoji
			<div>
                💵😎🤪FINANCES🤪😎💵
			</div>
		);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}
}
  