/* global localStorage */

/**
 * External dependencies
 */
import { merchant as wcMerchant } from '@woocommerce/e2e-utils';

export const merchant = {
	...wcMerchant,

	preventCompatibilityNotice: async () => {
		await page.evaluate( () => {
			localStorage.setItem(
				'wc-blocks_dismissed_compatibility_notices',
				'["checkout"]'
			);
		} );
	},

	reactivateCompatibilityNotice: async () => {
		await page.evaluate( () => {
			localStorage.removeItem(
				'wc-blocks_dismissed_compatibility_notices'
			);
		} );
	},
};
