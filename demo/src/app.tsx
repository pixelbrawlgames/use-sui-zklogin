import { useState } from 'react';

import { useZkLogin, beginZkLogin, signOut } from 'use-sui-zklogin';
import type { OpenIdProvider, ProviderConfig } from 'use-sui-zklogin';
import { useSuiClient } from '@mysten/dapp-kit';

import GoogleButton from './components/ui/google-btn';
import Loader from './components/ui/loader';
import AccountCard from './components/ui/account-card';
import { IconTrash } from './components/ui/icons';

import styles from './app.module.css';

const providersConfig: ProviderConfig = {
	google: {
		authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
		clientId:
			'42313014371-o080c7716g36th1vbkgubp2p8unudv0g.apps.googleusercontent.com',
	},
	twitch: {
		authUrl: 'https://id.twitch.tv/oauth2/authorize',
		clientId: '',
		extraParams: {
			force_verify: 'true',
			lang: 'en',
			login_type: 'login',
		},
	},
	// ...
};

const App = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const suiClient = useSuiClient();
	const { isLoaded, address, accounts } = useZkLogin({
		urlZkProver: 'https://prover-dev.mystenlabs.com/v1',
		generateSalt: async () => ({ salt: 123456789 }),
	});

	console.log('Status:', isLoaded, address, accounts);

	const handleZkLogin = async (provider: OpenIdProvider) => {
		setLoading(true);
		await beginZkLogin({
			suiClient,
			provider,
			providersConfig,
			authParams: {
				redirect_uri: window.location.href,
			},
		});
	};

	return (
		<div className={styles.app}>
			<Loader loading={!isLoaded || loading} />
			<div className={styles.header}>
				<h1 className={styles.title}>useSuiZkLogin Demo</h1>
				<div className={styles.network}>
					<div className={styles.status} />
					<span className={styles.label}>devNet</span>
				</div>
			</div>
			<div className={styles.content}>
				<div className={styles.box}>
					{accounts.find((account) => account.provider === 'google') ? null : (
						<GoogleButton onClick={() => handleZkLogin('google')} />
					)}
					{accounts.map((account) => (
						<AccountCard account={account} key={account.userAddr} />
					))}
				</div>
				{accounts.length ? (
					<div className={styles.btn} onClick={signOut}>
						<IconTrash style={{ marginRight: '0.5rem' }} />
						Clear All Data
					</div>
				) : null}
			</div>
		</div>
	);
};

export default App;
