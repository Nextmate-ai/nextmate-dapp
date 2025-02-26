'use client';

import BalanceButton from '@/app/_components/BalanceButton/BalanceButton';
import { GiftButton } from '@/app/_components/GiftButton/GiftButton';
import LotteryCard from '@/app/_components/lotteryCard/lotteryCard';
import MainMenu from '@/app/_components/MainMenu/MainMenu';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import fetchAPI from '@/lib/api';
import { fetchBalance, updateBalance } from '@/lib/balanceApi';
import { AppDispatch, RootState } from '@/store/store';
import { RewardTypes } from '@/types/lottery.type';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Lottery: React.FC = () => {
	const [showLotteryCard, setShowLotteryCard] = useState<boolean>(false);
	const [stage, setStage] = useState(1);
	const [selectedReward, setSelectedReward] = useState<RewardTypes>();
	const [lotteryType, setLotteryType] = useState<'normal' | 'special'>(
		'normal',
	);
	const dispatch = useDispatch<AppDispatch>();
	const balance = useSelector((state: RootState) => state.balance);
	const account = useSelector((state: RootState) => state.accountInfo.account);

	const handleFirstStage = (type: 'normal' | 'special') => {
		setLotteryType(type);
		setStage(2);
	};

	const handleDraw = async (type: string, numDraws = 1, userId: string) => {
		try {
			const data = await fetchAPI('/api/lottery', {
				method: 'POST',
				body: { type, numDraws, userId },
			});
			setSelectedReward(data.rewards[0]);
			setShowLotteryCard(true);
			console.log(
				'account?.id:',
				account?.id,
				'lotteryType:',
				lotteryType,
				'selectedReward:',
				selectedReward,
			);
			saveLotteryRecord(account?.id, lotteryType, data.rewards[0]);
			subtractFromBalance(
				account?.id,
				lotteryType == 'normal' ? 'diamond' : 'gold',
				500,
			);
		} catch (error) {
			console.error('Failed to draw lottery:', error);
		}
	};

	const saveLotteryRecord = async (
		userId: string,
		type: string,
		reward: RewardTypes,
	) => {
		try {
			await fetchAPI('/api/lotteryRecord', {
				method: 'POST',
				body: { userId, type, reward },
			});
		} catch (error) {
			console.error('Failed to save lottery record:', error);
		}
	};

	const subtractFromBalance = async (
		userId: string,
		type: string,
		amount: number,
	) => {
		try {
			await dispatch(
				updateBalance({
					userId,
					type,
					amount:
						type == 'diamond'
							? balance.diamond - amount
							: balance.gold - amount,
				}),
			);
		} catch (error) {
			console.error(`Failed to update diamond in balance:`, error);
		}
	};

	const handleConfirm = async () => {
		if (account && account.id) {
			await handleDraw(lotteryType, 1, account?.id);
		}
	};

	const handleCancel = () => {
		setStage(1);
	};

	const handleTradeAgain = async () => {
		if (account && account.id) {
			await handleDraw(lotteryType, 1, account?.id);
		}
	};

	useEffect(() => {
		if (account && account.id) {
			dispatch(fetchBalance(account?.id));
		}
	}, [dispatch, account]);

	return (
		<div className="relative flex h-[100vh] flex-col">
			<div className="mt-14 text-center text-lg font-extrabold">
				{' '}
				Wishing Well
			</div>
			<div className="flex justify-around">
				<BalanceButton
					count={balance.diamond}
					iconSrc={'/img/icon/diamond.png'}
					onIncrement={() => {
						console.log('xixi');
					}}
				></BalanceButton>
				<BalanceButton
					count={balance.gold}
					iconSrc={'/img/icon/coin.png'}
					onIncrement={() => {
						console.log('xixi');
					}}
				></BalanceButton>
				<BalanceButton
					count={balance.energy}
					iconSrc={'/img/icon/energy.png'}
					onIncrement={() => {
						console.log('xixi');
					}}
				></BalanceButton>
			</div>
			<div className="relative flex h-full w-full items-center justify-center overflow-x-hidden">
				<div className="absolute h-full w-full bg-lottery-bg bg-cover"></div>
				<div className="absolute z-10 h-full w-full bg-lottery-top bg-contain bg-no-repeat"></div>
				<div className="relative z-20 flex h-64 w-64 flex-col items-center justify-center rounded-lg">
					{stage === 1 ? (
						<>
							<button
								onClick={() => handleFirstStage('normal')}
								className="mb-2 h-10 w-72 rounded-full bg-custom-yellow-005 px-4 py-2 text-black"
							>
								General Gift
							</button>
							<button
								onClick={() => handleFirstStage('special')}
								className="h-10 w-72 rounded-full bg-custom-yellow-005 px-4 py-2 text-black"
							>
								Specific Gift
							</button>
						</>
					) : (
						<>
							<button
								onClick={handleConfirm}
								className="mb-2 flex h-10 w-72 items-center justify-center gap-4 rounded-full bg-custom-yellow-005 px-4 py-2 text-black"
							>
								<img
									src={
										lotteryType === 'normal'
											? '/img/icon/diamond.png'
											: '/img/icon/coin.png'
									}
									width={30}
									height={30}
								/>
								500
							</button>
							<button
								onClick={handleCancel}
								className="h-10 w-72 rounded-full bg-custom-yellow-005 px-4 py-2 text-black"
							>
								Maybe Later
							</button>
						</>
					)}
				</div>
			</div>
			<MainMenu />
			{selectedReward && showLotteryCard && (
				<LotteryCard
					title={selectedReward.name}
					image={selectedReward.image}
					lotteryType={lotteryType}
					type={selectedReward.type}
					description={
						selectedReward.description ? selectedReward.description : ''
					}
					rating={selectedReward.star}
					onTradeAgain={handleTradeAgain}
					onClose={() => setShowLotteryCard(false)}
				/>
			)}

			<GiftButton />
		</div>
	);
};

export default withAuth(Lottery);
