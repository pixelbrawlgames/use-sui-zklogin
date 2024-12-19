import { FC, CSSProperties } from 'react';

import styles from './index.module.css';

interface P {
	style?: CSSProperties;
}
export const IconLink: FC<P> = ({ style }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={styles.icon}
			style={style}
		>
			<path d="M15 3h6v6"></path>
			<path d="M10 14 21 3"></path>
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
		</svg>
	);
};

export const IconTrash: FC<P> = ({ style }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={styles.icon}
			style={style}
		>
			<path d="M3 6h18"></path>
			<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
			<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
			<line x1="10" x2="10" y1="11" y2="17"></line>
			<line x1="14" x2="14" y1="11" y2="17"></line>
		</svg>
	);
};
