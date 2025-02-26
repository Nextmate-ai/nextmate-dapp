import React from 'react';

interface Story {
	id: string;
	title: string;
	content: string;
	price: number;
	description: string;
	backgroundImage: string[];
	isPaid: boolean;
}

interface StoryCardProps {
	story: Story;
	count: number;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, count }) => {
	return (
		<div className="rounded-lg bg-white p-4 shadow-md">
			<img
				src={story.backgroundImage[0]}
				alt={story.title}
				className="mb-4 h-48 w-full rounded-lg object-cover"
			/>
			<h3 className="mb-2 text-lg font-bold">{story.title}</h3>
			<p className="mb-2 text-sm text-gray-700">{story.description}</p>
			<p className="text-xs text-gray-500">Count: {count}</p>
		</div>
	);
};

export default StoryCard;
