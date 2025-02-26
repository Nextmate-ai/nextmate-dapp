import { AccountType } from './rainbowkit.type';

// types.ts
export type LoginType = 'wallet' | 'thirdParty' | 'email';

export interface UserInfo {
	id?: string;
	accountId: string;
	type: LoginType;
	wallet?: string;
	email?: string;
	googleId?: string;
	walletData?: AccountType;
	createdAt?: string;
	lastLogin?: string;
	invitationCode: string;
	inviterId?: string;
	inviterDisplay?: string;
	walletType?: string;
}
