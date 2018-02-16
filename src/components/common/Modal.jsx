import React from 'react';
import { ButtonGroup, Button } from './';

export class Modal extends React.Component {

	render() {
		const {title, onClose, children, footer, isLoading, onSave} = this.props;
		return (
			<div className='modal is-active'>
				<div className='modal-background'/>
				<div className='modal-card'>
					<header className='modal-card-head'>
						<p className='modal-card-title'>{title}</p>
						<button className='delete' aria-label='close' onClick={onClose}/>
					</header>
					<section className='modal-card-body'>
						{children}
					</section>
					{footer &&
						<footer className='modal-card-foot'>
							<ButtonGroup isLoading={isLoading}>
								<Button type='submit' onClick={event => {
									event.preventDefault();
									onSave();
								}} success>Save</Button>
								<Button onClick={onClose} black>Cancel</Button>
							</ButtonGroup>
						</footer>
					}
				</div>
			</div>
		);
	}
}