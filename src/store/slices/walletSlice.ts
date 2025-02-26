import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chain } from '@/app/constants/chains';

export interface WalletState {
	provider: any;
	address: string | null;
	chain: Chain | null;
	isConnected: boolean;
}

const initialState: WalletState = {
	provider: null,
	address: null,
	chain: null,
	isConnected: false,
};

const walletSlice = createSlice({
	name: 'wallet',
	initialState,
	reducers: {
		setProvider(state, action: PayloadAction<any>) {
			state.provider = action.payload;
		},
		setAddress(state, action: PayloadAction<string>) {
			state.address = action.payload;
		},
		setChain(state, action: PayloadAction<Chain>) {
			state.chain = action.payload;
			localStorage.setItem('chainInfo', JSON.stringify(action.payload));
		},
		setIsConnected(state, action: PayloadAction<boolean>) {
			state.isConnected = action.payload;
		},
		clearWallet(state) {
			state.address = null;
			state.chain = null;
			state.isConnected = false;
		},
	},
});

export const {
	setProvider,
	setAddress,
	setChain,
	setIsConnected,
	clearWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
