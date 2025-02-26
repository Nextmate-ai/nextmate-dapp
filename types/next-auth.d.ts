import NextAuth from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			id?: string;
			type: LoginType;
			email?: string;
			wallet?: string;
			googleId?: string;
			walletData?: AccountType;
			createdAt?: string;
			lastLogin?: string;
			invitationCode: string;
			inviterId?: string;
			inviterDisplay?: string;
		};
		Authorization: string;
	}
}

declare module 'next-auth/client' {
	export function signIn(
		provider?: string,
		options?: { callbackUrl?: string; [key: string]: any },
	): Promise<any>;
}
