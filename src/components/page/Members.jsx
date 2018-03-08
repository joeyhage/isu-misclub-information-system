import React from 'react';
import { Column, Message, PageView } from '../common';
import UpdateMember from '../member/UpdateMember';
import MemberSearch from '../member/MemberSearch';
import CreateMember from '../member/CreateMember';
import { setMemberDefaults } from '../../utils/memberUtil';
import { MembersCss } from '../../style/Members.css';

export default class Members extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			member: setMemberDefaults(),
			updateMember: false,
			createMember: false,
			message: null
		};
		this._resetState = this._resetState.bind(this);
		this._setMember = this._setMember.bind(this);
		this._updateMember = this._updateMember.bind(this);
		this._createMember = this._createMember.bind(this);
	}

	render() {
		return (
			<PageView rules={MembersCss}>
				<Column title='Member Management'>
					{this._determineSubpage()}
					{Boolean(this.state.message) &&
						<Column is={6} style={{paddingLeft:0}}>
							<Message header='Info'
									 timeout={4000}
									 onDelete={() => this.setState({message: null})}
									 info>
								{this.state.message}
							</Message>
						</Column>
					}
				</Column>
			</PageView>
		);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	_determineSubpage() {
		if (this.state.updateMember) {
			return (
				<UpdateMember member={this.state.member} eventId={this.props.eventId}
							  onCancel={this._resetState} onSubmit={this._resetState}/>
			);
		} else if (this.state.createMember) {
			return (
				<CreateMember member={this.state.member} eventId={this.props.eventId}
							  onCancel={this._resetState} onSubmit={this._resetState}/>
			);
		} else {
			return (
				<MemberSearch setMember={this._setMember} updateMember={this._updateMember}
							  createMember={this._createMember}/>
			);
		}
	}

	_setMember(member) {
		this.setState({member: setMemberDefaults(member)});
	}

	_updateMember() {
		this.setState({updateMember: true, message: null});
	}

	_createMember() {
		this.setState({createMember: true, message: null});
	}

	_resetState(message = '') {
		this.setState({
			member: setMemberDefaults(),
			createMember: false,
			updateMember: false,
			message: typeof message === 'string' ? message : null
		});
	}
}