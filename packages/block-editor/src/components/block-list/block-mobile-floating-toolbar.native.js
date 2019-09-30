/**
 * External dependencies
 */
import { View } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
/**
 * Internal dependencies
 */
import styles from './block-mobile-floating-toolbar.scss';
/**
 * WordPress dependencies
 */
import { createSlotFill } from '@wordpress/components';

const { Fill, Slot } = createSlotFill( 'FloatingToolbar' );

function FloatingToolbar( { children } ) {
	return (
		<Fill>
			<BaseButton onPress={ () => {
				console.warn( 'WORK' ); //eslint-disable-line no-console
			} }>
				<View
					style={ styles.floatingToolbarFill }
				>{ children }
				</View>
			</BaseButton>
		</Fill>
	);
}

FloatingToolbar.Slot = Slot;

export default FloatingToolbar;
