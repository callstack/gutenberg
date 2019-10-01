/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * WordPress dependencies
 */
import { withPreferredColorScheme } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import styles from './style.scss';
import { withTheme } from '../mobile/dark-mode';

const ToolbarContainer = ( { getStylesFromColorScheme, passedStyle, children } ) => (
	<View style={ [ getStylesFromColorScheme( styles.container, styles.containerDark ), passedStyle ] }>
		{ children }
	</View>
);

export default withPreferredColorScheme( ToolbarContainer );
