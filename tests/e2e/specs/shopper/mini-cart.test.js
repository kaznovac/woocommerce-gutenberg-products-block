/**
 * Internal dependencies
 */
import { shopper } from '../../../utils';

const block = {
	name: 'Mini Cart Block',
};

if ( process.env.WOOCOMMERCE_BLOCKS_PHASE < 3 ) {
	// eslint-disable-next-line jest/no-focused-tests
	test.only( `skipping ${ block.name } tests`, () => {} );
}

describe( 'Shopper → Mini Cart', () => {
	beforeEach( async () => {
		await shopper.goToBlockPage( block.name );
	} );

	describe( 'Icon', () => {
		it( 'Shopper can see the Mini Cart icon and it badge on the front end', async () => {
			await expect( page ).toMatchElement( '.wc-block-mini-cart' );
			await expect( page ).toMatchElement(
				'.wc-block-mini-cart__button'
			);
			await expect( page ).toMatchElement(
				'.wc-block-mini-cart__quantity-badge'
			);

			// Make sure the initial quantity is 0.
			await expect( page ).toMatchElement(
				'.wc-block-mini-cart__amount',
				{
					text: '$0',
				}
			);
			await expect( page ).toMatchElement( '.wc-block-mini-cart__badge', {
				text: '0',
			} );
		} );
	} );

	describe( 'Drawer', () => {
		it( 'The drawer opens when shopper clicks on the mini cart icon', async () => {
			await page.click( '.wc-block-mini-cart__button' );

			await expect( page ).toMatchElement(
				'.wc-block-mini-cart__drawer',
				{
					text: 'Start shopping',
				}
			);
		} );

		it( 'The drawer closes when shopper clicks on the drawer close button', async () => {
			await page.click( '.wc-block-mini-cart__button' );

			await expect( page ).toMatchElement(
				'.wc-block-mini-cart__drawer',
				{
					text: 'Start shopping',
				}
			);

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
			await page.click( '.wc-block-mini-cart__button' );

			await expect( page ).toMatchElement(
				'.wc-block-mini-cart__drawer',
				{
					text: 'Start shopping',
				}
			);

			await page.mouse.click( 50, 200 );

			await expect( page ).not.toMatchElement(
				'.wc-block-mini-cart__drawer',
				{
					text: 'Start shopping',
				}
			);
		} );
	} );

	describe( 'Filled mini cart', () => {
		beforeAll( async () => {
			await shopper.emptyCart();
		} );

		afterEach( async () => {
			await shopper.emptyCart();
		} );

		it( 'The Mini Cart title shows correct amount', async () => {
			await page.click(
				'.wc-block-grid__product:first-child .add_to_cart_button'
			);

			await expect( page ).toMatchElement( '.wc-block-mini-cart__title', {
				text: 'Your cart (1 item)',
				timeout: 5000,
			} );

			await page.mouse.click( 50, 200 );

			await page.click(
				'.wc-block-grid__product:last-child .add_to_cart_button'
			);

			await expect( page ).toMatchElement( '.wc-block-mini-cart__title', {
				text: 'Your cart (2 items)',
				timeout: 5000,
			} );
		} );

		it( 'The Mini Cart products table show added products', async () => {
			const products = await page.$$(
				'.wc-block-all-products .wc-block-grid__product'
			);
			if ( products.length === 0 ) {
				return;
			}

			// Get a random product to ensure the test isn't false positive.
			const product =
				products[ Math.floor( Math.random() * products.length ) ];
			const productTitle = await page.evaluate( ( el ) => {
				return el.querySelector( '.wc-block-components-product-name' )
					.textContent;
			}, product );
			await page.evaluate( ( el ) => {
				el.querySelector( '.add_to_cart_button' ).click();
			}, product );
			await expect( page ).toMatchElement(
				'.wc-block-mini-cart__products-table',
				{
					text: productTitle,
					timeout: 5000,
				}
			);
		} );

		it( 'Filled Mini Cart footer contains subtotal, view cart button, and go to checkout buttons', async () => {
			await page.click( '.add_to_cart_button' );

			await expect( page ).toMatchElement( '.wc-block-mini-cart__title', {
				text: 'Your cart',
				timeout: 5000,
			} );

			await expect( page ).toMatchElement(
				'.wc-block-mini-cart__footer',
				{
					text: 'Subtotal',
				}
			);

			await expect( page ).toMatchElement(
				'.wc-block-mini-cart__footer-cart',
				{
					text: 'View my cart',
				}
			);

			await expect( page ).toMatchElement(
				'.wc-block-mini-cart__footer-checkout',
				{
					text: 'Go to checkout',
				}
			);
		} );
	} );
	describe( 'Remove product', () => {
		beforeAll( async () => {
			await shopper.emptyCart();
		} );

		afterAll( async () => {
			await shopper.emptyCart();
		} );

		it( 'Can remove product from Mini Cart', async () => {
			await page.click( '.add_to_cart_button' );

			await expect( page ).toMatchElement( '.wc-block-mini-cart__title', {
				text: 'Your cart (1 item)',
				timeout: 5000,
			} );

			await page.waitForTimeout( 500 ); // Ensure the drawer is fully opened.

			await page.click( '.wc-block-cart-item__remove-link' );

			await expect( page ).toMatchElement(
				'.wc-block-mini-cart__drawer',
				{
					text: 'Your cart is currently empty!',
					timeout: 5000,
				}
			);
		} );
	} );
} );
