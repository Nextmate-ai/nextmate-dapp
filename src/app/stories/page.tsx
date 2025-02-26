'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
	CharacterStories,
	Story,
	useCharacterStories,
} from '@/hooks/useUserCharacter';
import { ChevronDownIcon } from 'lucide-react';
import SlideComponent from '../_components/SlideComponents/SlideCompnents';
import MainMenu from '../_components/MainMenu/MainMenu';
import { useRouter } from 'next/navigation';
import { GiftButton } from '../_components/GiftButton/GiftButton';

const UserCharacterStories: React.FC = () => {
	const { data: characterStories, error, isLoading } = useCharacterStories();

	if (isLoading) return <div className="py-4 text-center">Loading...</div>;
	if (
		error ||
		(!Array.isArray(characterStories) && 'error' in characterStories)
	)
		return (
			<div className="py-4 text-center text-red-500">
				Error: {error?.message || (characterStories as { error?: any })?.error}
			</div>
		);
	if (!characterStories || characterStories.length === 0)
		return <div className="py-4 text-center">No character stories found</div>;

	return (
		<div className="mx-auto flex h-full max-w-md flex-col overflow-hidden rounded-lg bg-white">
			<div className="flex-grow overflow-x-hidden overflow-y-scroll pb-24">
				<div className="pt-8 text-center text-sm font-extrabold">Stories</div>
				{characterStories?.map(character => (
					<CharacterStoriesSection key={character.id} character={character} />
				))}
			</div>
			<MainMenu />
			<GiftButton />
		</div>
	);
};

const CharacterStoriesSection: React.FC<{ character: CharacterStories }> = ({
	character,
}) => {
	const [isOpenMilestone, setIsOpenMilestone] = useState(true);
	const [isOpenLottery, setIsOpenLottery] = useState(false);
	console.log('character', character);

	const router = useRouter();

	const toggleOpenMilestone = () => setIsOpenMilestone(!isOpenMilestone);
	const toggleOpenLottery = () => setIsOpenLottery(!isOpenLottery);

	const renderStorySlide = (story: Story) => (
		<div
			className="rounded-lg bg-white p-4"
			onClick={() => router.push(`/story/${story.id}`)}
		>
			<h3 className="mb-2 text-lg font-semibold">{story.title}</h3>
			<p className="mb-2 text-sm text-gray-600">{story.description}</p>
			{/* <p className={`text-sm ${story.userStoryStatus ? "text-green-600" : "text-gray-500"}`}>
        {story.userStoryStatus ? "Active" : "Non-active"}
      </p> */}
			{story.backgroundImage && story.backgroundImage.length > 0 && (
				<div className="relative">
					<img
						src={`/img/${story.backgroundImage[0]}.png`}
						alt={story.title}
						width={300}
						height={200}
						className="mt-2 h-32 w-full rounded object-cover"
					/>
					<div className="absolute bottom-2 left-2 rounded-full bg-black bg-opacity-50 px-2 py-1 text-yellow-400">
						{[...Array(3)].map((_, i) => (
							<span
								key={i}
								className={i < story.star ? 'text-yellow-400' : 'text-gray-400'}
							>
								★
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);

	return (
		<div className="flex flex-col gap-4 pt-8">
			<div className="flex items-center border-b p-4">
				<Image
					src={character.avatar}
					alt={character.name}
					width={40}
					height={40}
					className="mr-3 rounded-full"
				/>
				<h2 className="text-xl font-semibold">{character.name}</h2>
			</div>

			<div className="px-4">
				<button
					onClick={toggleOpenMilestone}
					className="flex w-full items-center justify-between py-3 text-left"
				>
					<span>Milestone Stories</span>
					<ChevronDownIcon
						className={`h-5 w-5 transition-transform ${
							isOpenMilestone ? 'rotate-180 transform' : ''
						}`}
					/>
				</button>
				{isOpenMilestone && (
					<SlideComponent
						items={character.milestoneStories}
						renderItem={renderStorySlide}
					/>
				)}

				<button
					onClick={toggleOpenLottery}
					className="flex w-full items-center justify-between py-3 text-left"
				>
					<span>Lottery Stories</span>
					<ChevronDownIcon
						className={`h-5 w-5 transition-transform ${
							isOpenLottery ? 'rotate-180 transform' : ''
						}`}
					/>
				</button>
				{isOpenLottery && (
					<SlideComponent
						items={character.lotteryStories}
						renderItem={renderStorySlide}
					/>
				)}
			</div>
		</div>
	);
};

export default UserCharacterStories;
