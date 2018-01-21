import React from 'react';
import { InputGroup, InputAutocomplete } from '../common';
import isuMajors from '../../static/isuMajors';
import ClassificationSelect from './ClassificationSelect';
import MemberStatus from './MemberStatus';

export class MemberInfo extends React.Component {
	
	render() {
		const {member, disabled, showErrors, autoFocus, onChange, status} = this.props;
		const inputProps = {onChange, isStatic: disabled, showErrors, horizontal: true, required: true};
		return (
			<div>
				<InputGroup value={member.netid} onChange={onChange} horizontal isStatic>
					Net-ID
				</InputGroup>
				<InputGroup id='first_name' value={member.first_name} autoFocus={autoFocus} {...inputProps}>
					First
				</InputGroup>
				<InputGroup id='last_name' value={member.last_name} {...inputProps}>
					Last
				</InputGroup>
				<InputAutocomplete id='major' value={member.major} items={isuMajors} {...inputProps}>
					Major
				</InputAutocomplete>
				<ClassificationSelect value={member.classification} {...inputProps}/>
				<MemberStatus member={member} status={status}/>
				{this.props.children}
			</div>
		);
	}
}