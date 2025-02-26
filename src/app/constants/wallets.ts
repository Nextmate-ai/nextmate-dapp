export interface Wallet {
	name: string;
	type: string;
	logo: string;
}

export const WALLETS: Record<string, Wallet> = {
	OKX: { name: 'OKX Wallet', type: 'okx', logo: '/img/wallet/wallet-okx.png' },
	TRONLINK: {
		name: 'Tronlink',
		type: 'tronlink',
		logo: '/img/wallet/wallet-tronlink.png',
	},
};
