/**
 * External dependencies
 */
import { shallow, mount } from 'enzyme';
import { uniqueId } from 'lodash';

/**
 * Internal dependencies
 */
import { DimensionControl } from '../';

describe( 'DimensionControl', () => {
	const onChangeHandler = jest.fn();
	const onResetHandler = jest.fn();

	afterEach( () => {
		onChangeHandler.mockClear();
		onResetHandler.mockClear();
	} );

	describe( 'rendering', () => {
		it( 'renders with defaults', () => {
			const wrapper = shallow(
				<DimensionControl
					instanceId={ uniqueId() }
					label={ 'Padding' }
				/>
			);
			expect( wrapper ).toMatchSnapshot();
		} );

		it( 'renders with icon and default icon label', () => {
			const wrapper = shallow(
				<DimensionControl
					instanceId={ uniqueId() }
					label={ 'Margin' }
					icon={ 'tablet' }
				/>
			);
			expect( wrapper ).toMatchSnapshot();
		} );

		it( 'renders with icon and custom icon label', () => {
			const wrapper = shallow(
				<DimensionControl
					instanceId={ uniqueId() }
					label={ 'Margin' }
					icon={ 'tablet' }
					iconLabel={ 'Tablet Devices' }
				/>
			);
			expect( wrapper ).toMatchSnapshot();
		} );
	} );

	describe( 'callbacks', () => {
		it( 'should call onSpacingChange handler with correct args on size change', () => {
			const wrapper = mount(
				<DimensionControl
					instanceId={ uniqueId() }
					label={ 'Padding' }
					onSpacingChange={ onChangeHandler }
				/>
			);

			wrapper.find( 'select' ).at( 0 ).simulate( 'change', {
				target: {
					value: 'small',
				},
			} );

			wrapper.find( 'select' ).at( 0 ).simulate( 'change', {
				target: {
					value: 'medium',
				},
			} );

			expect( onChangeHandler ).toHaveBeenCalledTimes( 2 );
			expect( onChangeHandler.mock.calls[ 0 ][ 0 ] ).toEqual( 'small' );
			expect( onChangeHandler.mock.calls[ 1 ][ 0 ] ).toEqual( 'medium' );
		} );

		it( 'should call onReset handler with when no size is provided on change', () => {
			const wrapper = mount(
				<DimensionControl
					instanceId={ uniqueId() }
					label={ 'Padding' }
					onReset={ onResetHandler }
				/>
			);

			wrapper.find( 'select' ).at( 0 ).simulate( 'change', {
				target: {
					value: '', // this happens when you select the "default" <option />
				},
			} );

			expect( onResetHandler ).toHaveBeenCalledTimes( 1 );
		} );
	} );
} );
