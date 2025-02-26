'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { useRouter } from 'next/navigation';
import fetchAPI from '@/lib/api';
import MainMenu from '../_components/MainMenu/MainMenu';
import { useFetchTokenList } from '@/hooks/useFetchTokenList';
import PreloadImages from '../_components/PreloadImages/PreloadImags';
import useFetchVoteRecord from '@/hooks/useFetchVoteRecord';
import { usePreloadImage } from '@/hooks/usePreloadImage';
import Link from 'next/link';
import { useToastContext } from '../_components/ToastModal/ToastContext';
import MessageBox from '../_components/MessageBox/MessageBox';

const fetcher = (url: string) => fetchAPI(url);

const dateFormat = 'MMM DD, YYYY HH:mm';

const VoteCardSkeleton = () => {
	return (
		<div className="flex w-full animate-pulse flex-col gap-4 p-4">
			<div className="mx-auto w-full max-w-md rounded-lg bg-white px-4 py-2">
				<div className="mb-2 flex items-center justify-between">
					<div className="flex items-end">
						<div className="h-[70px] w-[70px] rounded-full bg-gray-300"></div>
						<div className="ml-[-5px] flex h-[70px] flex-col justify-end gap-2 pb-1">
							<div className="ml-4 h-6 w-56 rounded bg-gray-300"></div>
							<div className="ml-4 h-6 w-56 rounded bg-gray-300"></div>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto w-full max-w-md rounded-lg bg-white px-4 py-2">
				<div className="mb-2 flex items-center justify-between">
					<div className="flex items-end">
						<div className="h-[70px] w-[70px] rounded-full bg-gray-300"></div>
						<div className="ml-[-5px] flex h-[70px] flex-col justify-end gap-2 pb-1">
							<div className="ml-4 h-6 w-56 rounded bg-gray-300"></div>
							<div className="ml-4 h-6 w-56 rounded bg-gray-300"></div>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto w-full max-w-md rounded-lg bg-white px-4 py-2">
				<div className="mb-2 flex items-center justify-between">
					<div className="flex items-end">
						<div className="h-[70px] w-[70px] rounded-full bg-gray-300"></div>
						<div className="ml-[-5px] flex h-[70px] flex-col justify-end gap-2 pb-1">
							<div className="ml-4 h-6 w-56 rounded bg-gray-300"></div>
							<div className="ml-4 h-6 w-56 rounded bg-gray-300"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const VotePage = () => {
	const router = useRouter();
	const { showToast } = useToastContext();

	const [searchValue, setSearchValue] = useState('');
	const [images, setImages] = useState([
		'/img/bg-spin.png',
		'/img/prediction-upimg.png',
		'/img/prediction-downimg.png',
		'/img/prediction-downimg.png',
		'/img/prediction-downimg.png',
		'/img/prediction-upicon.png',
		'/img/prediction-timer.png',
		'/img/history-border.png',
		'/img/vote-rules.png',
		'/img/bg-amount.png',
		'/img/bg-popup.png',
		'/img/bg-record-border.png',
	]);
	const [filteredTokenList, setFilteredTokenList] = useState([]);
	const { tokenList, isLoading, reload } = useFetchTokenList();
	const { voteRecord } = useFetchVoteRecord('');
	const { preloadImages, isLoadingImage, preloadImagesFunc } =
		usePreloadImage(images);

	const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchValue(value);

		// 模糊搜索
		const filtered = tokenList.filter(token =>
			token.name.toLowerCase().includes(value.toLowerCase()),
		);
		setFilteredTokenList(filtered);
	};

	useEffect(() => {
		if (tokenList.length === 0) return;

		setFilteredTokenList(tokenList);

		const newImages = tokenList.reduce((acc, item) => {
			const imagePath = `/img/${item.symbol.toLowerCase()}-pure.png`;
			if (!preloadImages.includes(imagePath)) {
				acc.push(imagePath);
			}
			return acc;
		}, [] as string[]);

		if (newImages.length > 0) {
			console.log('newImages...', newImages);
			setImages(prevImages => [...prevImages, ...newImages]);
		}
	}, [tokenList, preloadImages]);

	// 轮询函数
	useEffect(() => {
		const intervalId = setInterval(() => {
			reload();
		}, 60 * 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [reload]);

	return (
		<div className="h-screen w-full bg-bg-purple bg-cover text-white">
			<div className="flex w-full items-center justify-between px-4 pb-3 pt-4">
				<div className="relative w-[70vw]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-full"
						viewBox="0 0 334 40"
						fill="none"
					>
						<path
							d="M0.5 20.1757L16.2818 0.5H41.75H83.5H167H250.5H333.5V16.6667V39.5H313.125H292.25H250.5H167H0.5V20.1757Z"
							stroke="url(#paint0_linear_1900_12123)"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_1900_12123"
								x1="167"
								y1="0"
								x2="167"
								y2="40"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#6E67F6" />
								<stop offset="1" stopColor="white" stopOpacity="0.5" />
							</linearGradient>
						</defs>
					</svg>
					<img
						src="/img/icon/search.svg"
						alt="search"
						className="absolute left-6 top-1/2 w-6 -translate-y-1/2"
					/>
					<input
						type="text"
						value={searchValue}
						onChange={handleInputChange}
						placeholder="Search for more memes"
						className="absolute left-14 top-1/2 h-full w-[50vw] -translate-y-1/2 border-transparent bg-transparent font-jamjuree text-base font-normal text-white placeholder:text-white/60 focus:border-transparent focus:outline-none"
					/>
				</div>
				<Link className="relative" href={'/vote/records'}>
					<div className="text-center font-jamjuree text-base font-medium text-white underline">
						Records
					</div>
				</Link>
			</div>

			<div className="h-[calc(100vh-140px)] w-full overflow-y-auto">
				<div className="relative mx-auto my-3 h-32 w-80">
					<img
						src="/img/vote-to-earn.png"
						alt="vote-to-earn"
						className="w-full"
					/>
				</div>

				<div className="w-full px-4 font-jamjuree text-base font-bold tracking-widest text-white">
					TOKEN PRICE VARIATION
				</div>
				<div className="mb-4 w-full px-4 font-jamjuree text-xs font-normal text-white/60">
					Token price variation in last 5 minutes.
				</div>

				{isLoading && <VoteCardSkeleton />}
				{!isLoading &&
					filteredTokenList.map(meme => (
						<div
							className={`${meme.id > 5 ? 'bg-bg-vote-meme-full' : 'bg-bg-vote-meme'} relative -mt-4 h-[96px] w-full bg-[length:100%_100%] bg-no-repeat`}
							key={meme.id}
						>
							{/* Meme number */}
							{meme.id < 6 && (
								<div className="absolute left-5 top-4 font-jamjuree text-base font-bold italic text-white">
									{meme.id}
								</div>
							)}
							<div className="absolute inset-0 flex items-center justify-center py-4 pl-10 pr-8">
								<div className="flex h-12 w-full items-center justify-between">
									<div className="flex items-start justify-start gap-3">
										{/* Meme image */}
										<img
											className="h-12 w-12 rounded-3xl"
											src={`/img/vote/${meme.symbol}.png`}
											alt={meme.name}
										/>
										<div className="flex flex-col items-start justify-start gap-1">
											{/* Meme name */}
											<div className="inline-flex items-start justify-start gap-1">
												<div className="font-jamjuree text-lg font-medium text-white">
													{meme.name === 'Dragon' ? 'DGTRON' : meme.name}
												</div>
											</div>
											{/* Network */}
											<div className="font-jamjuree text-xs font-normal text-[#aca8ff]">
												{meme.network}
											</div>
										</div>
									</div>
									<div className="flex items-center justify-end gap-3">
										{/* Price change */}
										<div
											className={`text-right font-jamjuree text-base font-medium ${
												meme.rise ? 'text-[#8FF37F]' : 'text-[#FF3B30]'
											}`}
										>
											{meme.ratio}‰
										</div>
										{/* Vote button */}
										<Link
											href={`/prediction/v1?data=${JSON.stringify(meme)}`}
											className="relative h-8 w-16"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-full"
												viewBox="0 0 73 32"
												fill="none"
											>
												<path
													d="M0.5 1.95745L5.09575 0H12.7553H64.4575H68.6702H72.5V2.80851V28.3404V30.1702L68.6702 32H61.0106H12.3723H4.52128H0.5V28.2553V4.08511V1.95745Z"
													fill="#6E67F6"
												/>
											</svg>
											<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-chakra text-sm font-semibold uppercase tracking-wide text-white">
												Vote
											</div>
										</Link>
									</div>
								</div>
							</div>
						</div>
					))}
			</div>
			{/* 预加载 roles 的 character 图片 */}
			<PreloadImages loading={isLoadingImage} preloadImages={preloadImages} />
			<MainMenu />

			<MessageBox
				isOpen={isMessageBoxOpen}
				onClose={() => setIsMessageBoxOpen(false)}
				title="Conditions"
				content={
					<div className="mb-8 w-full px-6 text-center font-jamjuree text-base font-normal">
						The Sundog predict to earn voting event has ended. Our next memecoin
						predict to earn will soon launch. Please stay tuned.
					</div>
				}
				confirmText="Confirm"
				onConfirm={() => {
					setIsMessageBoxOpen(false);
				}}
			/>
		</div>
	);
};

export default withAuth(VotePage);
