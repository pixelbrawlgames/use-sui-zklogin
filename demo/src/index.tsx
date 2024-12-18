import { createRoot } from 'react-dom/client';
import { SuiClientProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from '@mysten/sui/client';

import App from './app';

import './global.css';

const queryClient = new QueryClient();
const networks = {
	devnet: { url: getFullnodeUrl('devnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
};

const root = createRoot(document.getElementById('app') as HTMLElement);
root.render(
	<QueryClientProvider client={queryClient}>
		<SuiClientProvider networks={networks} defaultNetwork="devnet">
			<App />
		</SuiClientProvider>
	</QueryClientProvider>
);
