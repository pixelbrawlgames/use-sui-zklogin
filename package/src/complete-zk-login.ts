import { jwtToAddress } from '@mysten/sui/zklogin';
import * as utils from './utils';
import { AccountData } from './models';

/**
 * Parameters required to complete the ZK Login process
 */
export interface CompleteZkLoginParams {
	urlZkProver: string; // URL of the Zero-Knowledge proof generation service
	generateSalt: (options?: any) => Promise<{ salt: number }>; // Function to generate a unique user salt
}

type CompleteZkLoginReturn = {
	accounts: AccountData[];
	address: string;
};

/**
 * Completes the Zero-Knowledge (ZK) Login process for Sui blockchain authentication
 *
 * This function handles the final steps of ZK Login:
 * 1. Decode the JWT token from the OAuth provider
 * 2. Generate a unique user salt
 * 3. Derive the user's Sui address
 * 4. Generate Zero-Knowledge proofs
 * 5. Save user account information
 *
 * @param params - Configuration and salt generation parameters
 * @returns Object containing saved accounts and user address, or undefined
 * @throws {Error} If the login completion process fails
 */
export const completeZkLogin = async ({
	urlZkProver,
	generateSalt,
}: CompleteZkLoginParams): Promise<CompleteZkLoginReturn | undefined> => {
	try {
		// Retrieve and decode the JWT token obtained during the initial login process
		// Reference: https://docs.sui.io/concepts/cryptography/zklogin#decoding-jwt
		const { jwt, jwtPayload } = utils.getJWT();
		if (!jwt) return;

		// Validate essential JWT payload components
		if (!jwtPayload?.sub || !jwtPayload?.aud) {
			console.warn('[completeZkLogin] missing jwt.sub or jwt.aud');
			return;
		}

		// Generate a unique user salt for address derivation
		// Reference: https://docs.sui.io/concepts/cryptography/zklogin#user-salt-management
		const saltResponse: { salt: number } | null = await generateSalt(jwt);
		if (!saltResponse) return;
		const userSalt = BigInt(saltResponse.salt);

		// Derive the user's Sui blockchain address from the JWT and salt
		// Reference: https://docs.sui.io/concepts/cryptography/zklogin#get-the-users-sui-address
		const userAddr = jwtToAddress(jwt, userSalt);

		// Retrieve and validate the login setup data saved during initial authentication
		const setupData = utils.session.loadSetupData();
		if (!setupData) {
			console.warn('[completeZkLogin] missing session storage data');
			return;
		}

		// Clear the initial setup data to prevent reuse
		utils.session.clearSetupData();

		// Check for duplicate logins to prevent multiple accounts from the same provider
		for (const account of utils.session.loadAccounts()) {
			if (userAddr === account.userAddr) {
				console.warn(
					`[completeZkLogin] already logged in with this ${setupData.provider} account`
				);
				return;
			}
		}

		// Generate Zero-Knowledge proofs to authenticate the user
		// Reference: https://docs.sui.io/concepts/cryptography/zklogin#get-the-zero-knowledge-proof
		const zkProofs = await utils.getZkProofs({
			setupData,
			jwt,
			salt: userSalt.toString(),
			urlZkProver,
		});
		if (!zkProofs) return;

		// Save the user's account information for future transactions
		// Enables persistent authentication across the application
		return {
			accounts: utils.session.saveAccount({
				setupData,
				userAddr,
				zkProofs,
				userSalt: userSalt.toString(),
				jwtPayload,
			}),
			address: userAddr,
		};
	} catch (err) {
		console.error('[completeZkLogin] An error occurred:', err);
		throw new Error('Failed to complete ZK login. Please try again.');
	}
};
