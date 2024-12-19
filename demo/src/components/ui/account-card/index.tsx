import { FC } from 'react';
import { clearAccount } from 'use-sui-zklogin';
import type { AccountData } from 'use-sui-zklogin';

import styles from './index.module.css';

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

export default AccountCard;
