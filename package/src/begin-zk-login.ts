// Import necessary Sui and cryptographic dependencies
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/sui/zklogin';
import { type SuiClient } from '@mysten/sui/dist/cjs/client';

// Import custom types and utilities
import { OpenIdProvider, ProviderConfig, OpenIdAuthParams } from './models';
import {
	DEFAULT_MAX_EPOCH,
	DEFAULT_OAUTH_RESPONSE_TYPE,
	DEFAULT_OAUTH_SCOPE,
} from './const';
import * as utils from './utils';

/**
 * Options for initiating ZK Login process
 */
interface BeginZkLoginParams {
	suiClient: SuiClient; // Sui blockchain client for system state queries
	provider: OpenIdProvider; // Selected OpenID identity provider
	providersConfig: ProviderConfig; // Configuration map for OpenID providers
	authParams?: OpenIdAuthParams; // Additional OAuth parameters
	maxEpoch?: number; // Maximum epoch number for time-based validation
}

/**
 * Initiates the Zero-Knowledge (ZK) Login flow for Sui blockchain authentication
 *
 * This function prepares the necessary cryptographic components for ZK Login:
 * 1. Generates an ephemeral keypair
 * 2. Creates a nonce for OAuth authentication
 * 3. Saves setup data for later completion of the login process
 * 4. Redirects to the selected OpenID provider for authentication
 *
 * @param {SuiClient} suiClient - Sui blockchain client for system state queries
 * @param {OpenIdProvider} provider - Selected OpenID identity provider
 * @param {ProviderConfig} providersConfig - Configuration map for OpenID providers
 * @param {OpenIdAuthParams} [authParams] - Additional OAuth parameters
 * @param {number} [maxEpoch] - Maximum epoch number for time-based validation
 * @throws {Error} If the login initiation process fails
 */
export const beginZkLogin = async ({
	suiClient,
	provider,
	providersConfig,
	authParams,
	maxEpoch = DEFAULT_MAX_EPOCH,
}: BeginZkLoginParams) => {
	// Validate required input parameters
	if (!suiClient || !provider || !providersConfig) {
		throw new Error('[beginZkLogin] Missing required parameters.');
	}

	try {
		// Retrieve the current Sui blockchain epoch and calculate the maximum valid epoch
		const { epoch } = await suiClient.getLatestSuiSystemState();
		const maxValidEpoch = Number(epoch) + maxEpoch; // Ephemeral key validity period

		// Generate cryptographic components for ZK Login
		const ephemeralKeyPair = new Ed25519Keypair(); // Temporary keypair for this login session
		const randomness = generateRandomness(); // Cryptographic randomness for nonce generation

		// Create a unique nonce that binds the ephemeral public key and epoch
		const nonce = generateNonce(
			ephemeralKeyPair.getPublicKey(),
			maxValidEpoch,
			randomness
		);

		// Persist login setup data in session storage for use after OAuth redirect
		utils.session.saveSetupData({
			provider,
			maxEpoch: maxValidEpoch,
			randomness: randomness.toString(),
			ephemeralPrivateKey: ephemeralKeyPair.getSecretKey(),
		});

		// Prepare OAuth authentication parameters with sensible defaults
		const urlParamsBase = {
			redirect_uri: authParams?.redirect_uri || window.location.origin,
			response_type: authParams?.response_type || DEFAULT_OAUTH_RESPONSE_TYPE,
			scope: authParams?.scope || DEFAULT_OAUTH_SCOPE,
			nonce,
		};

		// Construct provider-specific login URL
		const providerConfig = providersConfig[provider];
		if (!providerConfig) {
			throw new Error(`Unsupported provider: ${provider}`);
		}

		// Merge extra parameters and construct URL
		const { extraParams = {} } = providerConfig;
		const urlParams = new URLSearchParams({
			...urlParamsBase,
			...extraParams,
			client_id: providerConfig.clientId,
		});

		// Construct full login URL
		const loginUrl = `${providerConfig.authUrl}?${urlParams.toString()}`;

		// Redirect user to OpenID provider for authentication
		window.location.replace(loginUrl);
	} catch (err) {
		console.error('[beginZkLogin] ZK Login initialization failed:', err);
		throw new Error('Failed to begin ZK login. Please try again.');
	}
};
