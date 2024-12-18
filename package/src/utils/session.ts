import { SetupData, AccountData, TJwtPayload } from '../models';
import { SETUP_DATA_KEY, ACCOUNT_DATA_KEY } from '../const';

/* Setup data utils */
export const saveSetupData = (data: SetupData, storageKey = SETUP_DATA_KEY) => {
	sessionStorage.setItem(storageKey, JSON.stringify(data));
};

export const loadSetupData = (
	storageKey = SETUP_DATA_KEY
): SetupData | null => {
	const dataRaw = sessionStorage.getItem(storageKey);
	if (!dataRaw) {
		return null;
	}
	const data: SetupData = JSON.parse(dataRaw);
	return data;
};

export const clearSetupData = (storageKey = SETUP_DATA_KEY) => {
	sessionStorage.removeItem(storageKey);
};

/* Accounts utils */
interface SaveAccountParams {
	setupData: SetupData;
	userAddr: string;
	zkProofs: any;
	userSalt: string;
	jwtPayload: TJwtPayload;
}
export const saveAccount = (
	{ setupData, userAddr, zkProofs, userSalt, jwtPayload }: SaveAccountParams,
	storageKey = ACCOUNT_DATA_KEY
): AccountData[] => {
	const account: AccountData = {
		provider: setupData.provider,
		userAddr,
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
	if (jwtPayload.email) account.email = jwtPayload.email;
	if (typeof jwtPayload.email_verified === 'boolean')
		account.email_verified = jwtPayload.email_verified;

	const newAccounts = [account, ...loadAccounts()];
	sessionStorage.setItem(storageKey, JSON.stringify(newAccounts));
	return newAccounts;
};

export const loadAccounts = (storageKey = ACCOUNT_DATA_KEY): AccountData[] => {
	const dataRaw = sessionStorage.getItem(storageKey);
	if (!dataRaw) {
		return [];
	}
	const data: AccountData[] = JSON.parse(dataRaw);
	return data;
};

export const clearAccounts = (storageKey = ACCOUNT_DATA_KEY) => {
	sessionStorage.removeItem(storageKey);
};

export const clearAccount = (
	accountAddr: string,
	storageKey = ACCOUNT_DATA_KEY
) => {
	const accounts = loadAccounts(storageKey).filter(
		(account) => account.userAddr !== accountAddr
	);
	sessionStorage.setItem(storageKey, JSON.stringify(accounts));
	return accounts;
};
