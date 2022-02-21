/**
 * External dependencies
 */
import {
	merchant,
	openDocumentSettingsSidebar,
	uiUnblocked,
} from '@woocommerce/e2e-utils';

import {
	visitBlockPage,
	selectBlockByName,
	saveOrPublish,
} from '@woocommerce/blocks-test-utils';

/**
 * Internal dependencies
 */
import {
	getNormalPagePermalink,
	shopper,
	visitPostOfType,
} from '../../../utils';

const config = require( 'config' );

const block = {
	name: 'Checkout',
};

const simpleProductName = '128GB USB Stick';
const pageName = 'Checkout Block';

if ( process.env.WOOCOMMERCE_BLOCKS_PHASE < 2 )
	// eslint-disable-next-line jest/no-focused-tests
	test.only( `skipping ${ block.name } tests`, () => {} );

describe( `${ block.name } Block (frontend)`, () => {
	let productPermalink;

	beforeAll( async () => {
		// prevent CartCheckoutCompatibilityNotice from appearing
		await merchant.preventCompatibilityNotice();
		await merchant.login();

		// Display all address fields.
		await visitBlockPage( pageName );
		await openDocumentSettingsSidebar();
		await selectBlockByName(
			'woocommerce/checkout-shipping-address-block'
		);
		await expect( page ).toClick( 'label', { text: 'Company' } );
		await expect( page ).toClick( 'label', {
			text: 'Apartment, suite, etc.',
		} );
		await expect( page ).toClick( 'label', { text: 'Phone' } );
		await saveOrPublish();

		// Get product page permalink.
		await visitPostOfType( simpleProductName, 'product' );
		productPermalink = await getNormalPagePermalink();

		await merchant.logout();
	} );

	afterAll( async () => {
		// empty cart from shortcode page
		await shopper.goToCart();
		await shopper.removeFromCart( simpleProductName );
		await merchant.reactivateCompatibilityNotice();
	} );

	it( 'allows customer to have different shipping and billing addresses', async () => {
		await page.goto( productPermalink );
		await shopper.addToCart();
		await shopper.goToCheckoutBlock();

		await page.evaluate( () => {
			const checkbox = document.querySelector(
				'.wc-block-checkout__use-address-for-billing .wc-block-components-checkbox__input'
			);
			if ( checkbox.checked ) {
				checkbox.click();
			}
		} );
		await uiUnblocked();
		await shopper.fillShippingDetails(
			config.get( 'addresses.customer.shipping' )
		);
	} );
} );
