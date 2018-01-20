import React from 'react';
import {InputGroup} from '../common';

export default class ClassificationSelect extends React.Component {

	render() {
		const {value, isStatic, onChange} = this.props;
		return (isStatic ?
			<InputGroup horizontal {...this.props}>
				Class
			</InputGroup> :
			<div className='field is-horizontal'>
				<div className='field-label is-normal'>
					<label className='label'>Class</label>
				</div>
				<div className='field-body'>
					<div className='field'>
						<div className='control'>
							<div className='select is-fullwidth'>
								<select id='classification' value={value} onChange={onChange}>
									<option value='Freshman'>Freshman</option>
									<option value='Sophomore'>Sophomore</option>
									<option value='Junior'>Junior</option>
									<option value='Senior'>Senior</option>
									<option value='Graduate'>Graduate</option>
									<option value='Faculty'>Faculty</option>
									<option value='Other'>Other</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}