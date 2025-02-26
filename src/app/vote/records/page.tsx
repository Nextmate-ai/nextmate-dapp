'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import {
	HIPPO_ADDR,
	USDT_CONTRACT,
	VOTE_CONTRACT,
} from '@/app/contracts/address';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import fetchAPI from '@/lib/api';
import moment from 'moment';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import ConfirmPopup from '@/app/_components/ConfirmPopup/CofirmPopup';
import ConnectWalletPop from '@/app/_components/ConnectWalletPop/ConnectWalletPop';
import useFetchVoteRecord from '@/hooks/useFetchVoteRecord';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import CustomConnectButton from '@/app/_components/CustomConnectButton/CustomConnectButton';
import Dialog from '@/app/_components/Dialog/Dialog';
import useTronlinkMethod from '@/hooks/useTronlinkMethod';
import { useFetchSignData } from '@/hooks/useFetchSignData';
import { useFetchWithdraw } from '@/hooks/useFetchWithdraw';
import WaitConfirmDrawer from '@/app/_components/WaitConfirmDrawer/WaitConfirmDrawer';
import MessageBox from '@/app/_components/MessageBox/MessageBox';
import { CHAIN } from '@/app/constants/chains';

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
							<div className="ml-4 h-6 w-40 rounded bg-gray-300"></div>
							<div className="ml-4 h-6 w-40 rounded bg-gray-300"></div>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto w-full max-w-md rounded-lg bg-white px-4 py-2">
				<div className="mb-2 flex items-center justify-between">
					<div className="flex items-end">
						<div className="h-[70px] w-[70px] rounded-full bg-gray-300"></div>
						<div className="ml-[-5px] flex h-[70px] flex-col justify-end gap-2 pb-1">
							<div className="ml-4 h-6 w-40 rounded bg-gray-300"></div>
							<div className="ml-4 h-6 w-40 rounded bg-gray-300"></div>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto w-full max-w-md rounded-lg bg-white px-4 py-2">
				<div className="mb-2 flex items-center justify-between">
					<div className="flex items-end">
						<div className="h-[70px] w-[70px] rounded-full bg-gray-300"></div>
						<div className="ml-[-5px] flex h-[70px] flex-col justify-end gap-2 pb-1">
							<div className="ml-4 h-6 w-40 rounded bg-gray-300"></div>
							<div className="ml-4 h-6 w-40 rounded bg-gray-300"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ClaimRewardContent = ({
	unclaimedTokens,
	onChainSelect,
}: {
	unclaimedTokens: any[];
	onChainSelect: (chain: string) => void;
}) => {
	const [selectedChain, setSelectedChain] = useState<'Solana' | 'Tron' | 'Sui'>(
		'Solana',
	);

	const handleSelectChain = (chain: 'Solana' | 'Tron' | 'Sui') => {
		setSelectedChain(chain);
		onChainSelect(chain);
	};

	return (
		<div className="w-full px-6 pb-8">
			<div className="font-jamjuree text-sm font-medium text-white">
				Choose the currency you wish to claim. Ensure you have a compatible
				wallet connected for a seamless transaction.
			</div>
			<div className="mt-4 flex w-full items-center justify-center gap-4">
				<div
					className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-2 ${selectedChain === 'Solana' ? 'bg-[#6e67f6]/80' : 'bg-[#6e67f6]/30'}`}
					onClick={() => handleSelectChain('Solana')}
				>
					<img className="h-[18px] w-[18px]" src="/img/chain/solana.png" />
					<div className="font-jamjuree text-base font-medium uppercase text-white">
						{unclaimedTokens[0].tokenAmount}
					</div>
				</div>
				<div
					className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-2 ${selectedChain === 'Tron' ? 'bg-[#6e67f6]/80' : 'bg-[#6e67f6]/30'}`}
					onClick={() => handleSelectChain('Tron')}
				>
					<img
						className="relative h-[18px] w-[18px] rounded-[25px]"
						src="/img/logo/sundog.png"
					/>
					<div className="font-jamjuree text-base font-medium uppercase text-white">
						{unclaimedTokens[1].tokenAmount}
					</div>
				</div>
				<div
					className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-2 ${selectedChain === 'Sui' ? 'bg-[#6e67f6]/80' : 'bg-[#6e67f6]/30'}`}
					onClick={() => handleSelectChain('Sui')}
				>
					<img className="h-[18px] w-[18px]" src="/img/logo/hippo.png" />
					<div className="font-jamjuree text-base font-medium uppercase text-white">
						{unclaimedTokens[2].tokenAmount}
					</div>
				</div>
			</div>
		</div>
	);
};

const VoteHistory = () => {
	const router = useRouter();
	const [isDialog, setIsDialog] = useState(false);
	const [walletBtnInfo, setWalletBtnInfo] = useState({
		title: 'Connect Wallet',
		content: 'Please connect your wallet before voting for the memes.',
		btnText: 'Connect Wallet',
	});
	const [isWaitClaim, setIsWaitClaim] = useState(false);
	const [loadingConfirm, setLoadingConfirm] = useState(false);
	const [isConfirmPopup, setIsConfirmPopup] = useState(false);
	const [isWaitConfirmOpen, setIsWaitConfirmOpen] = useState(false);
	const [isConnectWalletPop, setIsConnectWalletPop] = useState(false);
	const [isOpenClaimReward, setIsOpenClaimReward] = useState(false);
	const [feeContent, setFeeContent] = useState('');
	const [selectedClaimChain, setSelectedClaimChain] =
		useState<string>('Solana');

	const dispatch = useAppDispatch();
	const { claimId, fetchVoteClaimData } = useFetchSignData();
	const { fetchClaimTransaction, claimReward } = useTronlinkMethod();
	const {
		voteRecord,
		isLoading,
		unclaimedTokens,
		reload: reloadVoteRecord,
	} = useFetchVoteRecord('');
	const {
		data: withdrawRecord,
		loadingClaim,
		pollWithdrawStatus,
	} = useFetchWithdraw(claimId);
	const wallet = useSelector((state: RootState) => state.wallet);
	const { showToast } = useToastContext();

	// 领取奖励成功弹窗
	useEffect(() => {
		if (isWaitClaim && !loadingClaim) {
			setIsWaitConfirmOpen(false);
			setIsDialog(true);
			reloadVoteRecord();
			setIsWaitClaim(false);
		}
	}, [isWaitClaim, loadingClaim]);

	// vote token类型
	const tokenLogo = (tokenAddress: string) => {
		switch (tokenAddress) {
			case 'SOL':
				return '/img/chain/solana.png';
			case HIPPO_ADDR:
				return '/img/logo/hippo.png';
			default:
				return '/img/logo/sundog.png';
		}
	};

	/**
	 * 领取奖励
	 * @param record 投票记录
	 */
	const handleClaimUsdt = async () => {
		// 未连接钱包
		if (!wallet.address) {
			setWalletBtnInfo({
				title: 'Connect Wallet',
				content: 'Please connect your wallet before voting for the memes.',
				btnText: 'Connect Wallet',
			});
			setIsConnectWalletPop(true);
			return;
		}
		console.log(178, wallet.chain.name, selectedClaimChain);
		// 钱包链与选择链不一致
		if (wallet.chain.name !== selectedClaimChain) {
			setWalletBtnInfo({
				title: 'Switch Wallet',
				content:
					'Please switch to the wallet used for voting to claim the rewards.',
				btnText: 'Switch Wallet',
			});
			setIsConnectWalletPop(true);
			return;
		}

		if (loadingClaim || loadingConfirm) {
			return;
		}

		if (selectedClaimChain === 'Solana') {
			setLoadingConfirm(true);
			const claimData = await fetchVoteClaimData(
				unclaimedTokens[0].tokenAddress,
			);
			if (!claimData) {
				setLoadingConfirm(false);
				return;
			}
			pollWithdrawStatus(claimId);
			setIsConfirmPopup(false);
			setIsWaitClaim(true);
			setLoadingConfirm(false);
			setTimeout(() => {
				setIsWaitConfirmOpen(true);
			}, 2000);
			return;
		} else if (selectedClaimChain === 'Sui') {
			setLoadingConfirm(true);
			const claimData = await fetchVoteClaimData(
				unclaimedTokens[2].tokenAddress,
			);
			if (!claimData) {
				setLoadingConfirm(false);
				return;
			}
			pollWithdrawStatus(claimId);
			setIsConfirmPopup(false);
			setIsWaitClaim(true);
			setLoadingConfirm(false);
			setTimeout(() => {
				setIsWaitConfirmOpen(true);
			}, 2000);
			return;
		}
		// sundog
		const claimData = await fetchVoteClaimData(unclaimedTokens[1].tokenAddress);
		if (!claimData) {
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
		setLoadingConfirm(false);
		setIsConfirmPopup(true);
	};

	const handleConfirm = async () => {
		if (loadingClaim) {
			return;
		}

		claimReward();
		pollWithdrawStatus(claimId);
		setIsConfirmPopup(false);
		setIsWaitClaim(true);
		setTimeout(() => {
			setIsWaitConfirmOpen(true);
		}, 2000);
	};

	const clickBack = () => {
		router.back();
	};

	return (
		<div className="h-full w-full bg-bg-purple bg-cover p-3 pb-7 text-white">
			<div className="mt-1 flex items-center justify-between overflow-hidden">
				<div className="flex items-center">
					<ChevronLeft onClick={clickBack} />
					<span className="ml-4">Records</span>
				</div>
				<div className="ml-3 w-60">
					<CustomConnectButton />
				</div>
			</div>
			<div className="relative mt-3">
				<img
					src="/img/bg-record-border.png"
					className="absolute h-[calc(100vh-96px)] w-full"
				/>
				{isLoading ? (
					<VoteCardSkeleton />
				) : (
					<div className="no-scrollbar relative h-[calc(100vh-104px)] overflow-y-auto px-3">
						<div className="my-4 flex w-full items-center justify-between rounded-xl bg-[#6e67f6]/30 px-3 py-2">
							<div className="flex flex-col items-start justify-start gap-1">
								<div className="font-jamjuree text-xs text-white">
									Unclaimed
								</div>
								<div className="flex items-center justify-start gap-3">
									{/* sol */}
									<div className="flex items-center justify-center gap-1">
										<img
											src="/img/chain/solana.png"
											alt="coin"
											className="w-4"
										/>
										<div className="font-jamjuree text-base font-medium uppercase text-white">
											{unclaimedTokens[0].tokenAmount}
										</div>
									</div>
									{/* sundog */}
									<div className="flex items-center justify-center gap-1">
										<img
											src="/img/logo/sundog.png"
											alt="coin"
											className="w-4"
										/>
										<div className="font-jamjuree text-base font-medium uppercase text-white">
											{unclaimedTokens[1].tokenAmount}
										</div>
									</div>
									{/* hippo */}
									<div className="flex items-center justify-center gap-1">
										<img src="/img/logo/hippo.png" alt="coin" className="w-4" />
										<div className="font-jamjuree text-base font-medium uppercase text-white">
											{unclaimedTokens[2].tokenAmount}
										</div>
									</div>
								</div>
							</div>

							<div
								className="relative flex items-center"
								onClick={() => {
									setIsOpenClaimReward(true);
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="105"
									height="25"
									viewBox="0 0 105 25"
									fill="none"
								>
									<path
										d="M0 1.52926L6.69483 0H17.8529H93.1698H99.3067H104.886V2.19415V22.141V23.5705L99.3067 25H88.1487H17.295H5.85798H0V22.0745V3.19149V1.52926Z"
										fill="#F2BC1A"
									/>
								</svg>
								<div className="font-Chakra absolute top-1/2 w-full -translate-y-1/2 text-center text-sm font-semibold uppercase tracking-wide text-white">
									Claim All
								</div>
								{loadingClaim && (
									<LoaderCircle
										className="absolute right-[2%] top-[5%] w-4 animate-spin"
										color="white"
									/>
								)}
							</div>
						</div>
						{voteRecord.map((item, index) => (
							<div
								className="flex justify-between border-b border-white/10 py-2"
								key={item.id}
							>
								<div className="flex items-center justify-center">
									<img
										className="h-12 w-12 rounded-full"
										src={`/img/vote/${item.tokenSymbol.toLowerCase()}.png`}
									/>
									<div className="ml-2">
										<div className="flex items-center justify-start gap-1">
											<div className="font-jamjuree text-base font-medium">
												{item.tokenName}
											</div>
											<div className="h-0.5 w-0.5 rounded-full bg-white/50" />
											<div
												className={`font-jamjuree text-base font-medium ${
													item.canClaimReward
														? 'text-[#ffe715]'
														: 'text-[#FF6761]'
												}`}
											>
												{item.canClaimReward ? 'Win' : 'Lose'}
											</div>
										</div>
										<span className="font-jamjuree text-xs font-normal text-white/80">
											{moment(item.timestamp).format(dateFormat)}
										</span>
										<div className="font-jamjuree text-xs font-normal text-[#aca8ff]">
											Wallet: {item.walletAddress.slice(0, 4)}......
											{item.walletAddress.slice(-4)}
										</div>
									</div>
								</div>
								<div className="flex items-center justify-center gap-2">
									<div className="flex flex-col items-end justify-end">
										<div className="flex items-center justify-end gap-2">
											{item.profitAmount != 0 && (
												<div
													className={`flex items-center justify-center gap-1 text-right font-jamjuree text-sm font-medium ${
														item.canClaimReward
															? 'text-[#ffe715]'
															: 'text-[#ff6761]'
													}`}
												>
													+{item.profitAmount}{' '}
													<img
														src={tokenLogo(item.placeTokenAddress)}
														alt="coin"
														className="w-3"
													/>
												</div>
											)}
											<div className="flex items-center justify-end gap-1">
												<div className="font-jamjuree text-xs font-normal text-[#ffe715]">
													+{item.rewardGold}
												</div>
												<img
													src="/img/icon/coin.svg"
													alt="coin"
													className="h-3 w-3"
												/>
											</div>
										</div>
										<div
											className={`my-0.5 flex items-center justify-center gap-1 text-right font-jamjuree text-xs font-normal ${
												item.canClaimReward
													? 'text-[#ffe715]'
													: 'text-[#ff6761]'
											}`}
										>
											{item.netPlaceTokenAmount}{' '}
											<img
												src={tokenLogo(item.placeTokenAddress)}
												alt="coin"
												className="w-3"
											/>{' '}
											Vote
										</div>
										{item.canClaimReward && !item.claimed && (
											<div className="float-right flex w-[86px] justify-center gap-2.5 rounded-xl border border-[#6e67f6] px-3 py-0.5">
												<div className="font-jamjuree text-xs font-normal text-white">
													Unclaimed
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
			<ConnectWalletPop
				isOpen={isConnectWalletPop}
				title={walletBtnInfo.title}
				content={walletBtnInfo.content}
				btnText={walletBtnInfo.btnText}
				onClose={() => {
					setIsConnectWalletPop(false);
				}}
			/>

			<MessageBox
				isOpen={isOpenClaimReward}
				onClose={() => setIsOpenClaimReward(false)}
				title="Select A Currency"
				content={
					<ClaimRewardContent
						unclaimedTokens={unclaimedTokens}
						onChainSelect={chain => setSelectedClaimChain(chain)}
					/>
				}
				confirmText="Claim"
				onConfirm={() => {
					handleClaimUsdt();
				}}
			/>

			<ConfirmPopup
				isOpen={isConfirmPopup}
				title="Claim Reward"
				loading={loadingConfirm}
				content="Please confirm the transaction"
				feeContent={feeContent}
				handleConfirm={handleConfirm}
				onClose={() => {
					setIsConfirmPopup(false);
				}}
			/>

			<WaitConfirmDrawer
				title="Claiming Reward"
				image="/img/collect-money.gif"
				content="On-Chain Confirming (2 min)"
				isOpen={isWaitConfirmOpen}
				json={null}
				scale={1}
				onClose={() => setIsWaitConfirmOpen(false)}
			/>

			<Dialog
				isOpen={isDialog}
				content="Claimed"
				onClose={() => {
					setIsDialog(false);
				}}
			/>
		</div>
	);
};

export default withAuth(VoteHistory);
