export { beginZkLogin } from './begin-zk-login';
export { completeZkLogin } from './complete-zk-login';
export { OpenIdProvider, ProviderConfig, AccountData } from './models';

// Import necessary dependencies and types
import { useEffect, useState } from 'react';
import { AccountData } from './models';
import { CompleteZkLoginParams, completeZkLogin } from './complete-zk-login';
import * as utils from './utils';

// Flags to manage login processing and loaded state
let isProcessing = false;
let isLoaded = false;

// Initialize accounts from session storage
let accounts: AccountData[] = utils.session.loadAccounts();

// Set the current address to the last account's address, or empty string
let address = accounts.length ? accounts[accounts.length - 1].userAddr : '';

// Array to store subscriber callbacks for state changes
let subscribers: Array<() => void> = [];

/**
 * Notify all subscribers about state changes
 * This triggers re-renders or other update mechanisms
 */
const notifySubscribers = () => {
	subscribers.forEach((callback) => callback());
};

/**
 * Fetch ZK login data with processing and loading state management
 * @param options - Parameters required for completing ZK login
 */
const fetchZkLoginData = async (options: CompleteZkLoginParams) => {
	// Prevent multiple simultaneous processing or redundant loads
	if (isProcessing || isLoaded) return;

	// Mark as processing to prevent concurrent requests
	isProcessing = true;

	try {
		// Attempt to complete ZK login
		const loginRes = await completeZkLogin(options);

		// Update accounts and address if login is successful
		if (loginRes) {
			accounts = loginRes.accounts;
			address = loginRes.address;
		}
	} catch (err) {
		console.error('Error during ZK login:', err);
	} finally {
		// Mark as loaded and no longer processing
		isLoaded = true;
		isProcessing = false;

		// Notify subscribers about state changes
		notifySubscribers();
	}
};

type UseZkLoginReturn = {
	isLoaded: boolean;
	address: string;
	accounts: AccountData[];
};
/**
 * Custom hook for managing ZK login state
 * @param {string} urlZkProver - The URL of the Zero-Knowledge proof generation service
 * @param {() => Promise<{salt: number}>} generateSalt - A function to generate a unique user salt. This function accepts an optional parameter and returns a Promise that resolves to an object with a `salt` field of type `number`.
 *
 * @returns {UseZkLoginReturn}
 *   - isLoaded - Indicates whether the login state is loaded.
 *   - address - The current user address.
 *   - accounts - Array of account data associated with the user.
 */
export const useZkLogin = ({
	urlZkProver,
	generateSalt,
}: CompleteZkLoginParams): UseZkLoginReturn => {
	// Force re-render mechanism
	const [, forceRender] = useState(0);

	useEffect(() => {
		// Create a subscriber that forces a re-render
		const subscriber = () => forceRender((prev) => prev + 1);

		// Add subscriber to the list
		subscribers.push(subscriber);

		// Fetch login data if not already loaded
		if (!isLoaded) {
			fetchZkLoginData({ urlZkProver, generateSalt });
		}

		// Cleanup: remove subscriber when component unmounts
		return () => {
			subscribers = subscribers.filter((sub) => sub !== subscriber);
		};
	}, [urlZkProver, generateSalt]); // Re-run if options change

	// Return current login state and account information
	return { isLoaded, address, accounts };
};

/**
 * Sign out of the current ZK login session
 * Clears accounts, resets state, and notifies subscribers
 */
export const signOut = () => {
	// Clear accounts from session storage
	utils.session.clearAccounts();

	// Reset local state
	accounts = [];
	address = '';

	// Notify subscribers about state change
	notifySubscribers();
};

/**
 * Clears the account corresponding to the specified address
 */
export const clearAccount = (accountAddr: string) => {
	accounts = utils.session.clearAccount(accountAddr);
	address = accounts.length ? accounts[accounts.length - 1].userAddr : '';

	// Notify subscribers about state change
	notifySubscribers();
};
