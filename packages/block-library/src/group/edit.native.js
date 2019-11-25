
/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { compose, withPreferredColorScheme } from '@wordpress/compose';
import {
	InnerBlocks,
	withColors,
} from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import styles from './editor.scss';

function GroupEdit( {
	hasInnerBlocks,
	isSelected,
	getStylesFromColorScheme,
	isEmptyGroup,
} ) {
	if ( ! isSelected && ! hasInnerBlocks ) {
		return (
			<View style={ [
				getStylesFromColorScheme( styles.groupPlaceholder, styles.groupPlaceholderDark ),
				isEmptyGroup && { marginTop: 5, marginBottom: 5 },
			] } />
		);
	}

	return (
		<InnerBlocks
			renderAppender={ isSelected && InnerBlocks.ButtonBlockAppender }
			isEmptyGroup={ isEmptyGroup }
		/>
	);
}

export default compose( [
	withColors( 'backgroundColor' ),
	withSelect( ( select, { clientId } ) => {
		const {
			getBlock,
		} = select( 'core/block-editor' );

		const block = getBlock( clientId );

		return {
			hasInnerBlocks: !! ( block && block.innerBlocks.length ),
		};
	} ),
	withPreferredColorScheme,
] )( GroupEdit );
