/**
 * External dependencies
 */
import React from 'react';
import { TouchableWithoutFeedback, Text } from 'react-native';
/**
 * Internal dependencies
 */
import Video from './video-player';
import {
	mediaUploadSync,
	requestImageFailedRetryDialog,
	requestImageUploadCancelDialog,
} from 'react-native-gutenberg-bridge';

/**
 * WordPress dependencies
 */
import {
	Icon,
	Toolbar,
	ToolbarButton,
	withTheme,
	Box,
} from '@wordpress/components';

import {
	Caption,
	MediaPlaceholder,
	MediaUpload,
	MEDIA_TYPE_VIDEO,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { isURL } from '@wordpress/url';
import { doAction, hasAction } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import MediaUploadProgress from '../image/media-upload-progress';
import style from './style.scss';
import styles from './styles';
import SvgIcon from './icon';
import SvgIconRetry from './icon-retry';

const VIDEO_ASPECT_RATIO = 1.7;

class VideoEdit extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			isCaptionSelected: false,
			showSettings: false,
			videoContainerHeight: 0,
		};

		this.mediaUploadStateReset = this.mediaUploadStateReset.bind( this );
		this.onSelectMediaUploadOption = this.onSelectMediaUploadOption.bind( this );
		this.finishMediaUploadWithSuccess = this.finishMediaUploadWithSuccess.bind( this );
		this.finishMediaUploadWithFailure = this.finishMediaUploadWithFailure.bind( this );
		this.updateMediaProgress = this.updateMediaProgress.bind( this );
		this.onVideoPressed = this.onVideoPressed.bind( this );
		this.onVideoContainerLayout = this.onVideoContainerLayout.bind( this );
		this.onFocusCaption = this.onFocusCaption.bind( this );
	}

	componentDidMount() {
		const { attributes } = this.props;
		if ( attributes.id && ! isURL( attributes.src ) ) {
			mediaUploadSync();
		}
	}

	componentWillUnmount() {
		// this action will only exist if the user pressed the trash button on the block holder
		if ( hasAction( 'blocks.onRemoveBlockCheckUpload' ) && this.state.isUploadInProgress ) {
			doAction( 'blocks.onRemoveBlockCheckUpload', this.props.attributes.id );
		}
	}

	static getDerivedStateFromProps( props, state ) {
		// Avoid a UI flicker in the toolbar by insuring that isCaptionSelected
		// is updated immediately any time the isSelected prop becomes false
		return {
			isCaptionSelected: props.isSelected && state.isCaptionSelected,
		};
	}

	onVideoPressed() {
		const { attributes } = this.props;

		if ( this.state.isUploadInProgress ) {
			requestImageUploadCancelDialog( attributes.id );
		} else if ( attributes.id && ! isURL( attributes.src ) ) {
			requestImageFailedRetryDialog( attributes.id );
		}

		this.setState( {
			isCaptionSelected: false,
		} );
	}

	onFocusCaption() {
		if ( ! this.state.isCaptionSelected ) {
			this.setState( { isCaptionSelected: true } );
		}
	}

	updateMediaProgress( payload ) {
		const { setAttributes } = this.props;
		if ( payload.mediaUrl ) {
			setAttributes( { url: payload.mediaUrl } );
		}
		if ( ! this.state.isUploadInProgress ) {
			this.setState( { isUploadInProgress: true } );
		}
	}

	finishMediaUploadWithSuccess( payload ) {
		const { setAttributes } = this.props;
		setAttributes( { src: payload.mediaUrl, id: payload.mediaServerId } );
		this.setState( { isUploadInProgress: false } );
	}

	finishMediaUploadWithFailure( payload ) {
		const { setAttributes } = this.props;
		setAttributes( { id: payload.mediaId } );
		this.setState( { isUploadInProgress: false } );
	}

	mediaUploadStateReset() {
		const { setAttributes } = this.props;
		setAttributes( { id: null, src: null } );
		this.setState( { isUploadInProgress: false } );
	}

	onSelectMediaUploadOption( { id, url } ) {
		const { setAttributes } = this.props;
		setAttributes( { id, src: url } );
	}

	onVideoContainerLayout( event ) {
		const { width } = event.nativeEvent.layout;
		const height = width / VIDEO_ASPECT_RATIO;
		if ( height !== this.state.videoContainerHeight ) {
			this.setState( { videoContainerHeight: height } );
		}
	}

	getIcon( isRetryIcon, isMediaPlaceholder ) {
		if ( isRetryIcon ) {
			return <Icon icon={ SvgIconRetry } { ...style.icon } />;
		}

		const iconStyle = this.props.useStyle( style.icon, style.iconDark );
		return <Icon icon={ SvgIcon } { ...( ! isMediaPlaceholder ? style.iconUploading : iconStyle ) } />;
	}

	render() {
		const { attributes, isSelected } = this.props;
		const { id, src } = attributes;
		const { videoContainerHeight } = this.state;

		const toolbarEditButton = (
			<MediaUpload allowedTypes={ [ MEDIA_TYPE_VIDEO ] }
				onSelect={ this.onSelectMediaUploadOption }
				render={ ( { open, getMediaOptions } ) => {
					return (
						<Toolbar>
							{ getMediaOptions() }
							<ToolbarButton
								label={ __( 'Edit video' ) }
								icon="edit"
								onClick={ open }
							/>
						</Toolbar>
					);
				} } >
			</MediaUpload>
		);

		if ( ! id ) {
			return (
				<Box flex={ 1 }>
					<MediaPlaceholder
						allowedTypes={ [ MEDIA_TYPE_VIDEO ] }
						onSelect={ this.onSelectMediaUploadOption }
						icon={ this.getIcon( false, true ) }
						onFocus={ this.props.onFocus }
					/>
				</Box>
			);
		}

		return (
			<TouchableWithoutFeedback onPress={ this.onVideoPressed } disabled={ ! isSelected }>
				<Box>
					{ ! this.state.isCaptionSelected &&
						<BlockControls>
							{ toolbarEditButton }
						</BlockControls> }
					<InspectorControls>
						{ false && <ToolbarButton //Not rendering settings button until it has an action
							label={ __( 'Video Settings' ) }
							icon="admin-generic"
							onClick={ () => ( null ) }
						/> }
					</InspectorControls>
					<MediaUploadProgress
						mediaId={ id }
						onFinishMediaUploadWithSuccess={ this.finishMediaUploadWithSuccess }
						onFinishMediaUploadWithFailure={ this.finishMediaUploadWithFailure }
						onUpdateMediaProgress={ this.updateMediaProgress }
						onMediaUploadStateReset={ this.mediaUploadStateReset }
						renderContent={ ( { isUploadInProgress, isUploadFailed, retryMessage } ) => {
							const showVideo = isURL( src ) && ! isUploadInProgress && ! isUploadFailed;
							const icon = this.getIcon( isUploadFailed, false );
							const styleIconContainer = isUploadFailed ? style.modalIconRetry : style.modalIcon;

							const iconContainer = (
								<Box { ...styleIconContainer } >
									{ icon }
								</Box>
							);

							const videoStyle = {
								height: videoContainerHeight,
								...style.video,
							};

							const containerStyle = showVideo && isSelected ? styles.containerFocused : styles.container;

							return (
								<Box onLayout={ this.onVideoContainerLayout } { ...containerStyle }>
									{ showVideo ?
										( <Box { ...style.videoContainer }>
											<Video
												isSelected={ isSelected && ! this.state.isCaptionSelected }
												style={ videoStyle }
												source={ { uri: src } }
												paused={ true }
											/>
										</Box> ) :
										( <Box { ...{ height: videoContainerHeight, width: '100%', ...style.placeholder } } >
											{ videoContainerHeight > 0 && iconContainer }
											{ isUploadFailed && <Text style={ style.uploadFailedText }>{ retryMessage }</Text> }
										</Box> )
									}
								</Box>
							);
						} }
					/>
					<Caption
						clientId={ this.props.clientId }
						isSelected={ this.state.isCaptionSelected }
						onFocus={ this.onFocusCaption }
						onBlur={ this.props.onBlur } // always assign onBlur as props
					/>
				</Box>
			</TouchableWithoutFeedback>
		);
	}
}

export default withTheme( VideoEdit );
