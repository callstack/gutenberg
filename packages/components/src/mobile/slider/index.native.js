/**
 * External dependencies
 */
import { Slider as RNSlider, View } from 'react-native';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import NumericInput from '../numeric-input';
import styles from './styles.scss';

class Slider extends Component {
	constructor( props ) {
		super( props );
		this.onFocus = this.onFocus.bind( this );
		this.handleChange = this.handleChange.bind( this );
		this.handleReset = this.handleReset.bind( this );

		const initialValue = this.validateInput( props.value || props.minimumValue );

		this.state = { initialValue, sliderValue: initialValue };
	}

	componentDidUpdate( prevState ) {
		const change = this.props.value !== prevState.value;
		if ( change ) {
			this.handleChange(this.props.value);
		}
	}

	onFocus( validateInput = true ) {
		if ( validateInput ) {
			this.setState( { sliderValue: this.validateInput( this.state.sliderValue )} );
		}
	}

	validateInput( text ) {
		const { minimumValue, maximumValue } = this.props;
		if ( ! text ) {
			return minimumValue;
		}
		if ( typeof text === 'number' ) {
			return text;
		}
		return Math.min( Math.max( text.replace( /[^0-9]/g, '' ).replace( /^0+(?=\d)/, '' ), minimumValue ), maximumValue );
	}

	handleChange( text ) {
		if ( ! isNaN( Number( text ) ) || text === '' ) {
			if ( this.props.onChangeValue && text !== '' ) {
				this.props.onChangeValue( text );
			}
			this.setState( { sliderValue: text } );
		}
	}

	handleReset() {
		this.handleChange( this.state.initialValue );
	}

	render() {
		const {
			value,
			minimumValue,
			maximumValue,
			disabled,
			step,
			minimumTrackTintColor,
			maximumTrackTintColor,
			thumbTintColor,
		} = this.props;

		const { hasFocus, sliderValue } = this.state;

		return (
			<View style={ styles.sliderContainer }>
				<RNSlider
					value={ this.validateInput( sliderValue ) }
					disabled={ disabled }
					style={ styles.slider }
					step={ step }
					minimumValue={ minimumValue }
					maximumValue={ maximumValue }
					minimumTrackTintColor={ minimumTrackTintColor }
					maximumTrackTintColor={ maximumTrackTintColor }
					thumbTintColor={ thumbTintColor }
					onValueChange={ this.handleChange }
				/>
				<NumericInput
					// style={ styles.sliderTextInput }
					onValueChange={ this.handleChange }
					onFocus={ this.onFocus }
					onBlur={ this.onFocus }
					keyboardType="numeric"
					value={ sliderValue }
				/>
			</View>
		);
	}
}

export default Slider;
