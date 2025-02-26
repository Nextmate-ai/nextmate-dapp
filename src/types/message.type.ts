export interface ChatMessageType {
	content: string;
	time: string;
	action: string;
	type: 'received' | 'sent';
	product?: boolean;
}
