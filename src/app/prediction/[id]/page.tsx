'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import {
	HIPPO_ADDR,
	SOLANA_VOTE_ADDR,
	SUI_VOTE_ADDR,
	SUNDOG_ADDR,
	TRON_VOTE_ADDR,
} from '@/app/contracts/address';
import StakeAmountPop from '@/app/_components/StakeAmountPop/StakeAmountPop';
import PredictionResults from '@/app/_components/PredictionResults/PredictionResults';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { maxUint256, parseUnits } from 'viem';
import useFetchAllowance from '@/hooks/useFetchAllowance';
import ApprovePop from '@/app/_components/ApprovePop/ApprovePop';
import useFetchRoundInfo from '@/hooks/useFetchRoundInfo';
import ConnectWalletPop from '@/app/_components/ConnectWalletPop/ConnectWalletPop';
import useFetchVoteRecord from '@/hooks/useFetchVoteRecord';
import fetchAPI from '@/lib/api';
import useFetchTrxBalance from '@/hooks/useFetchTrxBalance';
import { debounce, throttle } from 'lodash';
import voteConfirmJson from '@/assets/animation/vote-confirm.json';
import WaitConfirmDrawer from '@/app/_components/WaitConfirmDrawer/WaitConfirmDrawer';
import './page.css';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import useTronlinkMethods from '@/hooks/useTronlinkMethod';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { formatDecimal } from '@/assets/utils';
import { CHAIN } from '@/app/constants/chains';
import useSolana from '@/hooks/useSolanaTransaction';
import useFetchSolBalance from '@/hooks/useFetchSolBalance';
import ConfirmPopup from '@/app/_components/ConfirmPopup/CofirmPopup';
import useSuiTransaction from '@/hooks/useSuiTransaction';
import useFetchSuiBalance from '@/hooks/useFetchSuiBalance';

const Prediction = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [timeLeft, setTimeLeft] = useState(60);
	const [voteId, setVoteId] = useState('');
	const [memeName, setMemeName] = useState('');
	const [memeSymbol, setMemeSymbol] = useState('');
	const [showResult, setShowResult] = useState(false);
	const [tokenAddress, setTokenAddress] = useState('');
	const [tokenDecimals, setTokenDecimals] = useState<number>(0);
	const [voteStatus, setVoteStatus] = useState(false);
	const [voteLoading, setVoteLoading] = useState(false);
	const [isApprovePop, setIsApprovePop] = useState(false);
	const [isConnectWalletPop, setIsConnectWalletPop] = useState(false);
	const [isWaitConfirmOpen, setIsWaitConfirmOpen] = useState(false);
	const [isStakeAmountPop, setIsStakeAmountPop] = useState(false);
	const [resetAmount, setResetAmount] = useState(false);
	const [tokenData, setTokenData] = useState<any>({});
	const [amount, setAmount] = useState('');
	const [isConfirmPopup, setIsConfirmPopup] = useState(false);
	const [loadingConfirm, setLoadingConfirm] = useState(false);
	const wallet = useSelector((state: RootState) => state.wallet);
	const { loading: walletConnecting } = useConnectWallet();

	const { balance, loading, error, fetchBalance } = useFetchTrxBalance();
	const {
		roundInfo,
		isLoading: roundInfoLoading,
		error: roundInfoError,
	} = useFetchRoundInfo();

	const { approve, transfer } = useTronlinkMethods();
	const { fetchTransferData, sendTransaction: suiSendTransaction } =
		useSuiTransaction();
	const { fetchTransferWithMemoData, sendTransaction } = useSolana();
	const { balance: solanaBalance, fetchBalance: fetchSolanaBalance } =
		useFetchSolBalance();
	const { balance: suiBalance, fetchBalance: fetchSuiBalance } =
		useFetchSuiBalance();
	const {
		allowance,
		balance: tokenBalance,
		loading: allowanceLoading,
		hasBaseAllowance,
	} = useFetchAllowance({
		chainType: 'tron',
		tokenAddress: SUNDOG_ADDR,
		contractAddress: TRON_VOTE_ADDR,
	});

	const { latestVoteRecord, pollVoteRecord } = useFetchVoteRecord(tokenAddress);

	const searchParams = useSearchParams();
	const { showToast } = useToastContext();

	// 获取最新投票记录,展示结果
	useEffect(() => {
		if (latestVoteRecord.roundId) {
			console.log('latestVoteRecord...', latestVoteRecord);
			setIsWaitConfirmOpen(false);
			setTimeout(() => {
				setShowResult(true);
			}, 1000);
		}
	}, [latestVoteRecord, latestVoteRecord.roundId]);

	// 初始化token数据
	useEffect(() => {
		let data = {} as any;
		const dataFromUrl = searchParams.get('data');
		if (dataFromUrl) {
			data = JSON.parse(dataFromUrl);
		}
		setMemeName(data.name);
		// todo 去除dgtron的处理
		if (data.symbol === 'dgtron') {
			setMemeSymbol('dragon');
		} else {
			setMemeSymbol(data.symbol);
		}
		setTokenAddress(data.address);
		setTokenDecimals(+data.decimals);
	}, [searchParams]);

	// 获取token价格
	useEffect(() => {
		async function getTokenPrice() {
			const res = await fetchAPI(
				`/api/token/priceAndRatio?address=${tokenAddress}`,
			);
			setTokenData(res.data);
		}
		getTokenPrice();
		const interval = setInterval(() => {
			getTokenPrice();
		}, 10000);
		return () => {
			clearInterval(interval);
		};
	}, [tokenAddress]);

	const calculateTimeLeft = useCallback(() => {
		if (!roundInfo.roundEndTimestamp) return 60; // 如果没有 roundEndTimestamp，返回 60 秒
		const now = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
		const diff = roundInfo.roundEndTimestamp - now;
		return diff > 0 ? diff : 60; // 如果时间到了，返回 60 秒
	}, [roundInfo.roundEndTimestamp]);

	// 计算倒计时
	useEffect(() => {
		setTimeLeft(calculateTimeLeft());

		const timer = setInterval(() => {
			setTimeLeft(prevTime => {
				if (prevTime <= 1) {
					console.log('倒计时结束，重新开始60秒倒计时');
					return 60; // 重置为60秒
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [roundInfo.roundEndTimestamp, calculateTimeLeft]);

	// useEffect(() => {
	// 	if (wallet.address) {
	// 		const approveAmount = maxUint256;
	// 		fetchApproveTransaction(SUNDOG_ADDR, TRON_VOTE_ADDR, approveAmount);
	// 	}
	// }, [wallet.address]);

	/**
	 * 获取投票ID
	 * @param stakeAmount 投票金额
	 * @param placeVoteTokenAddress 投票token地址
	 * @returns 投票ID
	 */
	const fetchVoteId = async (
		stakeAmount: string,
		placeVoteTokenAddress: string,
	) => {
		try {
			const actionIdRes = await fetchAPI('/api/vote/place', {
				method: 'POST',
				body: {
					voteTokenAddress: tokenAddress,
					isVoteUp: voteStatus,
					msgSender: wallet.address,
					placeTokenAddress: placeVoteTokenAddress,
					placeTokenAmount: stakeAmount,
				},
			});
			if (actionIdRes.success) {
				setVoteId(actionIdRes.data.voteId);
				console.log(10, actionIdRes.data.voteId);
				return actionIdRes.data.voteId;
			} else {
				showToast(actionIdRes.data.message, 'info');
				console.log(100, 'setVoteId is empty');
				return '';
			}
		} catch (error) {
			console.error('fetchActionId error', error);
			return '';
		}
	};

	/**
	 * 投票
	 * @param status 投票状态 true: 投票 up, false: 投票 down
	 */
	const handleVote = (status: boolean) => {
		// 如果钱包没有连接，则提示用户连接钱包
		if (!wallet.address) {
			setIsConnectWalletPop(true);
			return;
		}
		// 如果投票的不是Sundog，则提示用户投票Sundog可以参与投票赚取奖励
		if (wallet.chain.name === CHAIN.TRON.name && tokenAddress !== SUNDOG_ADDR) {
			showToast(
				'Good news! Voting Sundog can participate in our Vote to Earn campaign.',
				'info',
			);
			return;
		}
		// if (!hasBaseAllowance) {
		// 	setIsApprovePop(true);
		// 	return;
		// }
		setVoteStatus(status);
		setIsStakeAmountPop(true);
	};

	/**
	 * 投票
	 * @param amount 投票金额
	 */
	const handleStake = async (amount: string) => {
		if (voteLoading) return;
		setVoteLoading(true);
		let initVoteId = '';
		if (wallet.chain.name === CHAIN.SUI.name) {
			const stakeAmount = parseUnits(amount, 9);
			initVoteId = await fetchVoteId(stakeAmount.toString(), HIPPO_ADDR);
		} else if (wallet.chain.name === CHAIN.SOLANA.name) {
			const stakeAmount = parseUnits(amount, 9);
			initVoteId = await fetchVoteId(stakeAmount.toString(), 'SOL');
		} else {
			const stakeAmount = parseUnits(amount, 18);
			initVoteId = await fetchVoteId(stakeAmount.toString(), SUNDOG_ADDR);
		}
		console.log(205, initVoteId);
		setVoteLoading(false);
		if (!initVoteId) {
			showToast('Vote failed', 'info');
			return;
		}
		// 检查授权额度
		// const amountBigInt = parseUnits(amount, 18);
		// if (amountBigInt > allowance) {
		// 	showToast('Insufficient allowance', 'info');
		// 	setIsStakeAmountPop(false);
		// 	setResetAmount(!resetAmount);
		// 	setIsApprovePop(true);
		// 	return;
		// }

		console.log('stakeMeme---------', amount);
		// placeVoteWithERC20();
		const memo = JSON.stringify({
			action: 'placeVote',
			payload: {
				voteId: initVoteId,
			},
		});
		// 根据钱包链类型选择投票方式
		if (wallet.chain.name === CHAIN.TRON.name) {
			setAmount(amount);
			setIsConfirmPopup(true);
		} else if (wallet.chain.name === CHAIN.SOLANA.name) {
			console.log(265, wallet.address, SOLANA_VOTE_ADDR, amount);
			try {
				if (solanaBalance <= 0) {
					showToast('Insufficient Sol balance', 'info');
					return;
				}
				const stakeAmount = parseUnits(amount, 9);
				const transaction = await fetchTransferWithMemoData(
					memo,
					stakeAmount,
					SOLANA_VOTE_ADDR,
				);
				setIsStakeAmountPop(false);
				const tx = await sendTransaction(transaction);
				if (tx) {
					console.log(327, tx, voteId, initVoteId);

					fetchBalance();
					setResetAmount(!resetAmount);
					pollVoteRecord(roundInfo.roundId, initVoteId);
					return;
				}
			} catch (error) {
				console.log(327, error);
				return;
			}
		} else if (wallet.chain.name === CHAIN.SUI.name) {
			try {
				if (suiBalance <= 0) {
					showToast('Insufficient Sui balance', 'info');
					return;
				}
				const stakeAmount = parseUnits(amount, 9);
				const transaction = await fetchTransferData(
					stakeAmount,
					HIPPO_ADDR,
					SUI_VOTE_ADDR,
				);
				setIsStakeAmountPop(false);
				const tx = await suiSendTransaction(transaction);
				if (tx) {
					console.log(337, tx, voteId, initVoteId);

					fetchBalance();
					setResetAmount(!resetAmount);
					pollVoteRecord(roundInfo.roundId, initVoteId);
					return;
				}
			} catch (error) {
				console.log(327, error);
				return;
			}
		}
	};
	// sundog 投票确认
	const handleConfirm = () => {
		const memo = JSON.stringify({
			action: 'placeVote',
			payload: {
				voteId: voteId,
			},
		});
		const stakeAmount = parseUnits(amount, 18);
		transfer(
			memo,
			stakeAmount.toString(),
			'SUNDOG',
			SUNDOG_ADDR,
			TRON_VOTE_ADDR,
		);

		setTimeout(() => {
			fetchBalance();
			pollVoteRecord(roundInfo.roundId, voteId);
			setResetAmount(!resetAmount);
		}, 1000);

		setTimeout(() => {
			setIsWaitConfirmOpen(true);
		}, 3000);
	};

	/**
	 * 计算投票百分比
	 * @param voteUpCount 投票 up 数量
	 * @param voteDownCount 投票 down 数量
	 * @param isVoteUp 投票状态 true: up, false: down
	 * @returns 投票百分比
	 */
	const calculateVotePercentage = (
		voteUpCount: number,
		voteDownCount: number,
		isVoteUp: boolean,
	): string => {
		const totalVotes = voteUpCount + voteDownCount;
		if (totalVotes === 0) return '0';
		return isVoteUp
			? ((voteUpCount / totalVotes) * 100).toFixed(0)
			: ((voteDownCount / totalVotes) * 100).toFixed(0);
	};

	// 输入金额发生变化的时候重新生成数据
	const amountChange = async (amount: string) => {};

	// vote token类型
	const voteTokenType = () => {
		switch (wallet.chain?.name) {
			case CHAIN.SOLANA.name:
				return 'SOL';
			case CHAIN.SUI.name:
				return 'HIPPO';
			default:
				return 'SUNDOG';
		}
	};

	return (
		<div className="relative h-full w-full bg-bg-purple bg-cover pt-5 text-white">
			{/* 顶部 */}
			<div className="flex justify-between px-3">
				<div className="flex items-center">
					<ChevronLeft onClick={() => router.back()} />
					<span className="ml-5">Prediction</span>
				</div>
				<img
					className="ml-3 h-6 w-6"
					src="/img/vote-rules.png"
					onClick={() => router.push('/vote/rules')}
				/>
			</div>
			{/* 价格 */}
			<div className="w-full">
				<div className="relative h-32">
					<img
						className="absolute h-full w-full"
						src="/img/prediction-upimg.png"
					/>
					<div className="absolute left-1/2 top-[43%] flex w-5/6 -translate-x-1/2 -translate-y-1/2 justify-between">
						<div className="flex">
							{memeSymbol && (
								<img
									className="h-12 w-12 rounded-full"
									src={`/img/vote/${memeSymbol}.png`}
								/>
							)}
							<div className="ml-3 font-medium">
								<p className="font-jamjuree text-xl font-medium">{memeName}</p>
								<div className="flex">
									<img
										className="h-6 w-6"
										src={`/img/prediction-${tokenData?.ratio < 0 ? 'down' : 'up'}icon.png`}
									/>
									<span
										className={`${tokenData?.ratio < 0 ? 'text-[#83DEFF]' : 'text-custom-yellow-010'} ml-1 font-jamjuree text-sm font-medium`}
									>{`${((tokenData?.ratio || 0) * 100)?.toFixed(3) || 0}%`}</span>
								</div>
							</div>
						</div>
						<div className="text-right">
							<p className="text-lg font-medium">{`$${formatDecimal(tokenData?.currentPrice) || 0}`}</p>
							<span className="text-xs">{`1 min ago: $${formatDecimal(tokenData?.previousPrice) || 0}`}</span>
						</div>
					</div>
				</div>
			</div>
			{/* vote区域 */}
			<div className="relative">
				<img className="absolute w-full" src="/img/prediction-downimg.png" />
				<p className="mb-3 text-center text-xl">Up or Down in 60 Seconds?</p>
				<div
					className={`relative h-[82px] text-center font-DigitalNumber text-[32px] ${
						timeLeft < 10 ? 'text-red-500' : 'text-custom-yellow-010'
					}`}
				>
					<img
						className="absolute left-1/2 top-1/2 w-[170px] -translate-x-1/2 -translate-y-1/2"
						src="/img/prediction-timer.png"
					/>
					<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
						{`${Math.floor(timeLeft / 60)
							.toString()
							.padStart(
								2,
								'0',
							)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
					</span>
				</div>
				{memeSymbol && (
					<div className="relative -mt-10 h-96">
						<img
							className="absolute left-1/2 top-1/2 w-[65%] -translate-x-1/2 -translate-y-1/2"
							src={`/img/${memeSymbol}-pure.png`}
						/>
					</div>
				)}
				<div className="relative -mt-24">
					<div className="mx-auto flex w-[90%] justify-between">
						<span className="text-[32px] font-bold text-custom-yellow-010">
							{roundInfoLoading
								? '0'
								: calculateVotePercentage(
										roundInfo.voteUpCount,
										roundInfo.voteDownCount,
										true,
									)}
							%
						</span>
						<span className="text-[32px] font-bold text-custom-blue-001">
							{roundInfoLoading
								? '0'
								: calculateVotePercentage(
										roundInfo.voteUpCount,
										roundInfo.voteDownCount,
										false,
									)}
							%
						</span>
					</div>
					<div className="flex justify-around">
						<div
							className={`newvotebtn voteUp text-center`}
							onClick={() => handleVote(true)}
						>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<p className="clipTrangle voteUpColor bg-[#FFE716] text-lg font-semibold text-black">
								Vote UP
							</p>
						</div>

						<div
							className="newvotebtn voteDown text-center"
							onClick={() => handleVote(false)}
						>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<p className="clipTrangle voteDownColor bg-[#83DEFF] text-lg font-semibold text-black">
								Vote DOWN
							</p>
						</div>
					</div>
				</div>
			</div>
			{/* 中奖结果 */}
			{showResult && (
				<PredictionResults
					claimType={voteTokenType()}
					result={latestVoteRecord.canClaimReward}
					uAmount={latestVoteRecord.claimAmount}
					glodAmount={latestVoteRecord.rewardGold}
					clickModel={() => setShowResult(false)}
				/>
			)}

			<ApprovePop
				isOpen={isApprovePop}
				handleApprove={() => {
					approve();
				}}
				loading={allowanceLoading}
				title={'Please approve the vote with Sundog.'}
				onClose={() => {
					setIsApprovePop(false);
				}}
			/>

			<ConnectWalletPop
				isOpen={isConnectWalletPop}
				title="Connect Wallet"
				content="Please connect your wallet before voting for the memes."
				btnText={walletConnecting ? 'Connecting' : 'Connect Wallet'}
				onClose={() => {
					setIsConnectWalletPop(false);
				}}
			/>

			{/* vote确认弹窗 */}
			<ConfirmPopup
				isOpen={isConfirmPopup}
				title="Vote Confirm"
				loading={loadingConfirm}
				content="Please confirm the transaction"
				feeContent=""
				handleConfirm={() => {
					handleConfirm();
				}}
				onClose={() => {
					setIsConfirmPopup(false);
				}}
			/>

			<StakeAmountPop
				isOpen={isStakeAmountPop}
				balance={balance}
				tokenAddress={tokenAddress}
				tokenBalance={tokenBalance}
				resetAmount={resetAmount}
				handleVote={amount => {
					handleStake(amount);
				}}
				amountChange={amountChange}
				loading={voteLoading}
				onClose={() => {
					setIsStakeAmountPop(false);
				}}
			/>

			<WaitConfirmDrawer
				isOpen={isWaitConfirmOpen}
				title="Vote Complete"
				content="On-Chain Confirming (1min)"
				image=""
				scale={4}
				json={voteConfirmJson}
				onClose={() => setIsWaitConfirmOpen(false)}
			/>
		</div>
	);
};

export default Prediction;
