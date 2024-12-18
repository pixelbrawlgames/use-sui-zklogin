# use-sui-zklogin

React hook for seamless zkLogin integration on Sui. Simplifies authentication workflows by managing account retrieval, signature generation, and address resolution with zero-knowledge proofs.

## Table of Contents

1. [Installation](#install)
2. [Usage](#usage)
3. [Examples](#examples)

<a name="install"></a>

### Installation

```cmd
npm install use-sui-zklogin @mysten/sui jwt-decode
```

<a name="usage"></a>

### Usage

```Javascript
import {
	useZkLogin,
	beginZkLogin,
} from 'use-sui-zklogin';
import type { OpenIdProvider } from 'use-sui-zklogin';

const MyComponent = () => {
	const { isLoaded, address, accounts } = useZkLogin({
		urlZkProver: 'https://prover-dev.mystenlabs.com/v1',
		generateSalt: /* Your salt generator promise */,
	});

	const handleZkLogin = async (provider: OpenIdProvider) => {
		await beginZkLogin({
			suiClient: /* Your Sui Client */,
			provider,
			providersConfig:{
                google: {
                    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
                    clientId: 'CLIENT_ID',
                },
                // ...
            },
		});
	};

	return (
        <button onClick={() => handleZkLogin('google')}>
            Sign in with Google
        </button>
    );
};
```

#### Options

| Name    | Type     | Description | Default value | Possible value        |
| ------- | -------- | ----------- | ------------- | --------------------- |
| default | `string` | default     | 'default'     | 'default', 'default2' |
