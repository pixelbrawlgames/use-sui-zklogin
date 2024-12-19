import { FC } from 'react';
import { clearAccount } from 'use-sui-zklogin';
import type { AccountData } from 'use-sui-zklogin';
import { IconLink, IconTrash } from '../icons';

import styles from './index.module.css';

interface P {
	account: AccountData;
}
const AccountCard: FC<P> = ({ account }) => {
	return (
		<div className={styles.accountCard} key={account.sub}>
			<div className={styles.head}>
				<h3 className={styles.title}>Account Details</h3>
			</div>
			<div className={styles.content}>
				<div className={styles.row}>
					<span>{`${account.provider.slice(0, 1).toUpperCase()}${account.provider.slice(1)}`}</span>
				</div>
				<div className={styles.row}>
					<div className={styles.rowLabel}>Address</div>
					<a
						className={styles.rowValue}
						href={`https://devnet.suivision.xyz/account/${account.userAddr}`}
						target="_blank"
					>
						<span className={styles.address}>
							{`${account.userAddr.slice(0, 6)}...${account.userAddr.slice(-4)}`}
						</span>
						<IconLink style={{ marginLeft: '0.5rem', color: '#2563eb' }} />
					</a>
				</div>
				<div className={styles.row}>
					<div className={styles.rowLabel}>User ID</div>
					<div className={styles.id}>{account.sub}</div>
				</div>
				<div
					className={styles.btn}
					onClick={() => clearAccount(account.userAddr)}
				>
					<IconTrash style={{ marginRight: '0.5rem' }} />
					Clear Account
				</div>
			</div>
		</div>
	);
};

export default AccountCard;
