import React from 'react';
import Downshift from 'downshift';
import { Field } from '.';
import { primaryRed } from '../../style/CssConstants';

export class InputAutocomplete extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			items: props.items,
			id: props.id,
			horizontal: props.horizontal,
			showValidation: props.showValidation,
			required: props.required,
			onChange: props.onChange,
			inputValue: props.value
		};
		this._onChange = this._onChange.bind(this);
	}

	render() {
		const {horizontal, id, required, showValidation, inputValue} = this.state;
		const {value, disabled, style, children} = this.props;
		const hasErrors = required && showValidation && showValidation(value);
		const className = `input ${Boolean(hasErrors) && 'is-danger'}`;

		return (
			<Downshift
				onChange={this._onChange}
				onStateChange={({inputValue}) => this._onChange(inputValue)}
				onInputValueChange={inputValue => this.setState({inputValue})}
				inputValue={inputValue}
				selectedItem={value}
				defaultHighlightedIndex={0}
				itemToString={item => item && typeof item === 'string' ? item : ''}
				render={({
					getInputProps,
					getItemProps,
					isOpen,
					inputValue,
					highlightedIndex,
					selectedItem,
					getRootProps
				}) => {
					return (
						<Field horizontal={horizontal} style={style} label={children} {...getRootProps({refKey: 'innerRef'})}>
							<div className='control'>
								<input {...getInputProps({className, id, required, disabled})}/>
								{isOpen && inputValue && inputValue.length > 1 && (
									<div style={{border:'1px solid #ccc', zIndex:10, position:'absolute', width:'100%'}}>
										{this.state.items.filter(i =>
											i.toLowerCase().substring(0, inputValue.length) === inputValue.toLowerCase()
										).map((item, index) => (
											<div {...getItemProps({item})} key={item}
												 style={this._determineStyle({highlightedIndex, index, selectedItem, item})}>
												{item}
											</div>
										))}
									</div>
								)}
							</div>
							{hasErrors &&
								<p className='help is-danger'>This field is required</p>
							}
						</Field>
				);}}
			/>
		);
	}

	_onChange(selection) {
		if (!selection) {
			return;
		}
		this.state.onChange({
			target: {
				id: this.state.id,
				value: selection
			}
		});
	}

	_determineStyle({highlightedIndex, index, selectedItem, item}) {
		return {
			color: highlightedIndex === index ? '#fff' : '#000',
			backgroundColor: highlightedIndex === index ? primaryRed : '#fff',
			fontWeight: selectedItem === item ? 'bold' : 'normal',
			padding: '5px 10px'
		};
	}
}