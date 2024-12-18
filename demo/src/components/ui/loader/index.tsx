import { FC, CSSProperties } from 'react';

import styles from './index.module.css';

interface P {
	loading?: boolean;
	style?: CSSProperties;
}
const Loader: FC<P> = ({ loading, style }) => {
	return loading ? (
		<div className={styles.loader} style={style}>
			<div className={styles.loaderRipple}>
				<div></div>
				<div></div>
			</div>
		</div>
	) : null;
};

export default Loader;
