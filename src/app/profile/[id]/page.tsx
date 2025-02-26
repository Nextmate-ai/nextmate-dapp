'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
	CalendarDays,
	LoaderCircle,
	PersonStanding,
	UserRoundPlus,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import InviteDrawer from '@/app/_components/InviteDrawer/InviteDrawer';
import SignInDrawer from '@/app/_components/SignInDrawer/SignInDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import MainMenu from '@/app/_components/MainMenu/MainMenu';
import { GiftButton } from '@/app/_components/GiftButton/GiftButton';
import AddTokenDrawer from '@/app/_components/AddTokenDrawer/AddTokenDrawer';
import WithdrawResultPop from '@/app/_components/WithdrawResultPop/WithdrawResultPop';
import CustomConnectButton from '@/app/_components/CustomConnectButton/CustomConnectButton';
import PreloadImages from '@/app/_components/PreloadImages/PreloadImags';
import WaitConfirmDrawer from '@/app/_components/WaitConfirmDrawer/WaitConfirmDrawer';
import { useUserBalance } from '@/hooks/useBalance';
import { useInviteRecord } from '@/hooks/useInviteRecord';
import './page.css';
import { useFetchInviteTask } from '@/hooks/useFetchInviteTask';
import { useFetchUsdtRecord } from '@/hooks/useFetchUsdtRecord';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import useOkxMethods from '@/hooks/useOkxMethod';
import { useInviteRank } from '@/hooks/useInviteRank';
import { usePreloadImage } from '@/hooks/usePreloadImage';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { CHAIN } from '@/app/constants/chains';
import ConfirmPopup from '@/app/_components/ConfirmPopup/CofirmPopup';
import Dialog from '@/app/_components/Dialog/Dialog';
import { useFetchSignData } from '@/hooks/useFetchSignData';
import useTronlinkMethod from '@/hooks/useTronlinkMethod';
import { useFetchWithdraw } from '@/hooks/useFetchWithdraw';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';
import {
	BASE_USDT_ADDR,
	BASE_VAULT_CONTRACT,
	SOLANA_USDT_ADDR,
	TRON_USDT_ADDR,
} from '@/app/contracts/address';
import { encodeFunctionData } from 'viem';
import DailyTask from './dailyTask';
import OneTimeTask from './oneTimeTask';
import LimitedTask from './limitedTask';
import MessageBox from '@/app/_components/MessageBox/MessageBox';

const voteMessage = () => {
	return (
		<div className="relative mb-8 flex w-full flex-col items-start justify-start px-6">
			<div className="font-jamjuree text-sm font-normal text-white/90">
				Please participate in the prediction market at{' '}
				<a
					className="text-white underline"
					href="https://nextmate.ai/predictionMarket"
					target="_blank"
				>
					https://nextmate.ai/predictionMarket
				</a>{' '}
				with at least 100 USD to be eligible for withdrawal.
			</div>
		</div>
	);
};

const MinePage = () => {
	const [isWaitConfirmOpen, setIsWaitConfirmOpen] = useState(false);
	const router = useRouter();
	const [images, setImages] = useState([
		'/img/bg-invite.png',
		'/img/bg-invite-tips.png',
		'/img/bg-popup.png',
		'/img/icon/up-arrow.svg',
		'/img/history-border.png',
		'/img/invite-record-no-data.png',
	]);
	const [showTopUpModal, setShowTopUpModal] = useState(false);
	const [signData, setSignData] = useState<any>(null);
	const [isConfirmPopup, setIsConfirmPopup] = useState(false);
	const [isDialog, setIsDialog] = useState(false);
	const [isWaitClaim, setIsWaitClaim] = useState(false);
	const [loadingConfirm, setLoadingConfirm] = useState(false);
	const [loadingWithdraw, setLoadingWithdraw] = useState(false);
	const [hashcode, setHashcode] = useState<string | undefined>();
	const [isWithdrawResultPop, setIsWithdrawResultPop] = useState(false);
	const [feeContent, setFeeContent] = useState('');
	const [isClickTopup, setIsClickTopup] = useState(false);
	const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
	const { data: balanceData, reload: reloadBalance } = useUserBalance();

	const { inviteRecordData, total } = useInviteRecord();
	const { data: inviteTaskData, reload: reloadInviteTask } =
		useFetchInviteTask();
	const { data: usdtRecordData, reload: reloadUsdtRecord } =
		useFetchUsdtRecord();
	const { showToast } = useToastContext();
	const { data: inviteRankData } = useInviteRank();
	const { claimId, notEnoughVoteAmount, fetchClaimData } = useFetchSignData();
	const { fetchClaimTransaction, claimReward } = useTronlinkMethod();
	const {
		data: withdrawRecord,
		loadingClaim,
		pollWithdrawStatus,
	} = useFetchWithdraw(claimId);

	const { isLoadingImage, preloadImages } = usePreloadImage(images);
	const { showRouterLoading } = useRouterLoadingContext();

	const { sendTransaction } = useOkxMethods();

	const wallet = useSelector((state: RootState) => state.wallet);

	const [taskTab, setTaskTab] = useState([
		{
			name: 'Limited Time',
			content: <LimitedTask />,
			active: true,
		},
		{
			name: 'Daily',
			content: <DailyTask />,
			active: false,
		},
		{
			name: 'One Time',
			content: <OneTimeTask />,
			active: false,
		},
	]);

	// 添加切换tab的处理函数
	const handleTabClick = (index: number) => {
		setTaskTab(prev =>
			prev.map((tab, i) => ({
				...tab,
				active: i === index,
			})),
		);
	};

	const clickTopUp = () => {
		setShowTopUpModal(true);
		setIsClickTopup(true);
	};

	// 领取奖励成功弹窗 （tron专用）
	useEffect(() => {
		if (isWaitClaim && !loadingClaim) {
			setIsWaitConfirmOpen(false);
			if (withdrawRecord?.claimed) {
				setIsDialog(true);
				reloadBalance();
			}
			setIsWaitClaim(false);
		}
	}, [isWaitClaim, loadingClaim]);

	// 提现 vault
	const handleWithdraw = async () => {
		setIsClickTopup(false);
		if (!wallet.address) {
			showToast('Please connect your wallet', 'info');
			return;
		}

		if (loadingClaim) {
			return;
		}
		// tron 提现
		if (wallet.chain?.name === CHAIN.TRON.name) {
			const claimData = await fetchClaimData(TRON_USDT_ADDR);
			setSignData(claimData);
			if (!claimData) {
				setSignData(null);
				setLoadingConfirm(false);
				return;
			}

			await fetchClaimTransaction(
				claimData?.claimId,
				claimData?.tokenAmount,
				claimData?.tokenAddress,
				claimData?.expireTimestamp,
				claimData?.signature,
			);
		} else if (wallet.chain?.name === CHAIN.BASE.name) {
			// base 提现
			const claimData = await fetchClaimData(BASE_USDT_ADDR.toLowerCase());
			if (notEnoughVoteAmount) {
				setIsMessageBoxOpen(true);
				return;
			}
			setSignData(claimData);
			if (!claimData) {
				setSignData(null);
				setLoadingConfirm(false);
				return;
			}
		}
		setIsConfirmPopup(true);
	};

	const handleConfirm = async () => {
		if (loadingClaim) {
			return;
		}
		// 防止重复点击
		setLoadingConfirm(true);
		// tron 提现
		if (wallet.chain?.name === CHAIN.TRON.name) {
			if (!claimId) {
				return;
			}
			claimReward();
			pollWithdrawStatus(claimId);
			setIsConfirmPopup(false);
			setIsWaitClaim(true);
			setLoadingConfirm(false);
			setTimeout(() => {
				setIsWaitConfirmOpen(true);
			}, 2000);
		} else if (wallet.chain?.name === CHAIN.BASE.name) {
			// base 提现
			setLoadingWithdraw(true);
			try {
				const withdrawUsdcData = encodeFunctionData({
					abi: BASE_VAULT_CONTRACT.abi,
					functionName: 'claim',
					args: [
						signData?.claimId,
						signData?.tokenAddress,
						signData?.tokenAmount,
						signData?.expireTimestamp,
						signData?.signature,
					],
				});

				setTimeout(() => {
					setIsConfirmPopup(false);
					setIsWaitConfirmOpen(true);
				}, 2000);

				const res = await sendTransaction({
					to: BASE_VAULT_CONTRACT.address,
					from: wallet.address,
					value: '0x0',
					data: withdrawUsdcData,
				});
				console.log(190, res);
				setIsWaitConfirmOpen(false);
				setLoadingConfirm(false);
				setTimeout(() => {
					setIsDialog(true);
					reloadBalance();
					setLoadingWithdraw(false);
				}, 5000);
			} catch (error) {
				console.log(327, error);
				showToast('error', error.message);
				setLoadingWithdraw(false);
			}
		} else if (wallet.chain?.name === CHAIN.SOLANA.name) {
			// solana 提现
			setTimeout(() => {
				setIsConfirmPopup(false);
				setIsWaitConfirmOpen(true);
			}, 2000);

			const claimData = await fetchClaimData(SOLANA_USDT_ADDR);
			setSignData(claimData);
			if (!claimData) {
				setSignData(null);
				setLoadingConfirm(false);
				return;
			}
			setLoadingConfirm(false);
			pollWithdrawStatus(claimData?.claimId);
			setIsConfirmPopup(false);
			setIsWaitClaim(true);
			setIsWaitConfirmOpen(true);
		}
	};

	return (
		<div className="flex h-screen w-full translate-y-0 transform flex-col bg-bg-profile bg-cover transition-transform duration-300">
			<div className="no-scrollbar mt-3 flex-grow overflow-x-hidden overflow-y-scroll px-3">
				<div className="relative flex w-full flex-col items-stretch">
					{/* 内容 */}
					<div className="relative z-10 flex w-full flex-col">
						{/* wallet */}
						<div className="flex w-full flex-col items-end justify-end">
							<div className="w-full">
								<CustomConnectButton
									bgColor="#6E67F680"
									text="Connect Wallet"
									textColor="#FFF"
									isShowIcon={true}
								/>
							</div>
							{/* 余额区域 */}
							<div className="relative mt-5 flex w-full">
								<img
									src="/img/profile-top.png"
									alt="profile"
									className="w-full"
								/>
								<div className="absolute left-0 top-0 flex h-full w-full items-center justify-between">
									<div className="flex w-[38%] flex-col items-center justify-between">
										<div className="relative h-[70px] w-full">
											{/* history */}
											<Link
												href={'/topup/history'}
												onClick={() => showRouterLoading('/topup/history')}
												className="absolute -right-2 -top-4 z-10 mr-2 mt-5 flex h-8 w-8 items-center justify-center rounded-2xl p-2"
											>
												<img
													src="/img/icon/token-history.svg"
													alt="history"
													className="w-3"
												/>
											</Link>

											<div className="relative pt-[15px] text-center">
												<img
													className="m-auto h-6 w-6"
													src="/img/icon/coin.svg"
													alt=""
												/>
												<div className="mt-1 font-jamjuree text-lg font-semibold uppercase text-white">
													{balanceData?.gold || 0}
												</div>
											</div>
										</div>
										<div
											className="relative flex h-8 items-center justify-center"
											onClick={clickTopUp}
										>
											<span className="relative align-middle text-sm text-white">
												TOP UP
											</span>
										</div>
									</div>
									{/* <img className="h-24 w-24" src="/img/profile-mascot.png" /> */}
									<div className="flex w-[38%] flex-col items-center justify-between">
										<div className="relative h-[70px] w-full">
											{/* history */}
											<Link
												href={'/withdraw/usdt'}
												onClick={() => showRouterLoading('/withdraw/usdt')}
												className="absolute -right-2 -top-4 z-10 mr-2 mt-5 flex h-8 w-8 items-center justify-center rounded-2xl p-2"
											>
												<img
													src="/img/icon/token-history.svg"
													alt="history"
													className="w-3"
												/>
											</Link>

											<div className="relative pt-[15px] text-center">
												<img
													className="m-auto h-6 w-6"
													src="/img/USDT.png"
													alt=""
												/>
												<div className="mt-1 font-jamjuree text-lg font-semibold uppercase text-white">
													{balanceData?.usdt || 0}
												</div>
											</div>
										</div>
										<div
											className="relative flex h-8 items-center justify-center"
											onClick={handleWithdraw}
										>
											<span className="relative align-middle text-sm text-white">
												WITHDRAW
											</span>
											{(loadingWithdraw || loadingClaim) && (
												<LoaderCircle
													className="absolute -right-[25%] bottom-[15%] w-4 animate-spin"
													color="white"
												/>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="relative mt-5 w-full">
						<p className="w-full px-3 text-center font-jamjuree text-lg font-bold uppercase tracking-widest text-white">
							Get More Tokens
						</p>
						<div className="no-scrollbar mt-2 h-[calc(100vh-345px)] w-full overflow-y-auto">
							<div className="flex w-full items-center justify-center gap-3">
								{taskTab.map((item, index) => (
									<div
										className="inline-flex flex-col items-center justify-center gap-1.5 rounded-md px-3 py-1.5"
										key={index}
										onClick={() => handleTabClick(index)}
									>
										<div
											className={`font-jamjuree text-xs font-semibold text-white ${
												item.active
													? 'text-white underline underline-offset-4'
													: 'text-white/80'
											}`}
										>
											{item.name}
										</div>
									</div>
								))}
							</div>
							{/* 展示当前激活的tab内容 */}
							<div className="mt-4">
								{taskTab.find(tab => tab.active)?.content}
							</div>
						</div>
					</div>
				</div>
			</div>
			<MainMenu />
			<GiftButton />
			{/* 充值 */}
			<AddTokenDrawer
				isOpen={showTopUpModal}
				walletAddress={wallet?.address}
				walletType={wallet.chain?.name}
				onClose={() => setShowTopUpModal(false)}
				onOpenConfirm={() => setIsWaitConfirmOpen(true)}
			/>

			{/* 提现结果 hashcode */}
			<WithdrawResultPop
				isOpen={isWithdrawResultPop}
				hashcode={hashcode}
				onClose={() => setIsWithdrawResultPop(false)}
			/>
			{/* 提现确认弹窗 */}
			<ConfirmPopup
				isOpen={isConfirmPopup}
				title="Withdraw"
				loading={loadingConfirm}
				content="Please confirm the transaction"
				feeContent={feeContent}
				handleConfirm={() => {
					handleConfirm();
				}}
				onClose={() => {
					setIsConfirmPopup(false);
				}}
			/>
			{/* 提现等待 */}
			<WaitConfirmDrawer
				title={isClickTopup ? 'Top up Processing' : 'Withdrawal Processing'}
				image="/img/collect-money.gif"
				content="On-Chain Confirming (2 min)"
				isOpen={isWaitConfirmOpen}
				json={null}
				scale={1}
				onClose={() => setIsWaitConfirmOpen(false)}
			/>
			{/* 提现成功 */}
			<Dialog
				isOpen={isDialog}
				content="Claimed"
				onClose={() => {
					setIsDialog(false);
				}}
			/>
			{/* 投票不足，提示到官网vote */}

			<MessageBox
				isOpen={isMessageBoxOpen}
				onClose={() => setIsMessageBoxOpen(false)}
				title="Conditions"
				content={voteMessage()}
				confirmText="Vote"
				onConfirm={() => {
					window.open('https://nextmate.ai/', '_blank');
				}}
			/>
			{/* 预加载 profile 的图片 */}
			<PreloadImages loading={isLoadingImage} preloadImages={preloadImages} />
		</div>
	);
};

export default withAuth(MinePage);
