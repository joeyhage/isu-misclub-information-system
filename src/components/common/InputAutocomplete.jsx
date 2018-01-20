import React from 'react';
import Downshift from 'downshift';
import classNames from 'classnames';
import { Field } from '.';
import { primaryRed } from '../../style/CssConstants';

export class InputAutocomplete extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			inputValue: props.value,
			hasErrors: this._hasErrors(props.value)
		};
		this._onChange = this._onChange.bind(this);
	}

	render() {
		const {inputValue, hasErrors} = this.state;
		const {value, disabled, style, items, id, horizontal, required, children, isStatic} = this.props;
		const inputClasses = classNames('input', {
			'is-danger': hasErrors,
			'is-static': isStatic
		});

		return (
			<Downshift
				onChange={this._onChange}
				onStateChange={({inputValue}) => this._onChange(this._formatMIS(inputValue))}
				onInputValueChange={inputValue => this.setState({inputValue: this._formatMIS(inputValue)})}
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
								<input {...getInputProps({className: inputClasses, id, required, disabled})}/>
								{isOpen && inputValue && inputValue.length > 1 && (
									<div style={{border:'1px solid #ccc', zIndex:10, position:'absolute', width:'100%'}}>
										{items.filter(i =>
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

	componentWillReceiveProps(nextProps) {
		this.setState({hasErrors: this._hasErrors(nextProps.value)});
	}

	_formatMIS(inputValue) {
		return inputValue === 'MIS' ? 'Management Information Systems' : inputValue;
	}

	_onChange(selection) {
		if (selection) {
			this.props.onChange({
				target: {
					id: this.props.id,
					value: selection
				}
			});
		}
	}

	_hasErrors(value) {
		return this.props.required && this.props.showValidation && this.props.showValidation(value);
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