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

# ZK Login Documentation

This documentation describes the types and functions available for implementing Zero-Knowledge (ZK) Login functionality for Sui blockchain authentication.

## Functions

### useZkLogin

```typescript
useZkLogin(params: CompleteZkLoginParams): UseZkLoginReturn
```

A custom React hook for managing ZK login state.

**Parameters:**

- `urlZkProver`: URL of the Zero-Knowledge proof generation service
- `generateSalt`: Function to generate a unique user salt
  - Accepts an optional parameter
  - Returns a Promise resolving to `{ salt: number }`

**Returns:**

- Object containing:
  - `isLoaded`: Boolean indicating if login state is loaded
  - `address`: User's Sui address
  - `accounts`: Array of user account data

### signOut

```typescript
signOut(): void
```

Signs out the current user from the ZK login session.

- Clears all account data
- Resets login state
- Notifies subscribers of the change

### clearAccount

```typescript
clearAccount(accountAddr: string): void
```

Removes a specific account from the stored accounts.

**Parameters:**

- `accountAddr`: Sui address of the account to remove

### beginZkLogin

```typescript
beginZkLogin(params: BeginZkLoginParams): Promise<void>
```

Initiates the Zero-Knowledge Login flow.

**Parameters:**

- `suiClient`: Sui blockchain client for system state queries
- `provider`: Selected OpenID identity provider
- `providersConfig`: Configuration map for OpenID providers
- `authParams`: Additional OAuth parameters (optional)

**Process:**

1. Generates an ephemeral keypair
2. Creates a nonce for OAuth authentication
3. Saves setup data
4. Redirects to the selected OpenID provider

**Throws:**

- Error if the login initiation process fails

### completeZkLogin

```typescript
completeZkLogin(params: CompleteZkLoginParams): Promise<CompleteZkLoginReturn>
```

Completes the Zero-Knowledge Login process.

**Parameters:**

- Configuration and salt generation parameters

**Returns:**

- Object containing:
  - `accounts`: Array of saved user accounts
  - `address`: User's Sui address

**Process:**

1. Decodes the JWT token from OAuth provider
2. Generates a unique user salt
3. Derives the user's Sui address
4. Generates Zero-Knowledge proofs
5. Saves user account information

**Throws:**

- Error if the login completion process fails

## Types

### OpenIdProvider

Supported OAuth identity providers:

```typescript
type OpenIdProvider =
	| 'google'
	| 'facebook'
	| 'twitch'
	| 'kakao'
	| 'apple'
	| 'slack'
	| 'microsoft';
```

### OpenIdConfig

Configuration for OAuth provider settings:

```typescript
type OpenIdConfig = {
	authUrl: string; // OAuth authorization URL
	clientId: string; // OAuth client ID
	extraParams?: Record; // Additional URL parameters
};
```

### OpenIdAuthParams

Optional OAuth authentication parameters:

```typescript
type OpenIdAuthParams = {
	redirect_uri?: string; // OAuth redirect URI
	response_type?: string; // OAuth response type
	scope?: string; // OAuth scope permissions
};
```

### ProviderConfig

Map of provider configurations:

```typescript
type ProviderConfig = Partial<Record<OpenIdProvider, OpenIdConfig>>;
```

### SetupData

Data required for ZK login setup:

```typescript
type SetupData = {
	provider: OpenIdProvider; // Selected OAuth provider
	maxEpoch: number; // Maximum epoch number
	randomness: string; // Random value for proof generation
	ephemeralPrivateKey: string; // Temporary private key
};
```

### AccountData

User account information:

```typescript
type AccountData = {
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

### UseZkLoginReturn

Return type for the useZkLogin hook:

```typescript
type UseZkLoginReturn = {
	isLoaded: boolean; // Loading state
	address: string; // User's Sui address
	accounts: AccountData[]; // List of user accounts
};
```

## Error Handling

All asynchronous functions in this library may throw errors that should be handled appropriately in your application. Common error scenarios include:

- Network connectivity issues
- Invalid OAuth provider responses
- Failed proof generation
- Invalid parameters

## Usage Example

```typescript
// Initialize the ZK login hook
const { isLoaded, address, accounts } = useZkLogin({
	urlZkProver: 'https://prover-url.example',
	generateSalt: async () => ({ salt: Math.random() }),
});

// Begin login process
await beginZkLogin({
	suiClient,
	provider: 'google',
	providersConfig: {
		google: {
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			clientId: 'your-client-id',
		},
	},
});

// Complete login after OAuth redirect
const result = await completeZkLogin({
	// ... completion parameters
});

// Sign out
signOut();
```
