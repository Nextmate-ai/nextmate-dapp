'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { fetchBalance } from '@/lib/balanceApi';
import MainMenu from '@/app/_components/MainMenu/MainMenu';
import RouletteHistoryDrawer from '@/app/_components/RouletteHistoryDrawer/RouletteHistoryDrawer';
import { LuckyWheel } from 'lucky-canvas';
import fetchAPI from '@/lib/api';
import WithdrawDrawer from '@/app/_components/WithdrawDrawer/HippoWithdrawDrawer';
import { LoaderCircle } from 'lucide-react';
import RouletteResultDrawer from '@/app/_components/RouletteResultDrawer/RouletteResultDrawer';
import PreloadImages from '@/app/_components/PreloadImages/PreloadImags';
import { useLotteryPrizes } from '@/hooks/useLotteryPrizes';
import { useUserBalance } from '@/hooks/useBalance';
import { useUserInfo } from '@/hooks/useUserInfo';
import Link from 'next/link';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import { usePreloadImage } from '@/hooks/usePreloadImage';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';
import RouletteTab from '../tab/page';

const RoulettePage: React.FC = () => {
	const router = useRouter();
	const [images, setImages] = useState([
		'/img/roulette/bg-gift.png',
		'/img/icon/light.svg',
		'/img/Hippo-token.png',
		'/img/blue-balance-panel.png',
		'/img/blue-history-border.png',
	]);
	const account = useSelector((state: RootState) => state.accountInfo.account);
	const [isActive, setIsActive] = useState(false);
	const [isOpen, setIsOpenHistory] = useState(false);
	const [isOpenResult, setIsOpenResult] = useState(false);
	const [history, setHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [isSpinEnd, setIsSpinEnd] = useState(false);
	const [isRendered, setIsRendered] = useState(false);
	const [luckyLottery, setLuckyLottery] = useState(null);
	const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
	const { roulette, poolId } = useLotteryPrizes('Hippo');
	const { data: balance, reload: reloadBalance } = useUserBalance();
	const { user, isLoading: isLoadingUser, reload: reloadUser } = useUserInfo();
	const { showToast } = useToastContext();
	const { showRouterLoading } = useRouterLoadingContext();
	const { isLoadingImage, preloadImages } = usePreloadImage(images);

	useEffect(() => {
		if (user?.hippoDrawCount > 0) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [user]);

	// 获取历史记录
	const fetchHistory = async () => {
		try {
			const res = await fetchAPI(`/api/lottery/records?poolId=${poolId}`, {
				method: 'GET',
			});
			if (res.success === true) {
				setHistory(res.data);
			}
		} catch (error) {
			console.log('error...', error);
		}
	};

	const handleStartDraw = () => {
		if (isLoading || !isRendered || !isActive) return;
		setIsSpinEnd(false);
		luckyLottery?.play();
		handleDraw();
		// setResult(roulette[3]);
		// luckyLottery.stop(3);
	};
	// 抽奖
	const handleDraw = async () => {
		setIsLoading(true);
		try {
			const res = await fetchAPI('/api/lottery/draw', {
				method: 'POST',
				body: {
					poolId,
				},
			});
			if (res.success) {
				console.log('res.data...', res.data);
				const index = roulette.findIndex(item => item.id === res.data.id);
				luckyLottery.stop(index);
				setResult(res.data);
				await reloadUser();
				await fetchHistory();
			} else {
				showToast(res.msg, 'error');
				luckyLottery.stop(0);
				setResult(null);
				setIsLoading(false);
				console.log('spin error...', res);
			}
		} catch (error) {
			luckyLottery.stop(0);
			setResult(null);
			console.log('error...', error);
			showToast('Something went wrong, please try again later.', 'error');
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (result && isSpinEnd) {
			setIsOpenResult(true);
			reloadBalance();
		}
	}, [result, isSpinEnd]);

	useEffect(() => {
		if (poolId) {
			fetchHistory();
		}
	}, [poolId]);

	useEffect(() => {
		if (roulette.length > 0) {
			const lucky = new LuckyWheel(
				{
					el: '#lucky-lottery',
				},
				{
					width: 580,
					height: 580,
					blocks: [
						{ padding: '20px' },
						{
							padding: '40px',
						},
					],
					prizes: roulette.map((prize, index) => ({
						background: index % 2 === 0 ? '#FFE716' : '#4DA2FF',
						imgs: [
							{
								src: prize.image,
								width: '45%',
								top: '15%',
							},
						],
					})),
					buttons: [
						{
							radius: '20%',
							imgs: [
								{
									src: '/img/hippo-spin.png',
									width: '100%',
									top: '-130%',
								},
							],
						},
					],
					start: handleStartDraw,
					end: () => {
						setIsSpinEnd(true);
					},
				},
			);
			setLuckyLottery(lucky);
			setIsRendered(true);
		}
	}, [roulette]);

	return (
		<div className="no-scrollbar flex h-screen w-full flex-col overflow-x-hidden overflow-y-scroll bg-bg-blue bg-cover">
			<div className="flex flex-grow flex-col items-center justify-start">
				<div
					className="fixed left-3 top-4 z-10 h-7 w-[85px] bg-bg-balance bg-[length:100%_100%] bg-no-repeat"
					onClick={() => setIsOpenHistory(true)}
				>
					<div className="flex h-7 w-full items-center justify-center gap-1">
						<img src="/img/icon/gift.svg" alt="gift" className="w-4" />
						<div className="font-jamjuree text-sm font-medium tracking-wide text-black">
							Record
						</div>
					</div>
				</div>
				{/* balance */}
				<div
					className="fixed right-3 top-4 z-10 h-7 w-20 bg-bg-balance bg-[length:100%_100%] bg-no-repeat"
					onClick={() => setIsWithdrawOpen(true)}
				>
					<div className="flex h-7 w-full items-center justify-center gap-1">
						<img src="/img/logo/hippo.png" alt="hippo" className="w-4" />
						<div className="font-jamjuree text-sm font-medium uppercase tracking-wide text-black">
							{balance?.hippo}
						</div>
					</div>
				</div>
				{/* roulette */}
				<div
					className={`relative -mt-[250px] h-[580px] w-[580px] rotate-180 bg-[length:100%_100%] bg-no-repeat ${isRendered ? 'bg-blue-roulette' : 'animate-pulse rounded-full bg-gray-300'}`}
				>
					<div id="lucky-lottery" className="mx-auto w-full"></div>
					{isRendered && (
						<div className="absolute -top-7 left-1/2 z-20 -translate-x-1/2">
							<img
								src="/img/roulette/blue-point.png"
								alt="point"
								className="z-20 w-20 rotate-180"
							/>
						</div>
					)}
				</div>

				<RouletteTab />

				{/* roulette text */}
				<div className="mt-3 w-full text-center font-jamjuree text-2xl font-bold italic leading-9 text-[#ffec47] text-shadow-yellow">
					Spin and win
				</div>
				<div className="mb-2 w-full text-center text-2xl font-bold italic leading-9 text-[#ffec47] text-shadow-yellow">
					$1,500,000 HIPPO rewards!
				</div>

				<div className="w-full px-3 text-center font-jamjuree text-sm font-normal text-white">
					The campaign will run for 14 days or until all $Hippo tokens are
					distributed, whichever comes first.
				</div>

				{/* spin button */}
				<div className="relative mt-4 flex w-full justify-center">
					<button
						className={`relative h-16 w-80`}
						onClick={() => {
							handleStartDraw();
						}}
						disabled={isLoading}
					>
						<img
							src={
								isActive ? '/img/blue-btn.png' : '/img/bg-spin-btn-inactive.png'
							}
							alt="spin button"
							className="absolute inset-0 h-full w-full object-cover"
						/>
						<div className="absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/2">
							<div className="flex items-center justify-center">
								<img
									src="/img/logo/hippo.png"
									alt="hippo"
									className="mr-3 w-4"
								/>
								<div className="text-center font-chakra text-base font-semibold tracking-wide text-white">
									SPIN x {user?.hippoDrawCount || 0}
								</div>
							</div>
						</div>
						{isLoading && (
							<LoaderCircle
								className="absolute right-[15%] top-[30%] animate-spin"
								color="white"
							/>
						)}
					</button>
				</div>
				{!isActive && (
					<div className="mx-auto mt-2 w-72 text-center font-jamjuree text-base font-medium leading-5 text-[#979797]">
						<Link
							href={'/profile/v1'}
							onClick={() => showRouterLoading('/profile/v1')}
						>
							<p className="cursor-pointer underline">
								Gaining more $Hippo token
							</p>
						</Link>
					</div>
				)}
			</div>
			<MainMenu />
			{/* 抽奖历史 */}
			<RouletteHistoryDrawer
				isOpen={isOpen}
				type="hippo"
				history={history}
				onClose={() => {
					setIsOpenHistory(false);
				}}
			/>
			{/* 中奖结果 */}
			<RouletteResultDrawer
				isOpen={isOpenResult}
				result={result}
				onClose={() => {
					setIsOpenResult(false);
					setIsLoading(false);
				}}
			/>
			{/* 提现 */}
			<WithdrawDrawer
				isOpen={isWithdrawOpen}
				onClose={() => {
					setIsWithdrawOpen(false);
				}}
			/>

			{/* 预加载 roles 的 character 图片 */}
			<PreloadImages loading={isLoadingImage} preloadImages={preloadImages} />
		</div>
	);
};

export default withAuth(RoulettePage);
