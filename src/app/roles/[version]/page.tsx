'use client';

import React, { useEffect, useRef, useState } from 'react';
import RoleCard from '@/app/_components/RoleCard/RoleCard';
import MainMenu from '@/app/_components/MainMenu/MainMenu';
import QuizDrawer from '@/app/_components/QuizDrawer/QuizDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { RootState, AppDispatch } from '@/store/store';
import { useRoleList } from '@/hooks/useRoleList';
import EquipmentPanel from '@/app/_components/EquipmentPanel/EquipmentPanel';
import { GiftButton } from '@/app/_components/GiftButton/GiftButton';
import InvitePop from '@/app/_components/InvitePop/InvitePop';
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import PreloadImages from '@/app/_components/PreloadImages/PreloadImags';
import { useRouter, usePathname } from 'next/navigation';
import { Task, useTaskList } from '@/hooks/useTaskList';
import { useUserBalance } from '@/hooks/useBalance';
import { useLotteryPrizes } from '@/hooks/useLotteryPrizes';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useFetchTokenList } from '@/hooks/useFetchTokenList';
import Link from 'next/link';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';

const RoleCardSkeleton: React.FC = () => {
	return (
		<div className="mx-auto w-full max-w-md animate-pulse rounded-lg bg-white px-4 py-2">
			<div className="mb-2 flex items-center justify-between">
				<div className="flex items-end">
					<div className="h-[70px] w-[70px] rounded-full bg-gray-300"></div>
					<div className="ml-[-5px] flex h-[70px] flex-col justify-end gap-2 pb-1">
						<div className="ml-4 h-6 w-24 rounded bg-gray-300"></div>
						<div className="ml-4 h-[5px] w-28 rounded-full bg-gray-300"></div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="h-[30px] w-[30px] rounded bg-gray-300"></div>
					<div className="h-[30px] w-[30px] rounded bg-gray-300"></div>
					<div className="h-[41px] w-[41px] rounded-full bg-gray-300"></div>
				</div>
			</div>
			<div className="relative h-[210px] w-full rounded-lg bg-gray-300"></div>
		</div>
	);
};

const Roles: React.FC = () => {
	const router = useRouter();
	const [isLoadingImage, setIsLoadingImage] = useState(true);
	const [preloadImages, setPreloadImages] = useState([]);
	const [isDrawerOpen, setDrawerOpen] = useState(false);
	const [isPanelOpen, setPanelOpen] = useState(false);
	const [isReferalCodeOpen, setReferalCodeOpen] = useState(false);
	const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
		null,
	);
	const [referralCode, setReferralCode] = useState<string | null>(null);
	const [invitationConfirmed, setInvitationConfirmed] = useState(false);
	const dispatch = useDispatch<AppDispatch>();

	// const balance = useSelector((state: RootState) => state.balance);
	const account = useSelector((state: RootState) => state.accountInfo).account;
	const {
		characters = [],
		error,
		isLoading,
		refreshCharacters,
	} = useRoleList();
	const [character, setCharacter] = useState(null);
	// 在这预加载
	const { tasks, reload } = useTaskList();
	const { roulette } = useLotteryPrizes();
	const { data: balance, reload: reloadBalance } = useUserBalance();
	const { user, isLoading: isLoadingUser } = useUserInfo();

	const { showRouterLoading } = useRouterLoadingContext();

	const handleCharacterSelect = (selectedCharacter: any) => {
		setCharacter(selectedCharacter);
	};

	const { tokenList } = useFetchTokenList();

	useEffect(() => {
		if (characters.length > 0) {
			setCharacter(characters[0]);
		}
	}, [characters]);

	useEffect(() => {
		if (characters.length === 0) return;

		const imageList = characters.flatMap(character => {
			const { avatar, backgroundImage, equipmentName, name } = character;
			const lowercaseName = name.toLowerCase();

			return [
				avatar.startsWith('/img') ? avatar : `/img/${avatar}.png`,
				`/img/${backgroundImage}.png`,
				`/img/${equipmentName ? `${lowercaseName}_${equipmentName}` : `${lowercaseName}-pure`}.png`,
				`/img/${equipmentName ? `${lowercaseName}_${equipmentName}.jpeg` : `${lowercaseName}.png`}`,
			];
		});
		// 去重
		const uniqueImageList = Array.from(new Set(imageList));

		preloadImagesFunc(uniqueImageList);
	}, [characters]);

	const handleOpenDrawer = (characterId: string) => {
		setSelectedCharacterId(characterId);
		setDrawerOpen(true);
	};
	const handleCloseDrawer = () => {
		setDrawerOpen(false);
	};
	const handleCloseReferalCode = () => {
		setReferalCodeOpen(false);
	};

	const handleClosePanel = () => {
		setPanelOpen(false);
	};

	const handleOpenOutfitPanel = (characterId: string) => {
		setSelectedCharacterId(characterId);
		setPanelOpen(true);
	};

	useEffect(() => {
		setInvitationConfirmed(user?.invitingConfirmed);
		if (!user?.invitingConfirmed) {
			const { initData } = retrieveLaunchParams();
			if (
				initData.startParam &&
				initData.startParam !== 'debug' &&
				initData.startParam !== user?.invitingCode
			) {
				setReferralCode(initData.startParam);
			}
		}
	}, [user?.invitingConfirmed]);

	useEffect(() => {
		const preloadImages = [
			'/img/roulette/point.png',
			'/img/roulette/bg-center.png',
			'/img/bg-equipment.png',
			'/img/bg-spin-btn-active.png',
			'/img/bg-spin-btn-inactive.png',
			'/img/bg-slap-sun.jpeg',
			'/img/bg-popup.png',
			'/img/logo/nextmate.png',
			'/img/logo/clarnium.png',
			'/img/icon/left-angle.svg',
			'/img/icon/token-history.svg',
			'/img/icon/coin.svg',
			'/img/icon/left-angle.svg',
			'/img/logo/nextmate.png',
			'/img/logo/okx.png',
			'/img/logo/clarnium.png',
			'/img/icon/up-arrow.svg',
			'/img/bg-connect-wallet.png',
			'/img/profile-bg-quest-task.png',
			'/img/icon/check-success.svg',
			'/img/USDT.png',
			'/img/icon/gift.svg',
			'/img/bg-balance.png',
			'/img/logo/tomtalk.png',
			'/img/icon/free-spin.png',
			'/img/icon/friend-ship.png',
			'/img/icon/wallet.svg',
			'/img/icon/trophies.png',
			'/img/ranking/invitation-bg-ranking.png',
			'/img/ranking/invitation-rules.png',
			'/img/ranking/ranking-moe-rules.png',
			'/img/icon/copy.svg',
			'/img/vote-logo.png',
			'/img/vote/muncat.png',
			'/img/vote/sundog.png',
			'/img/vote/afro.png',
			'/img/vote/bull.png',
			'/img/vote/rice.png',
			'/img/vote/dgtron.png',
			'/img/vote/pepe.png',
			'/img/icon/search.svg',
			'/img/connect-wallet-bg.png',
			'/img/icon/invite-person.png',
		];

		const imagePromises = preloadImages.map(src => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.src = src;
				img.onload = resolve;
				img.onerror = reject;
			});
		});

		Promise.all(imagePromises)
			.then(res => {
				setPreloadImages(preloadImages);
				setIsLoadingImage(false);
			})
			.catch(error => {
				console.error('图片预加载失败:', error);
				setIsLoadingImage(false);
			});
	}, []);

	// 预加载图片
	const preloadImagesFunc = async (images: string[]) => {
		const imagePromises = images.map(src => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.src = src;
				img.onload = resolve;
				img.onerror = reject;
			});
		});

		try {
			await Promise.all(imagePromises);
		} catch (error) {
			console.error('Error preloading images:', error);
		}
	};

	useEffect(() => {
		if (referralCode) {
			setReferalCodeOpen(true);
		}
	}, [referralCode]);

	return (
		<div className="flex h-full flex-col bg-bg-purple bg-cover bg-center bg-no-repeat">
			<div className="flex-grow overflow-y-scroll px-3">
				{/* top bar */}
				<div className="mt-4 flex w-full items-center justify-end gap-3">
					{/* energy */}
					<div className="flex h-6 items-center justify-center gap-1">
						<img src="/img/icon/energy.svg" alt="energy" className="w-4" />
						<div className="text-center font-poppins text-base font-medium leading-3 text-white">
							{balance?.energy}
						</div>
					</div>
					{/* diamond */}
					<div className="flex h-6 items-center justify-center gap-1">
						<img src="/img/icon/diamond.svg" alt="diamond" className="w-4" />
						<div className="text-center font-poppins text-base font-medium leading-3 text-white">
							{balance?.diamond}
						</div>
					</div>
					{/* gold */}
					<Link
						href={'/profile/v1'}
						onClick={() => showRouterLoading('/profile/v1')}
						className="flex h-6 items-center justify-center gap-1"
					>
						<img src="/img/icon/coin.svg" alt="coin" className="w-4" />
						<div className="text-center font-poppins text-base font-medium leading-3 text-white">
							{balance?.gold}
						</div>
						<img src="/img/icon/add-btn.svg" alt="add" className="w-[18px]" />
					</Link>
				</div>

				{/* role images */}
				<p className="mt-4 font-jamjuree text-base font-semibold uppercase tracking-wider text-white">
					AI Companions
				</p>

				<div>
					{isLoading ? (
						// Display skeletons while loading
						Array.from({ length: 1 }).map((_, index) => (
							<RoleCardSkeleton key={index} />
						))
					) : error ? (
						<div>Error: {error}</div>
					) : (
						<>
							<div className="relative w-full">
								<div className="no-scrollbar smooth-scroll relative mb-6 flex h-24 items-end justify-start gap-3 overflow-x-auto">
									{characters.map((character, index) => (
										<div
											key={index}
											className="relative h-20 w-20 flex-shrink-0 cursor-pointer"
											onClick={() => handleCharacterSelect(character)}
										>
											{/* avatar */}
											<img
												src={`${character.avatar.indexOf('/img') > -1 ? character.avatar : `/img/${character.avatar}.png`}`}
												alt="avatar"
												className={`h-full w-full object-cover ${
													character.fatigueValue === 100
														? 'grayscale(100%) filter'
														: ''
												}`}
											/>
											{/* new tag */}
											{character?.isNew && (
												<div className="absolute -left-1 top-2 origin-top-left rotate-[-29.53deg] text-center">
													<span className="font-chakra text-base font-bold tracking-wide text-[#ffe400]">
														New!
													</span>
												</div>
											)}
											{/* hot tag */}
											{character?.isHot && (
												<div className="absolute -left-1 top-2 origin-top-left rotate-[-29.53deg] text-center">
													<span className="font-chakra text-base font-bold uppercase tracking-wide text-[#ffe400]">
														Hot!
													</span>
												</div>
											)}
										</div>
									))}
									<div className="relative h-20 w-6 flex-shrink-0 cursor-pointer"></div>
								</div>
								{/* 渐变背景 */}
								<div className="absolute right-0 top-4 h-20 w-[20vw] bg-roles-gradient" />
							</div>
							{character && (
								<RoleCard
									onOpenQuiz={() => handleOpenDrawer(character.id)}
									onOpenOutfitPanel={() => handleOpenOutfitPanel(character.id)}
									onLevelUp={refreshCharacters}
									character={character}
								/>
							)}

							<QuizDrawer
								isOpen={isDrawerOpen}
								onClose={handleCloseDrawer}
								userCharacterId={selectedCharacterId || ''}
							/>
							<EquipmentPanel
								isOpen={isPanelOpen}
								onClose={handleClosePanel}
								refreshCharacters={() => refreshCharacters()}
								userCharacterId={selectedCharacterId || ''}
							/>
						</>
					)}
				</div>
			</div>
			<MainMenu />
			<GiftButton />
			<InvitePop
				isOpen={isReferalCodeOpen}
				title="You are invited!"
				description="Confirm the invitation code and get rewards of 500 gold coins."
				onClose={handleCloseReferalCode}
				referralCode={referralCode}
				invitationConfirmed={invitationConfirmed}
			/>
			{/* 预加载 roles 的 character 图片 */}
			<PreloadImages loading={isLoadingImage} preloadImages={preloadImages} />
		</div>
	);
};

export default withAuth(Roles);
