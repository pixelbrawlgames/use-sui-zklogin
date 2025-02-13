import {
	SetupData,
	AccountData,
	TJwtPayload,
	BlockchainAddress,
	ZKProofs,
} from '../models';
import { SETUP_DATA_KEY, ACCOUNT_DATA_KEY } from '../const';

// Saves setup data to session storage after converting to JSON string
export const saveSetupData = (data: SetupData, storageKey = SETUP_DATA_KEY) => {
	localStorage.setItem(storageKey, JSON.stringify(data));
};

// Loads and parses setup data from session storage
// Returns null if no data exists
export const loadSetupData = (
	storageKey = SETUP_DATA_KEY
): SetupData | null => {
	const dataRaw = localStorage.getItem(storageKey);
	if (!dataRaw) {
		return null;
	}
	const data: SetupData = JSON.parse(dataRaw);
	return data;
};

// Removes setup data from session storage
export const clearSetupData = (storageKey = SETUP_DATA_KEY) => {
	localStorage.removeItem(storageKey);
};

// Interface defining required parameters for saving an account
interface SaveAccountParams {
	setupData: SetupData;
	userAddr: string;
	zkProofs: ZKProofs;
	userSalt: string;
	jwtPayload: TJwtPayload;
}

// Saves account data and returns updated accounts array
export const saveAccount = (
	{ setupData, userAddr, zkProofs, userSalt, jwtPayload }: SaveAccountParams,
	storageKey = ACCOUNT_DATA_KEY
): AccountData[] => {
	// Create account object with required fields
	const account: AccountData = {
		provider: setupData.provider,
		userAddr: userAddr as BlockchainAddress,
		zkProofs,
		ephemeralPrivateKey: setupData.ephemeralPrivateKey,
		userSalt: userSalt.toString(),
		sub: jwtPayload.sub || '',
		aud: jwtPayload.aud
			? typeof jwtPayload.aud === 'string'
				? jwtPayload.aud
				: jwtPayload.aud[0]
			: '',
		maxEpoch: setupData.maxEpoch,
	};

	// Add optional fields if they exist in JWT payload
	if (jwtPayload.email) account.email = jwtPayload.email;
	if (typeof jwtPayload.email_verified === 'boolean')
		account.email_verified = jwtPayload.email_verified;

	// Prepend new account to existing accounts and save
	const newAccounts = [account, ...loadAccounts()];
	localStorage.setItem(storageKey, JSON.stringify(newAccounts));
	return newAccounts;
};

// Loads all accounts from session storage
// Returns empty array if no accounts exist
export const loadAccounts = (storageKey = ACCOUNT_DATA_KEY): AccountData[] => {
	const dataRaw = localStorage.getItem(storageKey);
	if (!dataRaw) {
		return [];
	}
	const data: AccountData[] = JSON.parse(dataRaw);
	return data;
};

// Removes all accounts from session storage
export const clearAccounts = (storageKey = ACCOUNT_DATA_KEY) => {
	localStorage.removeItem(storageKey);
};

// Removes a specific account by address and returns updated accounts array
export const clearAccount = (
	accountAddr: string,
	storageKey = ACCOUNT_DATA_KEY
) => {
	const accounts = loadAccounts(storageKey).filter(
		(account) => account.userAddr !== accountAddr
	);
	localStorage.setItem(storageKey, JSON.stringify(accounts));
	return accounts;
};
