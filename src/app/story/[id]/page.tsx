'use client';

import { useAddStory } from '@/hooks/useCreateStory';
import { useRoleList } from '@/hooks/useRoleList';
import { useStory } from '@/hooks/useStoryDetail';
import { ChevronLeft, CornerUpRight, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const Story: React.FC = () => {
	const { id: storyId } = useParams();
	const { story, hasStory, characterId, isLoading, isError, unlockable } =
		useStory(storyId as string);
	const { addStory, isLoading: addStoryLoading, error } = useAddStory();
	const [condition, setCondition] = useState<boolean>(true);
	const { characters, getCharacter } = useRoleList();
	const [showPopup, setShowPopup] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (story) {
			console.log(story, 'story');
			const character = getCharacter(characterId as string);
			if (story.condition) {
				// TODO: 判断亲密度等数值
			}
		}
	}, [story]);

	const handleAddStory = async () => {
		if (!storyId) {
			alert('Please enter a story ID');
			return;
		}
		if (!unlockable) {
			setShowPopup(true);
		} else {
			try {
				const paramsId = storyId as string;
				// 后端会做验证，gem, gold, condition
				const result = await addStory({
					storyId: paramsId,
				});
				console.log('Story added successfully:', result);
				// todo 验证是否可行，因为现在下一个里程也是解锁失败
				if (result) {
					router.push(`/sc/${paramsId}`);
				}
				// alert(`Story added: ${result.message}`);
			} catch (err) {
				toast.error(err.message);
				console.error('Failed to add story:', err);
				// Error is already handled by the hook and stored in the error state
			}
		}
	};

	const handleClosePopup = () => {
		setShowPopup(false);
	};

	return (
		<>
			{story && (
				<div
					className="relative h-full w-full bg-cover"
					style={{
						backgroundImage: `url(/img/${story.backgroundImage[0]}.png)`,
					}}
				>
					<div className="absolute flex w-full justify-between px-4 pt-4">
						<ChevronLeft
							size={32}
							color="white"
							onClick={() => {
								router.push('/stories');
							}}
						/>
						{/* story.condition && <CornerUpRight size={32} color='white' /> */}
					</div>
					<>
						<div className="h-full w-full bg-black/60">
							<div className="pt-12 text-center text-xl font-bold text-white">
								{story.linkAvatarID == 1 ? `Lucy's story` : `David's story`}
							</div>
							<div className="px-8 pt-12 text-left text-lg font-medium text-white">
								Summary
							</div>
							<div className="px-8 pt-2 text-left text-base text-white">
								{story.description}
							</div>
						</div>
						<div className="absolute bottom-10 w-full">
							<div
								className={`mx-4 flex h-16 items-center justify-center rounded-full text-lg text-white ${unlockable ? 'bg-custom-purple-005' : 'bg-custom-gray-003'}`}
							>
								{hasStory && (
									<div
										className=""
										onClick={() => router.push(`/sc/${storyId}`)}
									>
										Enter Story
									</div>
								)}
								{!hasStory &&
									condition &&
									story.gem == 0 &&
									story.diamond == 0 && (
										<div className="" onClick={handleAddStory}>
											Create Story
										</div>
									)}
								{!hasStory &&
									condition &&
									story.gem != 0 &&
									story.diamond == 0 &&
									(!unlockable && !story?.isNextStory ? (
										<span>Please unlock the previous story</span>
									) : (
										<div
											className="flex w-48 justify-between"
											onClick={handleAddStory}
										>
											<span>Unlock Story</span>
											<span className="flex">
												<img
													src={'/img/icon/coin.png'}
													className="mr-[6px] h-5 w-5 self-center"
												/>
												<span className="self-center">{story.gem}</span>
											</span>
										</div>
									))}
								{!hasStory &&
									condition &&
									story.gem == 0 &&
									story.diamond != 0 &&
									(!unlockable && !story.isNextStory ? (
										<span>Please unlock the previous story</span>
									) : (
										<div
											className="flex w-48 justify-between"
											onClick={handleAddStory}
										>
											<span>Unlock Story</span>
											<span className="flex">
												<img
													src={'/img/icon/diamond.png'}
													className="mr-[6px] h-5 w-5 self-center"
												/>
												<span className="self-center">{story.diamond}</span>
											</span>
										</div>
									))}
								{!condition && (
									<div onClick={() => router.push(`/stories`)} className="">
										You have&#39;t Reach the condition{' '}
									</div>
								)}
							</div>
						</div>
					</>

					{showPopup && (
						<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
							<div className="w-[83%] max-w-sm rounded-lg bg-white p-6">
								<div className="mb-4 flex items-center justify-between">
									<h2 className="text-xl font-bold">
										How to Unlock This Story
									</h2>
									<button onClick={handleClosePopup}>
										<X size={24} />
									</button>
								</div>
								<h1>Requirements</h1>
								{story.condition && typeof story.condition === 'object' ? (
									<ul className="list-disc pl-5">
										{Object.entries(story.condition).map(([key, value]) => (
											<li key={key}>{`${key}: ${value}`}</li>
										))}
									</ul>
								) : (
									<p>No unlock rules</p>
								)}
								{/* <h1>Cost</h1>
								{story.gem ? (
									<ul className="list-disc pl-5">
										<li>{`Gem:${story.gem}`}</li>
									</ul>
								) : (
									<p>No unlock rules</p>
								)} */}
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default Story;
