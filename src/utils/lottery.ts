// utils/lottery.ts
import { Equipment } from './equipment';

export interface LotteryItem {
	id: string;
	poolId: string;
	name: string;
	probability: number;
	type: 'decoration' | 'story';
	rewardId: string;
	star: number;
	equipment: Equipment | null;
}

export function getRandomReward(items: LotteryItem[]): LotteryItem | null {
	const totalProbability = items.reduce(
		(sum, item) => sum + item.probability,
		0,
	);
	const random = Math.random() * totalProbability;
	let cumulativeProbability = 0;

	for (const item of items) {
		cumulativeProbability += item.probability;
		if (random <= cumulativeProbability) {
			return item;
		}
	}

	return null;
}

export function performMultipleDraws(
	poolItems: LotteryItem[],
	numDraws: number,
	guaranteedStar: number,
): LotteryItem[] {
	const results: LotteryItem[] = [];
	let highStarDrawn = false;

	for (let i = 0; i < numDraws; i++) {
		const reward = getRandomReward(poolItems);
		if (reward && reward.star === guaranteedStar) {
			highStarDrawn = true;
		}
		if (reward) {
			results.push(reward);
		}
	}

	if (guaranteedStar && !highStarDrawn) {
		const highStarItems = poolItems.filter(
			item => item.star === guaranteedStar,
		);
		const highStarReward = getRandomReward(highStarItems);
		if (highStarReward) {
			results[Math.floor(Math.random() * results.length)] = highStarReward;
		}
	}

	return results;
}
