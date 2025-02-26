export enum ChatStatus {
	NORMAL = 0,
	NO_ENERGY = 1,
	HUNGRY = 2,
}

export interface ChatMessage {
	role: 'user' | 'assistant' | string;
	content: string;
	time?: string;
}

export interface ChatResponse {
	messages: ChatMessage[];
	status: ChatStatus;
}
