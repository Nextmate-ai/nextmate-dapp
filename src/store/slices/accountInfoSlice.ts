import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChainType } from '../../types/rainbowkit.type';
import { UserInfo } from '@/types/user.type';

interface AccountInfoState {
	account: UserInfo | null;
	chain: ChainType | null;
}

const initialState: AccountInfoState = {
	account: null,
	chain: null,
};

const accountInfoSlice = createSlice({
	name: 'accountInfo',
	initialState,
	reducers: {
		setAccount(state, action: PayloadAction<UserInfo>) {
			state.account = action.payload;
			localStorage.setItem('userInfo', JSON.stringify(action.payload));
		},
		setChain(state, action: PayloadAction<ChainType>) {
			state.chain = action.payload;
			localStorage.setItem('chainInfo', JSON.stringify(action.payload));
		},
		clearAccount(state) {
			state.account = null;
			state.chain = null;
			localStorage.removeItem('userInfo');
			localStorage.removeItem('chainInfo');
		},
	},
});

export const { setAccount, setChain, clearAccount } = accountInfoSlice.actions;

export default accountInfoSlice.reducer;
