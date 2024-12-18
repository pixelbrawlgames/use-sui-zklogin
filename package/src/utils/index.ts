export * as session from './session';
import { getExtendedEphemeralPublicKey } from '@mysten/sui/zklogin';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { jwtDecode } from 'jwt-decode';
import { SetupData, TJwtPayload } from '../models';

export const getJWT = () => {
	const urlFragment = window.location.hash.substring(1);
	const urlParams = new URLSearchParams(urlFragment);
	const jwt = urlParams.get('id_token') || '';
	let jwtPayload: TJwtPayload | null = null;
	if (jwt) {
		// remove the URL fragment
		window.history.replaceState(null, '', window.location.pathname);
		jwtPayload = jwtDecode(jwt);
	}
	return { jwt, jwtPayload };
};

interface GetZkProofsParams {
	setupData: SetupData;
	jwt: string;
	salt: string;
	urlZkProver: string;
}
export const getZkProofs = async ({
	setupData,
	jwt,
	salt,
	urlZkProver,
}: GetZkProofsParams) => {
	const ephemeralKeyPair = keypairFromSecretKey(setupData.ephemeralPrivateKey);
	const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();
	const payload = JSON.stringify(
		{
			maxEpoch: setupData.maxEpoch,
			jwtRandomness: setupData.randomness,
			extendedEphemeralPublicKey:
				getExtendedEphemeralPublicKey(ephemeralPublicKey),
			jwt,
			salt,
			keyClaimName: 'sub',
		},
		null,
		2
	);

	console.debug('Requesting ZK proof with:', payload);

	try {
		const response = await fetch(urlZkProver, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: payload,
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch ZK proofs. Status: ${response.status} ${response.statusText}`
			);
		}

		const zkProofs = await response.json();
		console.debug('[getZkProofs] ZK proving service success');
		return zkProofs;
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
