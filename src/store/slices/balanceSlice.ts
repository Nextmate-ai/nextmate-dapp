import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchBalance, updateBalance } from '@/lib/balanceApi';

interface BalanceState {
	diamond: number;
	gold: number;
	energy: number;
	usdt: number;
	status?: 'idle' | 'loading' | 'succeeded' | 'failed';
	error?: string | null;
}

const initialState: BalanceState = {
	diamond: 0,
	gold: 0,
	energy: 0,
	usdt: 0,
	status: 'idle',
	error: null,
};

export const balanceSlice = createSlice({
	name: 'balance',
	initialState,
	reducers: {
		setBalanceData(state, action: PayloadAction<BalanceState>) {
			state.diamond = action.payload.diamond;
			state.gold = action.payload.energy;
			state.energy = action.payload.gold;
			state.usdt = action.payload.usdt;
			localStorage.setItem('balance', JSON.stringify(action.payload));
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchBalance.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchBalance.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.diamond = action.payload.diamond;
				state.gold = action.payload.gold;
				state.energy = action.payload.energy;
				state.usdt = action.payload.usdt;
				state.error = null;
			})
			.addCase(fetchBalance.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})
			.addCase(updateBalance.pending, state => {
				state.status = 'loading';
			})
			.addCase(updateBalance.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.diamond = action.payload.diamond;
				state.gold = action.payload.gold;
				state.energy = action.payload.energy;
				state.usdt = action.payload.usdt;
				state.error = null;
			})
			.addCase(updateBalance.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});

export const { setBalanceData } = balanceSlice.actions;

export default balanceSlice.reducer;
