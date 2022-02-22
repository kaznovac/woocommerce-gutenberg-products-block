/**
 * Internal dependencies
 */
import { shopper } from '../../../utils';

const block = {
	name: 'Mini Cart Block',
};

if ( process.env.WOOCOMMERCE_BLOCKS_PHASE < 3 )
	// eslint-disable-next-line jest/no-focused-tests
	test.only( `skipping ${ block.name } tests`, () => {} );

describe( 'Shopper → Mini Cart → Can open/close the drawer', () => {
	it( 'The drawer opens when shopper clicks on the mini cart icon', async () => {
		await shopper.goToBlockPage( block.name );

		await page.click( '.wc-block-mini-cart__button' );

		await page.waitForTimeout( 500 ); // Mini Cart Drawer takes 300ms to open.

		await expect( page ).toMatchElement( '.wc-block-mini-cart__drawer', {
			text: 'Start shopping',
		} );
	} );

	it( 'The drawer closes when shopper clicks on the drawer close button', async () => {
		await shopper.goToBlockPage( block.name );

		await page.click( '.wc-block-mini-cart__button' );

		await page.waitForTimeout( 500 ); // Mini Cart Drawer takes 300ms to open.

		await expect( page ).toMatchElement( '.wc-block-mini-cart__drawer', {
			text: 'Start shopping',
		} );

		await page.click(
			'.wc-block-mini-cart__drawer .components-modal__header button'
		);

		await expect( page ).not.toMatchElement(
			'.wc-block-mini-cart__drawer',
			{
				text: 'Start shopping',
			}
		);
	} );

	it( 'The drawer closes when shopper clicks outside the drawer', async () => {
		await shopper.goToBlockPage( block.name );

		await page.click( '.wc-block-mini-cart__button' );

		await page.waitForTimeout( 500 ); // Mini Cart Drawer takes 300ms to open.

		await expect( page ).toMatchElement( '.wc-block-mini-cart__drawer', {
			text: 'Start shopping',
		} );

		await page.mouse.click( 50, 200 );

		await expect( page ).not.toMatchElement(
			'.wc-block-mini-cart__drawer',
			{
				text: 'Start shopping',
			}
		);
	} );
} );
