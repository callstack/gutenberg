/**
 * External dependencies
 */
import { Slider as RNSlider, TextInput, View } from 'react-native';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from './styles.scss';

class NumericInput extends Component {
	constructor( props ) {
		super( props );
		this.handleToggleFocus = this.handleToggleFocus.bind( this );
		this.handleChange = this.handleChange.bind( this );

		this.state = { hasFocus: false };
	}

  
	handleToggleFocus() {
    this.props.onFocus();
		this.setState( { hasFocus: ! this.state.hasFocus } );
	}

	handleChange( text ) {
		if ( this.props.onValueChange ) {
			this.props.onValueChange( text );
		}
	}

	render() {
		const {
      style,
      value,
      disabled,
      handleChange,
		} = this.props;

		const { hasFocus } = this.state;

		return (
			<TextInput
				style={ [ styles.textInput, style, hasFocus ? styles.isSelected : {} ] }
				onChangeText={ this.handleChange }
				onFocus={ this.handleToggleFocus }
				onBlur={ this.handleToggleFocus }
				keyboardType="numeric"
				value={ `${ value }` }
			/>
		);
	}
}

export default NumericInput;
