import { FC } from 'react';

import styles from './index.module.css';

interface P {
	onClick: () => void;
}
const FacebookButton: FC<P> = ({ onClick }) => {
	return (
		<button className={styles.fbBtn} onClick={onClick}>
			<span className={styles.gsiMaterialButtonContents}>
				Sign in with Facebook
			</span>
		</button>
	);
};

export default FacebookButton;
