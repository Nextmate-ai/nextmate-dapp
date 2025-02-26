import { ChatMessage } from '@/types/chat.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
	messages: ChatMessage[];
}

const initialState: ChatState = {
	messages: [],
};

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setChatHistory: (state, action: PayloadAction<ChatMessage[]>) => {
			state.messages = action.payload;
		},
		addMessage: (state, action: PayloadAction<ChatMessage>) => {
			state.messages.push(action.payload);
		},
	},
});

export const { setChatHistory, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
