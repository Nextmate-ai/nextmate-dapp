export interface Story {
	id: string;
	title: string;
	content: string;
	price: number;
	description: string;
	backgroundImage: string[];
	isPaid: boolean;
}

export interface StoryCount {
	story: Story;
	count: number;
}

export interface StoryDetail {
	id: string;
	title: string;
	content: string;
	linkAvatarID: number;
	isOwned: boolean;
	description: string;
	backgroundImage: string[];
	type: 'MILESTONE' | 'LOTTERY'; // Assuming these are the only possible values
	gem: number;
	diamond: number;
	start: number;
	option: string[];
	trigger: number;
	answerMe: string[];
	answer: string[];
	result: string[];
	startImage: string[];
	isNextStory: boolean;
	condition: any; // Adjust type based on actual structure if known
	benefits: {
		Intimacy: {
			min: number;
			max: number;
		};
	};
	produceNum: number | null;
}
