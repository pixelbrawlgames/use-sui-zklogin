// Export all from session module
export * as session from './session';

// Import necessary cryptographic and JWT-related functions
import { getExtendedEphemeralPublicKey } from '@mysten/sui/zklogin';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { jwtDecode } from 'jwt-decode';
import { SetupData, TJwtPayload, ZKProofs } from '../models';

// Extract JWT from URL fragment and decode its payload
export const getJWT = () => {
	const urlFragment = window.location.hash.substring(1);
	const urlParams = new URLSearchParams(urlFragment);
	const jwt = urlParams.get('id_token') || '';
	let jwtPayload: TJwtPayload | null = null;

	if (jwt) {
		// Clear JWT from URL for security
		window.history.replaceState(null, '', window.location.pathname);
		jwtPayload = jwtDecode(jwt);
	}
	return { jwt, jwtPayload };
};

// Interface for ZK proofs generation parameters
interface GetZkProofsParams {
	setupData: SetupData;
	jwt: string;
	salt: string;
	urlZkProver: string;
}

// Generate ZK proofs using a remote prover service
export const getZkProofs = async ({
	setupData,
	jwt,
	salt,
	urlZkProver,
}: GetZkProofsParams) => {
	// Validate inputs
	if (!setupData?.ephemeralPrivateKey || !jwt || !salt || !urlZkProver) {
		throw new Error('Missing required parameters');
	}

	// Generate keypair and public key from setup data
	const ephemeralKeyPair = keypairFromSecretKey(setupData.ephemeralPrivateKey);
	const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();

	// Prepare payload for ZK prover service
	const payload = JSON.stringify({
		maxEpoch: setupData.maxEpoch,
		jwtRandomness: setupData.randomness,
		extendedEphemeralPublicKey:
			getExtendedEphemeralPublicKey(ephemeralPublicKey),
		jwt,
		salt,
		keyClaimName: 'sub',
	});

	try {
		// Send request to ZK prover service
		const response = await fetch(urlZkProver, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: payload,
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch ZK proofs. Status: ${response.status} ${response.statusText}`
			);
		}

		const zkProofs = await response.json();
		console.debug('[getZkProofs] ZK proving service success');
		return zkProofs as ZKProofs;
	} catch (error) {
		console.error('[getZkProofs] ZK proving service error:', error);
		return null;
	}
};

/**
 * Create a keypair from a base64-encoded secret key
 */
const keypairFromSecretKey = (privateKeyBase64: string): Ed25519Keypair => {
	const keyPair = decodeSuiPrivateKey(privateKeyBase64);
	return Ed25519Keypair.fromSecretKey(keyPair.secretKey);
};
