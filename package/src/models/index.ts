import { JwtPayload } from 'jwt-decode';

export type OpenIdProvider =
	| 'google'
	| 'facebook'
	| 'twitch'
	| 'kakao'
	| 'apple'
	| 'slack'
	| 'microsoft';

export type OpenIdConfig = {
	authUrl: string;
	clientId: string;
	extraParams?: Record<string, string>; // Additional parameters to include in the URL
};

export type OpenIdAuthParams = {
	redirect_uri?: string;
	response_type?: string;
	scope?: string;
};

export type ProviderConfig = Partial<Record<OpenIdProvider, OpenIdConfig>>;

export type SetupData = {
	provider: OpenIdProvider;
	maxEpoch: number;
	randomness: string;
	ephemeralPrivateKey: string;
};

export type AccountData = {
	provider: OpenIdProvider;
	userAddr: string;
	zkProofs: any;
	ephemeralPrivateKey: string;
	userSalt: string;
	sub: string;
	aud: string;
	maxEpoch: number;
	email?: string;
	email_verified?: boolean;
};

export type TJwtPayload = JwtPayload & {
	email?: string;
	email_verified?: boolean;
};
