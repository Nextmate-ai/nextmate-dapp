export interface AccountType {
	address: string;
	balanceDecimals?: number;
	balanceFormatted?: string;
	balanceSymbol?: string;
	displayBalance?: string;
	displayName: string;
	ensAvatar?: string;
	ensName?: string;
	hasPendingTransactions: boolean;
}

export interface ChainType {
	id: number;
	name: string;
	unsupported?: boolean;
	iconUrl?: string;
	iconBackground?: string;
	hasIcon?: boolean;
}
