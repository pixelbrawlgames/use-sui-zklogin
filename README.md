# use-sui-zklogin

React hook for seamless zkLogin integration on Sui. Simplifies authentication workflows by managing account retrieval, signature generation, and address resolution with zero-knowledge (zk) proofs.

You can explore the live demo [here](https://pixelbrawlgames.github.io/use-sui-zklogin).

This project is based on the following demos: ([Demo A](https://github.com/juzybits/polymedia-zklogin-demo), [Demo B](https://github.com/jovicheng/sui-zklogin-demo)), and the official [documentation](https://docs.sui.io/concepts/cryptography/zklogin).

### Table of Contents

1. [Installation](#install)
2. [Usage](#usage)
3. [Documentation](#documentation)
   - [Functions](#functions)
   - [Error handling](#errors)
   - [Types](#types)
4. [Resources](#resources)

<a name="install"></a>

## Installation

```cmd
npm install use-sui-zklogin
```
```cmd
yarn add use-sui-zklogin
```

<a name="usage"></a>

## Usage

```Javascript
import { useZkLogin, beginZkLogin } from 'use-sui-zklogin';
import type { OpenIdProvider, ProviderConfig } from 'use-sui-zklogin';

// Centralize provider configuration
const providersConfig:ProviderConfig = {
	google: {
		authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
		clientId: 'CLIENT_ID',
	},
	// Add more providers here if needed
};

const MyComponent = () => {
	const { isLoaded, address, accounts } = useZkLogin({
		urlZkProver: 'https://prover-dev.mystenlabs.com/v1',
		generateSalt: async () => {
			// Replace with your salt generation logic
			return { salt: Date.now() };
		},
	});

	// Handle ZK login with the selected provider
	const handleZkLogin = async (provider: OpenIdProvider) => {
		await beginZkLogin({
			suiClient: /* Your Sui Client */,
			provider,
			providersConfig,
		});
	};

	return (
		<button onClick={() => handleZkLogin('google')} disabled={!isLoaded}>
			{isLoaded ? 'Sign in with Google' : 'Loading...'}
		</button>
	);
};
```
<a name="documentation"></a>

## Documentation

This documentation describes the types and functions available for implementing Zero-Knowledge (ZK) Login functionality for Sui blockchain authentication.

<a name="functions"></a>

### Functions

#### beginZkLogin

```typescript
beginZkLogin({ suiClient, provider, providersConfig, authParams, maxEpoch }: BeginZkLoginParams): Promise<void>
```

Initiates the Zero-Knowledge Login flow.

**Parameters:**

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| suiClient | `SuiClient` | Sui blockchain client for system state queries |
| provider | `OpenIdProvider` | Selected OpenID identity provider |
| providersConfig | `ProviderConfig` | Configuration map for OpenID providers |
| authParams | `OpenIdAuthParams` | Additional OAuth parameters (optional) |
| maxEpoch | `number` | Maximum epoch number for time-based validation (optional) |

**Process:**

1. Generates an ephemeral keypair
2. Creates a nonce for OAuth authentication
3. Saves setup data
4. Redirects to the selected OpenID provider

**Throws:**

- Error if the login initiation process fails

#### useZkLogin

```typescript
useZkLogin({urlZkProver, generateSalt}: CompleteZkLoginParams): UseZkLoginReturn
```

A custom React hook for completing the Zero-Knowledge Login process and managing ZK login state.

**Parameters:**

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| urlZkProver | `string` | URL of the Zero-Knowledge proof generation service |
| generateSalt | () => Promise<{salt:number}> | Function to generate a unique user salt |

**Returns:**

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| isLoaded | `boolean` | Boolean indicating if login state is loaded |
| address | `string` | User's Sui address |
| accounts | `AccountData` | Array of user account data |

#### completeZkLogin

```typescript
completeZkLogin({urlZkProver, generateSalt}: CompleteZkLoginParams): Promise<CompleteZkLoginReturn>
```

Completes the Zero-Knowledge Login process. (Not needed if using useZkLogin hook)

**Parameters:**

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| urlZkProver | `string` | URL of the Zero-Knowledge proof generation service |
| generateSalt | () => Promise<{salt:number}> | Function to generate a unique user salt |

**Returns:**

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| accounts | `AccountData[]` | Array of saved user accounts |
| address | `string` | User's Sui address |

**Process:**

1. Decodes the JWT token from OAuth provider
2. Generates a unique user salt
3. Derives the user's Sui address
4. Generates Zero-Knowledge proofs
5. Saves user account information

**Throws:**

- Error if the login completion process fails

#### signOut

```typescript
signOut(): void
```

Signs out the current user from the ZK login session.

- Clears all account data
- Resets login state

#### clearAccount

```typescript
clearAccount(accountAddr: string): void
```

Clears a specific account from the stored accounts.

**Parameters:**

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| accountAddr | `string` | Sui address of the account to clear |

<a name="errors"></a>

### Error Handling

All asynchronous functions in this library may throw errors that should be handled appropriately in your application. Common error scenarios include:

- Network connectivity issues
- Invalid OAuth provider responses
- Failed proof generation
- Invalid parameters

<a name="types"></a>

### Types

#### ProviderConfig

Map of provider configurations:

```typescript
ProviderConfig = Partial<Record<OpenIdProvider, OpenIdConfig>>;
```

#### OpenIdProvider

Supported OAuth identity providers:

```typescript
OpenIdProvider =
	| 'google'
	| 'facebook'
	| 'twitch'
	| 'kakao'
	| 'apple'
	| 'slack'
	| 'microsoft';
```

#### OpenIdConfig

Configuration for OAuth provider settings:

```typescript
OpenIdConfig = {
	authUrl: string; // OAuth authorization URL
	clientId: string; // OAuth client ID
	extraParams?: Record<string, string>; // Additional URL parameters
};
```

#### OpenIdAuthParams

Optional OAuth authentication parameters:

```typescript
OpenIdAuthParams = {
	redirect_uri?: string; // OAuth redirect URI
	response_type?: string; // OAuth response type
	scope?: string; // OAuth scope permissions
};
```

#### AccountData

User account information:

```typescript
AccountData = {
	provider: OpenIdProvider; // OAuth provider used
	userAddr: string; // User's Sui address
	zkProofs: any; // Zero-knowledge proofs
	ephemeralPrivateKey: string; // Temporary private key
	userSalt: string; // Unique user salt
	sub: string; // Subject identifier
	aud: string; // Audience identifier
	maxEpoch: number; // Maximum epoch number
	email?: string; // Optional email
	email_verified?: boolean; // Email verification status
};
```

#### UseZkLoginReturn

Return type for the useZkLogin hook:

```typescript
UseZkLoginReturn = {
	isLoaded: boolean; // Loading state
	address: string; // User's Sui address
	accounts: AccountData[]; // List of user accounts
};
```

#### CompleteZkLoginReturn

Return type for the completeZkLogin function:

```typescript
CompleteZkLoginReturn = {
	address: string; // User's Sui address
	accounts: AccountData[]; // List of user accounts
} | undefined;
```
<a name="resources"></a>

## Resources

### Docs

Official documentation: https://docs.sui.io/concepts/cryptography/zklogin

### Examples

https://github.com/juzybits/polymedia-zklogin-demo

https://github.com/jovicheng/sui-zklogin-demo


