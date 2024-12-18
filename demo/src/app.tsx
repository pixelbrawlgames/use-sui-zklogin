import { FC, useState } from 'react';
import {
	useZkLogin,
	beginZkLogin,
	signOut,
	clearAccount,
} from 'use-sui-zklogin';
import type {
	OpenIdProvider,
	ProviderConfig,
	AccountData,
} from 'use-sui-zklogin';
import { useSuiClient } from '@mysten/dapp-kit';
import GoogleButton from './components/ui/google-btn';
import Loader from './components/ui/loader';

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
		generateSalt: () =>
			new Promise<{ salt: number }>((resolve) => resolve({ salt: 123456789 })),
	});
	console.log(isLoaded, address, accounts, 'check');

	const handleZkLogin = async (provider: OpenIdProvider) => {
		setLoading(true);
		await beginZkLogin({
			suiClient,
			provider,
			providersConfig,
		});
	};

	return (
		<div className={styles.app}>
			<Loader loading={!isLoaded || loading} />
			<div className={styles.header}>
				<h1 className={styles.title}>useSuiZkLogin Demo</h1>
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
					<div className={styles.clearBtn} onClick={signOut}>
						Clear All
					</div>
				) : null}
			</div>
		</div>
	);
};

interface P {
	account: AccountData;
}
const AccountCard: FC<P> = ({ account }) => {
	return (
		<div className={styles.accountCard} key={account.sub}>
			<div className={styles.info}>
				<span>
					Provider:{' '}
					{`${account.provider.slice(0, 1).toUpperCase()}${account.provider.slice(1)}`}
				</span>
				<span>
					Address:{' '}
					<a
						href={`https://devnet.suivision.xyz/account/${account.userAddr}`}
						target="_blank"
					>{`${account.userAddr.slice(0, 6)}...${account.userAddr.slice(-4)}`}</a>
				</span>
				<span>User ID: {account.sub}</span>
			</div>
			<div
				className={styles.clearBtn}
				onClick={() => clearAccount(account.userAddr)}
			>
				Clear
			</div>
		</div>
	);
};

export default App;
