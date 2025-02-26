import { configureStore } from '@reduxjs/toolkit';
import accountInfoReducer from './slices/accountInfoSlice';
import characterReducer from './slices/characterSlice';
import balanceReducer from './slices/balanceSlice';
import chatSliceReducer from './slices/chatSlice';
import walletReducer from './slices/walletSlice';
const store = configureStore({
	reducer: {
		accountInfo: accountInfoReducer,
		character: characterReducer,
		balance: balanceReducer,
		chatHistory: chatSliceReducer,
		wallet: walletReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore these action types
				ignoredActions: ['wallet/setProvider'],
				// Ignore these field paths in all actions
				ignoredActionPaths: ['meta.arg', 'payload.provider'],
				// Ignore these paths in the state
				ignoredPaths: ['wallet.provider'],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
