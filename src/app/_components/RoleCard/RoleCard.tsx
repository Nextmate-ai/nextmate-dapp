'use client';

import React, {
	ForwardedRef,
	forwardRef,
	useEffect,
	useRef,
	useState,
} from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { CharacterRoleType } from '@/types/character.type';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LevelFactor } from '@/lib/handleLevelUp';
import { useLevelBreak } from '@/hooks/useLevelBreak';
import OperateBar from '@/app/_components/OperateBar';
import { useTransition, animated, config, useSpring } from 'react-spring';
import { useToastContext } from '../ToastModal/ToastContext';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';

interface RoleCardProps {
	onOpenQuiz: () => void;
	onOpenOutfitPanel: () => void;
	character: CharacterRoleType;
	onLevelUp: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
	onOpenQuiz,
	onOpenOutfitPanel,
	character,
	onLevelUp,
}) => {
	const router = useRouter();
	const [isActive, setIsActive] = useState<boolean>(false);
	const [loadedImage, setLoadedImage] = useState<string | null>(null);
	const [aspectRatio, setAspectRatio] = useState<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const { showRouterLoading } = useRouterLoadingContext();

	const { showToast } = useToastContext();
	useEffect(() => {
		const img = new Image();
		img.onload = () => {
			setLoadedImage(character.backgroundImage);
			setAspectRatio(img.naturalWidth / img.naturalHeight);
			setIsActive(true);
		};
		img.src = `/img/${character.backgroundImage}.png`;
	}, [character.backgroundImage]);
	// aspectRatio 状态来存储图片的宽高比，而不是直接存储高度。
	useEffect(() => {
		const updateHeight = () => {
			/* 动态设置容器的高度，基于当前宽度和图片的宽高比 */
			if (containerRef.current && aspectRatio) {
				const width = containerRef.current.offsetWidth;
				containerRef.current.style.height = `${width / aspectRatio}px`;
			}
		};

		updateHeight();
		window.addEventListener('resize', updateHeight);
		return () => window.removeEventListener('resize', updateHeight);
	}, [aspectRatio]);

	const transitions = useTransition(loadedImage, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: {
			tension: 280,
			friction: 60,
			duration: 600,
		},
	});

	const [isShowDetails, setIsShowDetails] = useState<boolean>(false);
	const progress = Math.min(
		(character?.experience / character?.experienceToNextLevel) * 100,
		100,
	);
	const breakInfoDialogRef = useRef<HTMLDialogElement>(null);
	const levelBreakDialogRef = useRef<HTMLDialogElement>(null);
	const props = useSpring({
		opacity: isShowDetails ? 1 : 0,
		maxHeight: isShowDetails ? 100 : 0,
		config: { tension: 300, friction: 30 },
	});

	const { handleLevelBreak } = useLevelBreak({
		characterId: character?.id,
		levelUpCallback: () => onLevelUp(),
	});

	return (
		// <div className="mx-auto w-full max-w-md rounded-lg bg-black px-4 py-2">
		// 	<div className="ml-3 flex items-center justify-between">
		// 		<div className="flex items-center">
		// 			<div
		// 				className="relative z-30"
		// 				onClick={() => setIsShowDetails(!isShowDetails)}
		// 			>
		// 				<img
		// 					src={character.avatar}
		// 					width={80}
		// 					height={80}
		// 					alt="User Avatar"
		// 					className={`${
		// 						character.fatigueValue === 100 ? 'grayscale(100%) filter' : ''
		// 					}`}
		// 				/>
		// 				{/* <div
		//       className={`absolute h-3 w-3 rounded-full ${
		//         isActive ? "bg-green-600" : "bg-red-600"
		//       } bottom-0 right-0 text-sm flex justify-center items-center text-white border-2 border-white rounded-full`}
		//     /> */}
		// 			</div>
		// 			<div className="ml-4 flex flex-col self-start">
		// 				{/* <div className="flex flex-col items-center justify-end gap-2 self-start"> */}
		// 				<div className="text-lg font-semibold text-white">
		// 					{character.name}
		// 				</div>
		// 				<span
		// 					className={`-mt-[3px] min-w-14 text-xs ${
		// 						character?.isNeedLevelBreak
		// 							? 'text-[#6E67F6]'
		// 							: 'text-white opacity-80'
		// 					} whitespace-nowrap break-keep`}
		// 				>
		// 					Level
		// 					<span className="ml-1 font-medium text-white opacity-80">
		// 						{character.level}
		// 					</span>
		// 				</span>
		// 			</div>
		// 		</div>

		// 		{/* <button
		// 			className={cn(
		// 				'text-nowrap rounded-full px-2 py-1 text-sm font-semibold',
		// 				isNeedLevelBreak
		// 					? 'bg-[#6E67F6] text-white'
		// 					: 'bg-[#fafafa] text-gray-500',
		// 			)}
		// 			onClick={() => {
		// 				if (isNeedLevelBreak) {
		// 					levelBreakDialogRef.current.showModal();
		// 				} else {
		// 					breakInfoDialogRef.current?.showModal();
		// 				}
		// 			}}
		// 		>
		// 			Level Break
		// 		</button> */}
		// 	</div>

		// 	<div className="relative -mt-[35px] h-[210px] w-full">
		// 		<img
		// 			className="absolute z-20 h-[210px] w-full"
		// 			src="/img/bg-img-border.png"
		// 		/>
		// 		<img
		// 			onClick={() => router.push(`/chat/${index}`)}
		// 			className="relative z-10 h-full w-full rounded-lg object-cover object-center"
		// 			src={`/img/${character?.backgroundImage}.png`}
		// 			alt="role"
		// 		/>
		// 		<div className="absolute bottom-6 right-3 z-40">
		// 			<OperateBar
		// 				onChatClick={() => {
		// 					if (character?.fatigueValue < 100) {
		// 						router.push(`/communicate/${character.id}`);
		// 					}
		// 				}}
		// 				onOutfitClick={() => {
		// 					onOpenOutfitPanel();
		// 				}}
		// 				onQuizClick={() => {
		// 					onOpenQuiz();
		// 				}}
		// 			/>
		// 		</div>
		// 		{/* <div className="absolute bottom-0 left-0 right-0 z-20 flex h-1/3 items-center justify-center rounded-lg bg-gradient-to-t from-black to-transparent">
		// 			<p className="line-clamp-2 px-4 text-white">
		// 				{character?.introduction}
		// 			</p>
		// 		</div> */}
		// 	</div>

		// 	<div className="relative z-20 my-2 flex items-center justify-between">
		// 		<div className="flex flex-1 pr-5">
		// 			<span className="mr-2 text-xs text-white">Experience</span>
		// 			<div className="relative h-[5px] w-full self-center rounded-full bg-white">
		// 				<div
		// 					className={`absolute h-full ${
		// 						character?.isNeedLevelBreak ? 'bg-[#6E67F6]' : 'bg-[#999999]'
		// 					} rounded-full`}
		// 					style={{ width: `${progress}%` }}
		// 				></div>
		// 			</div>
		// 			<span
		// 				className={`ml-6 text-xs ${character?.isNeedLevelBreak ? 'text-[#6E67F6]' : 'text-white'}`}
		// 			>{`${Math.floor(progress)}/100`}</span>
		// 		</div>
		// 		<ChevronDown
		// 			onClick={() => setIsShowDetails(!isShowDetails)}
		// 			className={cn('h-8 w-8 text-white transition-all', {
		// 				'rotate-180': isShowDetails,
		// 			})}
		// 		/>
		// 	</div>
		// 	{isShowDetails && (
		// 		<div className="my-1 flex flex-col gap-1">
		// 			<Progress
		// 				text="Intimacy"
		// 				value={character?.intimacy}
		// 				max={character?.factor.breakRequired.score}
		// 			/>
		// 			{/* <Progress
		// 				text="Ability"
		// 				value={character.ability}
		// 				max={character?.factor.breakRequired.score}
		// 			/> */}
		// 			<Progress
		// 				text="Leisure"
		// 				value={character?.leisure}
		// 				max={character?.factor.breakRequired.score}
		// 			/>
		// 			<Progress text="Tiredness" value={character.fatigueValue} />
		// 		</div>
		// 	)}
		// 	<BreakInfoDialog
		// 		ref={breakInfoDialogRef}
		// 		info={character?.factor}
		// 		onConfirm={() => breakInfoDialogRef.current.close()}
		// 	/>

		// 	<LevelBreakDialog
		// 		ref={levelBreakDialogRef}
		// 		factor={character?.factor}
		// 		onConfirm={async () => {
		// 			await handleLevelBreak();
		// 			levelBreakDialogRef.current.close();
		// 		}}
		// 		onCancel={() => levelBreakDialogRef.current.close()}
		// 	/>
		// </div>

		<>
			<div className="relative mb-2 min-h-80 w-full" ref={containerRef}>
				{/* 半透明白色占位图 */}
				{!isActive && (
					<div className="h-full w-full animate-pulse rounded-md bg-gray-200" />
				)}

				{transitions(
					(style, item) =>
						item && (
							<animated.img
								src={`/img/${item}.png`}
								alt="Character Background"
								style={{
									...style,
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
							/>
						),
				)}
				{/* roles info */}
				<div className="absolute left-6 top-4">
					<div className="relative flex w-40 flex-col">
						<div className="text-gradient bg-text-gradient font-jamjuree text-3xl font-semibold uppercase tracking-widest text-white">
							{character?.name === 'Dragon' ? 'DGTRON' : character?.name}
						</div>

						<div
							className="mt-1 flex items-center justify-start"
							onClick={() => setIsShowDetails(!isShowDetails)}
						>
							<div className="w-14 font-jamjuree text-xs font-semibold capitalize text-white">
								Level {character.level}
							</div>
							<div className="w-9 text-end font-jamjuree text-[10px] font-semibold capitalize text-white">
								{`${Math.floor(progress)}/100`}
							</div>
							<img
								src="/img/icon/down-arrow.svg"
								alt="arrow"
								className={cn('ml-2 w-2 text-white transition-all', {
									'rotate-180': isShowDetails,
								})}
							/>
						</div>

						{isShowDetails && (
							<animated.div
								style={props}
								className="mt-1 flex h-12 flex-col items-start justify-start"
							>
								<div className="flex items-center justify-start">
									<div className="w-14 font-jamjuree text-[10px] font-normal capitalize text-white">
										Intimacy
									</div>
									<div className="w-9 text-end font-jamjuree text-[10px] font-normal capitalize text-white">
										{character?.intimacy}/
										{character?.factor.breakRequired.score}
									</div>
								</div>
								<div className="flex items-center justify-start">
									<div className="w-14 font-jamjuree text-[10px] font-normal capitalize text-white">
										Leisure
									</div>
									<div className="w-9 text-end font-jamjuree text-[10px] font-normal capitalize text-white">
										{character?.leisure}/{character?.factor.breakRequired.score}
									</div>
								</div>
								<div className="flex items-center justify-start">
									<div className="w-14 font-jamjuree text-[10px] font-normal capitalize text-white">
										Tiredness
									</div>
									<div className="w-9 text-end font-jamjuree text-[10px] font-normal capitalize text-white">
										{character?.fatigueValue}/{100}
									</div>
								</div>
							</animated.div>
						)}
						{/* {isShowDetails && (
							<div className="mt-2 flex h-12 flex-col items-start justify-start gap-0.5">
								<div className="flex w-24 items-center justify-between gap-1">
									<div className="font-jamjuree w-14 text-xs font-normal capitalize text-white">
										Intimacy
									</div>
									<div className="font-jamjuree text-center text-xs font-normal capitalize text-white">
										{character?.intimacy}/
										{character?.factor.breakRequired.score}
									</div>
								</div>
								<div className="flex w-24 items-center justify-between gap-1">
									<div className="font-jamjuree w-14 text-xs font-normal capitalize text-white">
										Leisure
									</div>
									<div className="font-jamjuree text-center text-xs font-normal capitalize text-white">
										{character?.leisure}/{character?.factor.breakRequired.score}
									</div>
								</div>
								<div className="flex w-24 items-center justify-between gap-1">
									<div className="font-jamjuree w-14 text-xs font-normal capitalize text-white">
										Tiredness
									</div>
									<div className="font-jamjuree text-center text-xs font-normal capitalize text-white">
										{character?.fatigueValue}/{100}
									</div>
								</div>
							</div>
						)} */}
					</div>
				</div>
				{/* roles operater */}
				{isActive && (
					<div className="absolute -bottom-[52px] flex w-full items-end justify-center">
						{/* coming soon */}
						<button
							className="relative w-20"
							onClick={() => {
								showToast('Coming soon', 'info');
							}}
						>
							<img
								src="/img/bg-roles-btn.png"
								alt="coming-soon"
								className="w-full"
							/>
							<img
								src="/img/icon/coming-soon.svg"
								alt="icon"
								className="absolute left-1/4 top-1/2 w-6 -translate-y-1/2"
							/>
						</button>
						{/* chat */}
						<Link
							className="relative flex-1"
							onClick={() => showRouterLoading(`/communicate/${character.id}`)}
							href={`/communicate/${character.id}`}
						>
							<img
								src="/img/chat-talk.png"
								alt="coming soon"
								className="w-full"
							/>
						</Link>
						{/* equipment */}
						<button
							className="relative w-20"
							onClick={() => {
								onOpenOutfitPanel();
							}}
						>
							<img
								src="/img/bg-roles-btn.png"
								alt="coming-soon"
								className="w-full scale-x-[-1] transform"
							/>
							<img
								src="/img/icon/equipment.svg"
								alt="icon"
								className="absolute right-1/4 top-1/2 w-6 -translate-y-1/2"
							/>
						</button>
					</div>
				)}
			</div>
		</>
	);
};

const Progress = ({
	text,
	value = 0,
	max = 100,
}: {
	max?: number;
	value: number;
	text: string;
}) => {
	const progress = Math.min((value / max) * 100, 100);
	return (
		<div className="flex items-center gap-2">
			<span className="min-w-14 text-xs text-white">{text}</span>
			<div className="relative h-1 w-full rounded-full bg-gray-300">
				<div
					className={`absolute h-full rounded-full ${
						progress >= 100 ? 'bg-[#6E67F6]' : 'bg-neutral-500'
					}`}
					style={{ width: `${progress}%` }}
				></div>
			</div>
			<span className="min-w-14 text-right text-xs text-white">{`${value}/${max}`}</span>
		</div>
	);
};

const BreakInfoDialog = forwardRef(
	(
		props: {
			info?: LevelFactor;
			onConfirm: () => void;
		},
		ref: ForwardedRef<HTMLDialogElement>,
	) => {
		return (
			<dialog ref={ref} className="overflow-hidden bg-transparent">
				<div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-80">
					<div className="flex w-5/6 flex-col justify-center rounded-2xl bg-white px-5 py-6 sm:max-w-[520px]">
						<div className="relative">
							<h2 className="text-center text-xl font-semibold">
								How to Make Level Break
							</h2>
							<X
								className="absolute right-0 top-0 text-gray-500"
								onClick={() => props.onConfirm()}
							/>
						</div>
						<p className="mt-8 max-w-[312px]">
							Level Break to Level {props.info?.maxLevel + 1}
						</p>

						<div className="my-4">
							<p>Requirements</p>
							<ul className="flex flex-col gap-1">
								<li>· Experience: Maxed at level {props.info?.maxLevel}</li>
								<li>· Intimacy: {props.info?.breakRequired.score}</li>
								{/* <li>· Ability: {props.info?.breakRequired.score}</li> */}
								<li>· Leisure: {props.info?.breakRequired.score}</li>
							</ul>
						</div>

						<div>
							<p>Cost</p>
							<ul className="flex flex-col gap-1">
								<li className="flex gap-2">
									· Gem: {props.info?.breakRequired.diamond} <DiamondIcon />
								</li>
							</ul>
						</div>
					</div>
				</div>
			</dialog>
		);
	},
);
BreakInfoDialog.displayName = 'BreakInfoDialog';

const LevelBreakDialog = forwardRef(
	(
		props: {
			factor?: LevelFactor;
			onConfirm: () => void;
			onCancel: () => void;
		},
		ref: ForwardedRef<HTMLDialogElement>,
	) => {
		return (
			<dialog ref={ref} className="overflow-hidden bg-transparent">
				<div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-80">
					<div className="flex w-5/6 flex-col justify-center rounded-2xl bg-white px-5 py-6 sm:max-w-[520px]">
						<div className="relative">
							<h2 className="text-center text-xl font-semibold">
								Ready to Next Level?
							</h2>
							<X
								className="absolute right-0 top-0 text-gray-500"
								onClick={() => props.onCancel()}
							/>
						</div>
						<p className="mt-8 max-w-[312px]">
							Level Up and let&apos;s explore more exciting thins together!
						</p>
						<div className="flex justify-center">
							<button
								className="mt-8 flex gap-2 rounded-full bg-[#6E67F6] px-16 py-3 text-white"
								onClick={() => props.onConfirm()}
							>
								<DiamondIcon /> {props.factor?.breakRequired.diamond}
							</button>
						</div>
					</div>
				</div>
			</dialog>
		);
	},
);
LevelBreakDialog.displayName = 'LevelBreakDialog';

const DiamondIcon = () => (
	<svg
		width="23"
		height="23"
		viewBox="0 0 23 23"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clipPath="url(#clip0_2459_457)">
			<path
				d="M8.44444 2.33301H4.77778L0.5 7.83301H6.61111L8.44444 2.33301Z"
				fill="#BDDDF4"
			/>
			<path
				d="M22.5001 7.83301L18.2223 2.33301H14.5557L16.389 7.83301H22.5001Z"
				fill="#5DADEC"
			/>
			<path
				d="M16.3889 7.83301H22.5L11.5 20.6663L16.3889 7.83301Z"
				fill="#4289C1"
			/>
			<path
				d="M6.61111 7.83301H0.5L11.5 20.6663L6.61111 7.83301ZM8.44444 2.33301L6.61111 7.83301H16.3889L14.5556 2.33301H8.44444Z"
				fill="#8CCAF7"
			/>
			<path
				d="M11.5002 20.6663L6.61133 7.83301H16.3891L11.5002 20.6663Z"
				fill="#5DADEC"
			/>
		</g>
		<defs>
			<clipPath id="clip0_2459_457">
				<rect
					width="22"
					height="22"
					fill="white"
					transform="translate(0.5 0.5)"
				/>
			</clipPath>
		</defs>
	</svg>
);

export default RoleCard;
