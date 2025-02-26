'use client';
import MessageBox from '@/app/_components/MessageBox/MessageBox';
import ResultModal from '@/app/_components/ResultModal/ResultModal';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import { useFetchInviteTask } from '@/hooks/useFetchInviteTask';
import { Task, useTaskList } from '@/hooks/useTaskList';
import fetchAPI from '@/lib/api';
import { RootState } from '@/store/store';
import { postEvent } from '@telegram-apps/sdk';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const filterList = ['576c8de5-ffa0-4c59-8160-98565fc7ad98'];
const LimitedTask = () => {
	const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
	const [isLinkCopiedOpen, setIsLinkCopiedOpen] = useState(false);
	const [isResultModalOpen, setIsResultModalOpen] = useState(false);
	const [sundogFreeSpinCount, setSundogFreeSpinCount] = useState(0);
	const wallet = useSelector((state: RootState) => state.wallet);
	const account = useSelector((state: RootState) => state.accountInfo.account);
	const [loadingFreeSpin, setLoadingFreeSpin] = useState(false);
	const { data: inviteTaskData, reload: reloadInviteTask } =
		useFetchInviteTask();
	const router = useRouter();
	const { showToast } = useToastContext();
	const { showRouterLoading } = useRouterLoadingContext();
	const { tasks, isLoading, reload: reloadTaskList } = useTaskList();
	const [filterTasks, setFilterTasks] = useState<Task[]>([]);

	useEffect(() => {
		setFilterTasks(
			tasks.filter(
				item =>
					item.band === 'bitget' ||
					item.band === 'osl' ||
					isPredictionMarket(item.title),
			),
		);
	}, [tasks]);

	/**
	 * 任务事件
	 * @param item
	 * @returns
	 */
	const handleTaskClick = async (item: any) => {
		console.log('item', item);
		if (isPredictionMarket(item.title) && item.status === 'claimed') {
			await navigator.clipboard.writeText(
				'https://nextmate.ai/predictionMarket',
			);
			setIsLinkCopiedOpen(true);
		} else if (item.status === 'canClaim') {
			console.log('item.isClaimed', item.isClicked);
			claimTask(item, 'claimed');
			return;
		} else if (item.status === 'init') {
			if (isPredictionMarket(item.title)) {
				await navigator.clipboard.writeText(
					'https://nextmate.ai/predictionMarket',
				);
				setIsLinkCopiedOpen(true);
			} else if (item.taskLink.includes('http')) {
				if (item.taskLink.includes('t.me')) {
					const url = item.taskLink.slice(12);
					postEvent('web_app_open_tg_link', { path_full: url });
				} else {
					postEvent('web_app_open_link', {
						url: item.taskLink,
						try_instant_view: true,
					});
				}
			}
			claimTask(item, 'canClaim');
		}
	};

	/**
	 * 领取任务奖励 gold coin
	 * @param item
	 * @returns
	 */
	const claimTask = async (item: Task, status: string) => {
		const res = await fetchAPI('/api/task/claim', {
			method: 'POST',
			body: { taskId: item.id, status },
		});
		if (res.success) {
			reloadTaskList();
		}
	};

	/**
	 * 领取邀请任务奖励 free spin
	 * @returns
	 */
	const handleFreeSpin = async () => {
		if (inviteTaskData?.canClaimDrawCount > 0) {
			setLoadingFreeSpin(true);
			const res = await fetchAPI('/api/task/invite/claim-draw', {
				method: 'POST',
			});
			if (res.success) {
				reloadInviteTask();
				showToast('You got a free spin!', 'success');
			} else {
				showToast(res.msg, 'error');
			}
			setLoadingFreeSpin(false);
			return;
		} else {
			showRouterLoading('/invite/1');
			router.push('/invite/1');
		}
	};

	/**
	 * 领取sundog免费转盘机会
	 * @returns
	 */
	const handleSundogFreeSpin = async () => {
		if (!wallet?.address) {
			showToast('Please connect your wallet', 'info');
			return;
		}
		const res = await fetchAPI('/api/task/sunpump-draw/claim', {
			method: 'POST',
			body: {
				address: wallet?.address,
				chainType: wallet.chain?.name?.toLowerCase(),
			},
		});
		console.log(363, res);

		if (res.success) {
			setSundogFreeSpinCount(res.data.claimedCount);
			setIsResultModalOpen(true);
		} else {
			showToast(res.msg, 'error', 'bottom', false);
			return;
		}
	};

	// 是否是 pc 预测市场任务
	const isPredictionMarket = (title: string) => {
		return title === 'Join the Prediction Market';
	};

	return (
		<>
			{!filterList.includes(account?.id) && (
				<>
					<p className="mt-4 w-full px-3 font-jamjuree text-sm font-medium tracking-widest text-white/80">
						Limited-Time
					</p>
					{/* bitget */}
					{filterTasks.length > 0 && (
						<div className="mb-4 mt-4 flex w-full flex-col">
							{filterTasks.map((item, index) => (
								<div
									key={item.id}
									className={`flex h-12 items-center justify-between bg-[#6e67f6]/10 p-3 shadow-[0_0_10px_#6E67F6] ${
										item.status === 'claimed' && !isPredictionMarket(item.title)
											? 'opacity-50'
											: ''
									}`}
									onClick={() => handleTaskClick(item)}
								>
									<div className="flex items-center justify-center gap-3">
										<img src={item.logo} alt="logo" className="w-4" />
										<div
											className="w-40 font-jamjuree text-xs font-medium tracking-widest text-white"
											dangerouslySetInnerHTML={{ __html: item.title }}
										></div>
									</div>
									<div className="flex items-center justify-center">
										<div
											className={`flex ${item.status === 'claimed' && isPredictionMarket(item.title) ? 'opacity-50' : ''}`}
										>
											<span className="mr-[4px] text-right font-jamjuree text-sm text-white">
												{item.amount}
											</span>
											<img
												src={`/img/icon/${item.awardType}.svg`}
												alt=""
												className="mr-2 w-4"
											/>
										</div>
										{item.status === 'claimed' &&
										!isPredictionMarket(item.title) ? (
											<img
												src="/img/icon/check-success.svg"
												alt="check"
												className="w-4"
											/>
										) : (
											<div
												className={`rectangle font-chakra text-white ${
													item.status === 'canClaim'
														? 'bg-[#F2BC1A]'
														: 'bg-[#6E67F6]'
												}`}
												onClick={() => handleTaskClick(item)}
											>
												{item.status === 'canClaim' ? 'CLAIM' : 'GO'}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}
					{/* 邀请排行榜 */}
					<div className="mb-4 mt-4 flex h-12 items-center justify-between bg-[#6e67f6]/10 p-3 shadow-[0_0_10px_#6E67F6]">
						<div className="flex items-center justify-center gap-3">
							<img
								className="w-4"
								src="/img/icon/trophies.png"
								alt="nextmate"
							/>
							<div className="flex flex-col">
								<div className="font-jamjuree text-xs font-medium tracking-widest text-white">
									$5000 Friends inviation contest
								</div>
							</div>
						</div>
						<div className="flex items-center justify-center">
							<Link
								href="/inviation-contest"
								onClick={() => showRouterLoading('/inviation-contest')}
								className={`rectangle relative bg-[#6E67F6] font-chakra text-white`}
							>
								{'GO'}
							</Link>
						</div>
					</div>
					{/* 邀请获U */}
					{/* <div className="mb-4 mt-4 flex h-12 items-center justify-between bg-[#6e67f6]/10 p-3 shadow-[0_0_10px_#6E67F6]">
										<div className="flex items-center justify-center gap-3">
											<img
												className="h-[19px] w-4"
												src="/img/icon/friend-ship.png"
												alt="friend-ship"
											/>
											<div className="flex flex-col">
												<div className="font-jamjuree text-xs font-medium tracking-widest text-white">
													Invite 100 friends
												</div>
												<div className="font-jamjuree text-[10px] font-normal text-white/80">
													Invited: {inviteTaskData?.inviteCountInContest || 0}
													/100
												</div>
											</div>
										</div>
										<div className="flex items-center justify-center">
											<span className="mr-[6px] text-right font-jamjuree text-sm font-medium tracking-widest text-white">
												1
											</span>
											<img src="/img/USDT.png" alt="" className="mr-3 w-4" />

											<div
												className={`rectangle relative font-chakra text-white ${
													inviteTaskData?.canClaimUsdtCount > 0
														? 'bg-[#F2BC1A]'
														: 'bg-[#6E67F6]'
												}`}
												onClick={() => claimIniteFriendGetU()}
											>
												{inviteTaskData?.canClaimUsdtCount > 0 ? 'CLAIM' : 'GO'}

												{loadingClaimInvite && (
													<LoaderCircle
														className="absolute -right-[5%] w-4 animate-spin"
														color="white"
													/>
												)}
											</div>
										</div>
									</div>
					{/* sunpump spin */}
					<div className="mb-4 mt-4 flex h-12 items-center justify-between bg-[#6e67f6]/10 p-3 shadow-[0_0_10px_#6E67F6]">
						<div className="flex items-center justify-center gap-3">
							<img className="w-4" src="/img/logo/sunpump.png" alt="sunpump" />
							<div className="flex flex-col">
								<div className="font-jamjuree text-xs font-medium tracking-widest text-white">
									Sunpump referral commission program
								</div>
							</div>
						</div>
						<div className="flex items-center justify-center">
							<div
								onClick={() => setIsMessageBoxOpen(true)}
								className={`rectangle relative bg-[#6E67F6] font-chakra text-white`}
							>
								{'GO'}
							</div>
						</div>
					</div>
					{/* free spin */}
					{/* <div
						className="mb-4 mt-3 flex h-12 items-center justify-between bg-[#6e67f6]/10 p-3 shadow-[0_0_10px_#6E67F6]"
						onClick={() => {
							handleFreeSpin();
						}}
					>
						<div className="flex items-center justify-center gap-3">
							<img
								src="/img/icon/free-spin.png"
								alt=""
								className="h-[18px] w-[18px]"
							/>
							<div className="w-40 font-jamjuree text-xs font-medium tracking-widest text-white">
								Invite 2 friends for a free spin
							</div>
						</div>
						<div className="flex items-center justify-center">
							<span className="mr-[6px] text-right font-jamjuree text-sm font-medium tracking-widest text-white">
								1
							</span>
							<img src="/img/icon/free-spin.png" alt="" className="mr-3 w-4" />
							<div
								className={`rectangle relative font-chakra text-white ${
									inviteTaskData?.canClaimDrawCount > 0
										? 'bg-[#F2BC1A]'
										: 'bg-[#6E67F6]'
								}`}
							>
								{inviteTaskData?.canClaimDrawCount > 0 ? 'CLAIM' : 'GO'}

								{loadingFreeSpin && (
									<LoaderCircle
										className="absolute -right-[5%] w-4 animate-spin"
										color="white"
									/>
								)}
							</div>
						</div>
					</div> */}
				</>
			)}

			{/* 邀请转盘条件 */}
			<MessageBox
				isOpen={isMessageBoxOpen}
				onClose={() => setIsMessageBoxOpen(false)}
				title="Conditions"
				content={<SpinRules />}
				confirmText="Verify and Claim"
				onConfirm={() => {
					handleSundogFreeSpin();
				}}
			/>
			{/* 免费转盘结果 */}
			<ResultModal
				isOpen={isResultModalOpen}
				content={<SpinResult count={sundogFreeSpinCount} />}
				confirmText="Go Spin"
				onClose={() => setIsResultModalOpen(false)}
				handleConfirm={() => {
					setIsResultModalOpen(false);
					router.push('/roulette/sunpump');
				}}
			/>
			{/* 复制pc预测市场链接 */}
			<MessageBox
				isOpen={isLinkCopiedOpen}
				onClose={() => setIsLinkCopiedOpen(false)}
				title="Link Copied!"
				content={<LinkCopiedContent />}
				confirmText="Confirm"
				onConfirm={() => setIsLinkCopiedOpen(false)}
			/>
		</>
	);
};

const LinkCopiedContent = () => {
	return (
		<div className="mb-6 text-white">
			<div className="m-auto w-72">
				Please open the link on a desktop. Our mobile version is coming soon!
			</div>
		</div>
	);
};

const SpinRules = () => {
	const openLink = () => {
		postEvent('web_app_open_link', {
			url: 'https://sunio.zendesk.com/hc/en-us/articles/39871173653657',
			try_instant_view: true,
		});
	};
	return (
		<div className="relative flex w-full flex-col items-start justify-start px-6">
			<div className="font-jamjuree text-sm font-normal text-white">
				Eligible participants include those who have traded on SunPump, invited
				others, or created a Meme coin.
			</div>
			<div className="mt-6 font-jamjuree text-base font-semibold text-white">
				How to get spins
			</div>
			<div className="my-2">
				<ul className="list-inside">
					<li className="text-sm text-white">
						· Create a meme coin to earn 5 lottery entries.
					</li>
					<li className="text-sm text-white">
						· Invite a trading address successfully to earn 3 lottery entries.
					</li>
					<li className="text-sm text-white">
						· Complete a transaction (minimum 50 TRX) to earn 1 lottery entry.
					</li>
				</ul>
			</div>
			<div
				className="mb-6 font-jamjuree text-xs font-medium text-white/90"
				onClick={openLink}
			>
				More details: [announcement URL]
			</div>
		</div>
	);
};

const SpinResult = ({ count }: { count: number }) => {
	return (
		<div className="relative flex w-full flex-col items-center justify-center">
			<img className="h-60 w-56" src="/img/sunpump-spin-result.png" />
			<div className="mt-6 w-full text-center font-jamjuree text-lg font-medium text-white">
				You have got $SUNPUMP lottery entires
			</div>
			<div className="mb-12 mt-2 w-full text-center font-jamjuree text-3xl font-semibold text-[#ffe715]">
				{count} times!
			</div>
		</div>
	);
};

export default LimitedTask;
