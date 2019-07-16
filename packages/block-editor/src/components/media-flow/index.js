/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import BlockControls from '../block-controls';
import { default as MediaPlaceholder } from '../media-placeholder';
import BlockIcon from '../block-icon';

/**
 * WordPress dependencies
 */
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Toolbar,
	IconButton,
	Path,
	Rect,
	SVG,
	withNotices,
} from '@wordpress/components';

const MediaFlow = ( { className, value, mediaURL, accepts, allowedTypes, onSelect, onSelectURL, notices, children, noticeOperations } ) => {
	const [ isEditing, setIsEditing ] = useState( ! mediaURL );

	const editImageIcon = ( <SVG width={ 20 } height={ 20 } viewBox="0 0 20 20"><Rect x={ 11 } y={ 3 } width={ 7 } height={ 5 } rx={ 1 } /><Rect x={ 2 } y={ 12 } width={ 7 } height={ 5 } rx={ 1 } /><Path d="M13,12h1a3,3,0,0,1-3,3v2a5,5,0,0,0,5-5h1L15,9Z" /><Path d="M4,8H3l2,3L7,8H6A3,3,0,0,1,9,5V3A5,5,0,0,0,4,8Z" /></SVG> );

	const selectMedia = ( media ) => {
		onSelect( media );
		setIsEditing( ! isEditing );
	};

	const selectURL = ( URL ) => {
		onSelectURL( URL );
		setIsEditing( ! isEditing );
	};

	const onCancel = () => {
		setIsEditing( ! isEditing );
	};

	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
		setIsEditing( true );
	};

	const editMediaButton = (
		<BlockControls>
			<Toolbar>
				<IconButton
					className={ classnames( 'components-icon-button components-toolbar__control', { 'is-active': isEditing } ) }
					label={ __( 'Edit audio' ) }
					onClick={ () => setIsEditing( ! mediaURL ? true : ! isEditing ) }
					icon={ editImageIcon }
				/>
			</Toolbar>
		</BlockControls>
	);

	const mediaPlaceholder = (
		<MediaPlaceholder
			icon={ <BlockIcon icon={ 'edit' } /> }
			onCancel={ mediaURL && onCancel }
			onSelect={ selectMedia }
			onSelectMedia={ selectMedia }
			onSelectURL={ selectURL }
			accept={ accepts }
			allowedTypes={ allowedTypes }
			className={ className }
			mediaURL={ mediaURL }
			accepts={ 'audio/*' }
			value={ value }
			notices={ notices }
			onError={ onUploadError }
		/>
	);

	return (
		<Fragment>
			{ editMediaButton }
			{ ! isEditing && children }
			{ isEditing && mediaPlaceholder }
		</Fragment>
	);
};

export default withNotices( MediaFlow );
