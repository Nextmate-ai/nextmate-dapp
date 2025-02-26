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
import WithdrawDrawer from '@/app/_components/WithdrawDrawer/WithdrawDrawer';
import { LoaderCircle } from 'lucide-react';
import RouletteResultDrawer from '@/app/_components/RouletteResultDrawer/RouletteResultDrawer';
import PreloadImages from '@/app/_components/PreloadImages/PreloadImags';
import { useLotteryPrizes } from '@/hooks/useLotteryPrizes';
import { useUserBalance } from '@/hooks/useBalance';
import { useUserInfo } from '@/hooks/useUserInfo';
import Link from 'next/link';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import { usePreloadImage } from '@/hooks/usePreloadImage';

const RoulettePage: React.FC = () => {
	const router = useRouter();
	const [images, setImages] = useState([
		'/img/roulette/bg-gift.png',
		'/img/bg-spin.png',
		'/img/icon/light.svg',
	]);
	const account = useSelector((state: RootState) => state.accountInfo.account);
	const [isOpen, setIsOpenHistory] = useState(false);
	const [isOpenResult, setIsOpenResult] = useState(false);
	const [history, setHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [isSpinEnd, setIsSpinEnd] = useState(false);
	const [isRendered, setIsRendered] = useState(false);
	const [luckyLottery, setLuckyLottery] = useState(null);
	const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
	const { roulette, poolId } = useLotteryPrizes('DevEvent');
	const { data: balance, reload: reloadBalance } = useUserBalance();
	const { user, isLoading: isLoadingUser, reload: reloadUser } = useUserInfo();
	const { showToast } = useToastContext();
	const { isLoadingImage, preloadImages } = usePreloadImage(images);

	// 获取历史记录
	const fetchHistory = async () => {
		try {
			const res = await fetchAPI(`/api/lottery/records`, {
				method: 'GET',
				params: {
					poolId,
				},
			});
			if (res.success === true) {
				setHistory(res.data);
			}
		} catch (error) {
			console.log('error...', error);
		}
	};

	const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
	const handleStartDraw = async () => {
		console.log(9333, isLoading, !isRendered);

		if (isLoading) return;
		if (!isRendered) return;
		setIsSpinEnd(false);
		luckyLottery?.play();
		setIsLoading(true);
		console.log('luckyLottery', roulette);
		const result = drawLottery();
		if (result === 4) {
			setResult({ ...roulette[4], name: 'CLOTHES' });
		} else {
			setResult(roulette[result]);
		}
		console.log('result', result, roulette[result]);
		luckyLottery.stop(result);
		await sleep(3000);
		setIsLoading(false);
	};
	// 抽奖
	function drawLottery(): number {
		const random = Math.random() * 100; // 生成0-100的随机数
		let currentProb = 0;

		// 100U - 0.763%
		currentProb += 0.763;
		if (random <= currentProb) {
			return 2;
		}

		// 50U - 1.527%
		currentProb += 1.527;
		if (random <= currentProb) {
			return 1;
		}

		// 10U - 3.817%
		currentProb += 3.817;
		if (random <= currentProb) {
			return 3;
		}

		// 衣服 - 9.924%
		currentProb += 9.924;
		if (random <= currentProb) {
			return 4;
		}

		// 帽子 - 7.634%
		currentProb += 7.634;
		if (random <= currentProb) {
			return 0;
		}

		// 1U - 76.376% (剩余概率)
		return 5;
	}

	useEffect(() => {
		if (result && isSpinEnd) {
			setIsOpenResult(true);
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
						background: index % 2 === 0 ? '#FFE716' : '#C2BEFF',
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
									src: '/img/roulette/bg-center.png',
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

	const handleClick = (path: string) => {
		router.push(`/roulette/${path}`);
	};
	console.log(197, isLoading);

	return (
		<div className="flex h-screen w-full translate-y-0 transform flex-col bg-bg-purple bg-cover transition-transform duration-300">
			<div className="no-scrollbar flex flex-grow flex-col items-center justify-start overflow-x-hidden overflow-y-scroll">
				<div
					className={`relative -mt-[250px] h-[580px] w-[580px] rotate-180 bg-[length:100%_100%] bg-no-repeat ${isRendered ? 'bg-bg-roulette' : 'animate-pulse rounded-full bg-gray-300'}`}
				>
					<div id="lucky-lottery" className="mx-auto w-full"></div>
					{isRendered && (
						<div className="absolute -top-7 left-1/2 z-20 -translate-x-1/2">
							<img
								src="/img/roulette/point.png"
								alt="point"
								className="z-20 w-20 rotate-180"
							/>
						</div>
					)}
				</div>

				{/* roulette text */}
				<div className="mt-7 w-full text-center text-4xl font-bold italic leading-9 text-[#ffec47] text-shadow-yellow">
					[Offline Only] Spin
				</div>
				<div className="mb-4 w-full text-center text-4xl font-bold italic leading-9 text-[#ffec47] text-shadow-yellow">
					to Win 1000 USDT!
				</div>

				<div className="w-full px-3 text-center font-jamjuree text-sm font-normal text-white">
					Available only for attendees at our offline event in Bangkok! Join us
					at W2140 booth D24!
				</div>

				{/* spin button */}
				<div className="relative mt-6 flex w-full justify-center">
					<button
						className={`relative h-16 w-80 bg-bg-spin-btn-active bg-[length:100%_100%] bg-no-repeat`}
						onClick={() => {
							handleStartDraw();
						}}
						// disabled={isLoading}
					>
						<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							<div className="flex items-center justify-center">
								<div className="font-chakra text-base font-semibold tracking-wider text-white">
									Spin offline!
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
			</div>
			<MainMenu />
			{/* 抽奖历史 */}
			<RouletteHistoryDrawer
				isOpen={isOpen}
				type="general"
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
