/**
 * External dependencies
 */
import { View, TouchableWithoutFeedback } from 'react-native';

/**
 * Internal dependencies
 */
import styles from './block-mobile-floating-toolbar.scss';
import { createSlotFill } from '@wordpress/components';

const { Fill, Slot } = createSlotFill( 'FloatingToolbar' );

function FloatingToolbar( { children, style } ) {
	return (
		<Fill>
			<TouchableWithoutFeedback onPress={() => {console.warn('WORK')}}>
				<View
					style={ styles.floatingToolbarContainer }
				>
					<View
						style={ [styles.floatingToolbarFill,style] }
					>{ children }
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Fill>
	);
}

FloatingToolbar.Slot = Slot

export default FloatingToolbar;

