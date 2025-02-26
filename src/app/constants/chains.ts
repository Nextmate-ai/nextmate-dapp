// Chain constants
import { base, moonbaseAlpha } from 'viem/chains';

export interface Chain {
	id: number;
	name: string;
	symbol: string;
	rpcUrls: string;
	decimals: number;
	hashPrefix: string;
}

export const CHAIN: Record<string, Chain> = {
	TRON: {
		id: 0x2b6653dc,
		name: 'Tron',
		symbol: 'TRX',
		rpcUrls: 'https://api.trongrid.io',
		decimals: 6,
		hashPrefix: 'https://tronscan.org/#/transaction/',
	},
	ETH: {
		id: 1,
		name: 'Ethereum',
		symbol: 'ETH',
		rpcUrls: 'https://cloudflare-eth.com',
		decimals: 18,
		hashPrefix: 'https://etherscan.io/tx/',
	},
	BASE: {
		id: base.id,
		name: base.name,
		symbol: base.nativeCurrency.symbol,
		rpcUrls: base.rpcUrls.default.http[0],
		decimals: base.nativeCurrency.decimals,
		hashPrefix: 'https://basescan.org/tx/',
	},
	MOONBASE: {
		id: moonbaseAlpha.id,
		name: moonbaseAlpha.name,
		symbol: moonbaseAlpha.nativeCurrency.symbol,
		rpcUrls: moonbaseAlpha.rpcUrls.default.http[0],
		decimals: moonbaseAlpha.nativeCurrency.decimals,
		hashPrefix: 'https://moonbase.moonscan.io/tx/',
	},
	SOLANA: {
		id: 0,
		name: 'Solana',
		symbol: 'SOL',
		rpcUrls:
			'https://solana-mainnet.g.alchemy.com/v2/o6LTWRp4VUu0JyX4UvF3phPZtIgvoylp',
		decimals: 9,
		hashPrefix: 'https://solscan.io/tx/',
	},
	SUI: {
		id: 101,
		name: 'Sui',
		symbol: 'SUI',
		rpcUrls: 'https://sui-rpc.publicnode.com',
		decimals: 9,
		hashPrefix: 'https://suivision.xyz/txblock/',
	},
};
