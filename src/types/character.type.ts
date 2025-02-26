export interface CharacterRoleType {
	leisure: number;
	factor: any;
	intimacy: number;
	isNeedLevelBreak: any;
	id: string;
	name: string;
	avatar: string;
	isNew: boolean;
	isHot: boolean;
	level: number;
	equipmentName: string;
	experience: number;
	experienceToNextLevel: number;
	backgroundImage: string;
	fatigueValue: number;
	backgroundStory: string;
	character: {
		avatar: string;
		intimacy: number;
		leisure: number;
		ability: number;
		background: string;
		backgroundImages: string[];
		backgroundStory: string;
		personalityTags: string[];
		specialAbilities: string[];
		fatigueValue: number;
		attributes: {
			[key: string]: number;
		};
		backgroundImage: string;
		introduction: string;
	};
	characters: {
		ability: number;
		avatar: string;
		backgroundImage: string;
		characterId: string;
		currentMilestone: number;
		customBackgroundStory: string;
		customOpeningStatement: string;
		customSettings: any | null;
		equipmentName: string;
		experience: number;
		experienceToNextLevel: number;
		factor: {
			minLevel: number;
			maxLevel: number;
			base: number;
			offset: number;
			breakRequired: {
				score: number;
				diamond: number;
				gold: number;
			};
		};
		fatigueValue: number;
		favoriteTopics: string[];
		id: string;
		intimacy: number;
		isNeedLevelBreak: boolean;
		lastInteractionDate: { $date: { $numberLong: string } };
		lastLeaveDate: { $date: { $numberLong: string } };
		lastLevelUpTime: { $date: { $numberLong: string } };
		lastStudyTime: { $date: { $numberLong: string } };
		leisure: number;
		level: number;
		name: string;
		userId: string;
	};
	// equipments
}

export interface CharacterEndPoint {
	id: { $oid: string };
	name: string;
	avatar: string;
	backgroundImage: string;
	openingStatement: string;
	backgroundStory: string;
	level: { $numberLong: string };
	experience: { $numberLong: string };
	nextLevelRequired: { $numberLong: string };
	settings: {
		personality: string;
		likes: string[];
		dislikes: string[];
		goals: string;
		quirks: string[];
		background: string;
	};
	isPaid: boolean;
	personalityTags: string[];
	specialAbilities: string[];
	attributes: {
		strength: { $numberInt: string };
		intelligence: { $numberInt: string };
		charisma: { $numberInt: string };
	};
	intimacy: { $numberLong: string };
	ability: { $numberLong: string };
	fatigueValue: { $numberLong: string };
	leisure: { $numberLong: string };
	templateId: { $oid: string };
	milestoneStoryIds: { $oid: string }[];
	lotteryStoryIds: { $oid: string }[];
}

export interface UserCharacterEndPoint {
	id: { $oid: string };
	userId: { $oid: string };
	characterId: { $oid: string };
	level: { $numberLong: string };
	experience: { $numberLong: string };
	intimacy: { $numberLong: string };
	ability: { $numberLong: string };
	fatigueValue: { $numberLong: string };
	leisure: { $numberLong: string };
	lastLevelUpTime: { $date: { $numberLong: string } };
	backgroundImage: string | null;
	experienceToNextLevel: { $numberLong: string };
	skills: string[];
	achievements: string[];
	lastInteractionDate: { $date: { $numberLong: string } };
	favoriteTopics: string[];
	currentMilestone: { $numberLong: string };
	customOpeningStatement: string | null;
	customBackgroundStory: string | null;
	customSettings: any | null;
	lastLeaveDate: { $date: { $numberLong: string } };
}

export interface UserCharacterWithDetailsEndPoint
	extends UserCharacterEndPoint {
	character: CharacterEndPoint;
}
