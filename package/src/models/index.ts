/**
 * @fileoverview Type definitions for OpenID authentication and JWT handling
 * @module common-types
 */

import { JwtPayload } from 'jwt-decode';

/**
 * Valid response types for OAuth 2.0 authorization requests
 */
export type ResponseType = 'code' | 'token' | 'id_token';

/**
 * Type for validating URLs
 * @pattern ^https?:\/\/.+
 */
export type ValidUrl = `https://${string}` | `http://${string}`;

/**
 * Type for blockchain addresses
 * @pattern ^0x[a-fA-F0-9]{64}$
 */
export type BlockchainAddress = `0x${string}`;

/**
 * Structure for Zero-Knowledge proofs
 */
export interface ZKProofs {
	/** The generated proof string */
	proof: string;
	/** Array of public inputs for verification */
	publicInputs: string[];
	/** Verification status of the proof */
	verified: boolean;
}

/**
 * Supported OpenID Connect providers for authentication.
 * Each string literal represents a supported OAuth 2.0 identity provider.
 */
export type OpenIdProvider =
	| 'google'
	| 'facebook'
	| 'twitch'
	| 'kakao'
	| 'apple'
	| 'slack'
	| 'microsoft';

/**
 * Configuration required for each OpenID provider.
 * Contains the essential OAuth 2.0 client configuration parameters.
 */
export interface OpenIdConfig {
	/** Authorization endpoint URL for the OAuth 2.0 provider */
	authUrl: ValidUrl;
	/** OAuth 2.0 client identifier issued by the provider */
	clientId: string;
	/** Optional additional parameters to include in the authorization URL */
	extraParams?: Record<string, string>;
}

/**
 * Optional parameters for the OAuth 2.0 authorization request.
 * These parameters customize the authentication flow.
 */
export interface OpenIdAuthParams {
	/** URI where the provider should redirect after authentication */
	redirect_uri?: ValidUrl;
	/** OAuth 2.0 response type */
	response_type?: ResponseType;
	/** Space-separated list of OAuth 2.0 scopes */
	scope?: string;
}

/**
 * Configuration mapping for all supported providers.
 */
export type ProviderConfig = Partial<Record<OpenIdProvider, OpenIdConfig>>;

/**
 * Data structure for the initial authentication setup.
 * Contains the necessary information for establishing a secure session.
 */
export interface SetupData {
	/** Selected OpenID provider for authentication */
	provider: OpenIdProvider;
	/** Maximum epoch number for time-based validation */
	maxEpoch: number;
	/** Random value used for cryptographic operations (32 bytes hex) */
	randomness: string;
	/** Temporary private key for the session (32 bytes hex) */
	ephemeralPrivateKey: string;
}

/**
 * Comprehensive account data including authentication and user information.
 * Stores both OAuth-related data and blockchain-specific information.
 */
export interface AccountData {
	/** OpenID provider used for authentication */
	provider: OpenIdProvider;
	/** User's blockchain address */
	userAddr: BlockchainAddress;
	/** Zero-knowledge proofs for authentication */
	zkProofs: ZKProofs;
	/** Temporary private key for the session (32 bytes hex) */
	ephemeralPrivateKey: string;
	/** Unique salt value for the user (32 bytes hex) */
	userSalt: string;
	/** OAuth 2.0 subject identifier */
	sub: string;
	/** OAuth 2.0 audience identifier */
	aud: string;
	/** Maximum epoch number for time-based validation */
	maxEpoch: number;
	/** Optional user email address */
	email?: string;
	/** Optional email verification status */
	email_verified?: boolean;
}

/**
 * Common OAuth 2.0 scope values
 */
export const OAUTH_SCOPES = {
	OPENID: 'openid',
	EMAIL: 'email',
	PROFILE: 'profile',
	PHONE: 'phone',
} as const;

/**
 * Extended JWT payload that includes optional email-related claims.
 * Inherits from the base JwtPayload type and adds email fields.
 */
export interface TJwtPayload extends JwtPayload {
	/** Optional user email address from the JWT */
	email?: string;
	/** Optional email verification status from the JWT */
	email_verified?: boolean;
}
