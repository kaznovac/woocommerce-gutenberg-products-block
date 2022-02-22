/**
 * External dependencies
 */
import { shopper as wcShopper } from '@woocommerce/e2e-utils';

/**
 * Internal dependencies
 */
import { getBlockPagePermalink } from './get-block-page-permalink';

export const shopper = {
	...wcShopper,

	goToCheckoutBlock: async () => {
		const checkoutBlockPermalink = await getBlockPagePermalink(
			`Checkout Block`
		);

		await page.goto( checkoutBlockPermalink, {
			waitUntil: 'networkidle0',
		} );
		await page.waitForSelector( 'h1', { text: 'Checkout' } );
	},

	productIsInCheckoutBlock: async ( productTitle, quantity, total ) => {
		// Make sure Order summary is expanded
		const [ button ] = await page.$x(
			`//button[contains(@aria-expanded, 'false')]//span[contains(text(), 'Order summary')]`
		);
		if ( button ) {
			await button.click();
		}
		await page.waitForSelector( 'span', {
			text: productTitle,
		} );
		await page.waitForSelector(
			'div.wc-block-components-order-summary-item__quantity',
			{
				text: quantity,
			}
		);
		await page.waitForSelector(
			'span.wc-block-components-product-price__value',
			{
				text: total,
			}
		);
	},

	placeOrder: async () => {
		await expect( page ).toClick( '.wc-block-components-button__text', {
			text: 'Place Order',
		} );
		page.waitForNavigation( {
			waitUntil: 'networkidle0',
		} );
	},

	// prettier-ignore
	fillBillingDetails: async ( customerBillingDetails ) => {
		await expect( page ).toFill( '#billing-first_name', customerBillingDetails.firstname );
		await expect( page ).toFill( '#billing-last_name', customerBillingDetails.lastname );
		await expect( page ).toFill( '#billing-company', customerBillingDetails.company );
		await expect( page ).toFill( '#billing-address_1', customerBillingDetails.addressfirstline );
		await expect( page ).toFill( '#billing-address_2', customerBillingDetails.addresssecondline );
		await expect( page ).toFill( '#billing-country input', customerBillingDetails.country );
		await expect( page ).toFill( '#billing-city', customerBillingDetails.city );
		await expect( page ).toFill( '#billing-state input', customerBillingDetails.state );
		await expect( page ).toFill( '#billing-postcode', customerBillingDetails.postcode );
		await expect( page ).toFill( '#phone', customerBillingDetails.phone );
	},

	// prettier-ignore
	verifyBillingDetails: async ( customerBillingDetails ) => {
		await expect( page ).toMatch( customerBillingDetails.firstname );
		await expect( page ).toMatch( customerBillingDetails.lastname );
		await expect( page ).toMatch( customerBillingDetails.company );
		await expect( page ).toMatch( customerBillingDetails.addressfirstline );
		await expect( page ).toMatch( customerBillingDetails.addresssecondline );
		await expect( page ).toMatch( customerBillingDetails.country );
		await expect( page ).toMatch( customerBillingDetails.city );
		await expect( page ).toMatch( customerBillingDetails.state );
		await expect( page ).toMatch( customerBillingDetails.postcode );
		await expect( page ).toMatch( customerBillingDetails.phone );
	},

	// prettier-ignore
	fillShippingDetails: async ( customerShippingDetails ) => {
		await expect( page ).toFill( '#shipping-first_name', customerShippingDetails.firstname );
		await expect( page ).toFill( '#shipping-last_name', customerShippingDetails.lastname );
		await expect( page ).toFill( '#shipping-company', customerShippingDetails.company );
		await expect( page ).toFill( '#shipping-address_1', customerShippingDetails.addressfirstline );
		await expect( page ).toFill( '#shipping-address_2', customerShippingDetails.addresssecondline );
		await expect( page ).toFill( '#shipping-country input', customerShippingDetails.country );
		await expect( page ).toFill( '#shipping-city', customerShippingDetails.city );
		await expect( page ).toFill( '#shipping-state input', customerShippingDetails.state );
		await expect( page ).toFill( '#shipping-postcode', customerShippingDetails.postcode );
		await expect( page ).toFill( '#shipping-phone', customerShippingDetails.phone );
	},

	// prettier-ignore
	verifyShippingDetails: async ( customerShippingDetails ) => {
		await expect( page ).toMatch( customerShippingDetails.firstname );
		await expect( page ).toMatch( customerShippingDetails.lastname );
		await expect( page ).toMatch( customerShippingDetails.company );
		await expect( page ).toMatch( customerShippingDetails.addressfirstline );
		await expect( page ).toMatch( customerShippingDetails.addresssecondline );
		await expect( page ).toMatch( customerShippingDetails.country );
		await expect( page ).toMatch( customerShippingDetails.city );
		await expect( page ).toMatch( customerShippingDetails.state );
		await expect( page ).toMatch( customerShippingDetails.postcode );
		await expect( page ).toMatch( customerShippingDetails.phone );
	}

	goToBlockPage: async ( title ) => {
		await page.goto( await getBlockPagePermalink( title ), {
			waitUntil: 'networkidle0',
		} );

		await expect( page ).toMatchElement( 'h1', { text: title } );
	},
};
