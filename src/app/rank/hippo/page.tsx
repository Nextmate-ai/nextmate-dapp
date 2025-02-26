'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { useRouter } from 'next/navigation';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import MessageBox from '@/app/_components/MessageBox/MessageBox';
import fetchAPI from '@/lib/api';
import ResultModal from '@/app/_components/ResultModal/ResultModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ConnectWalletPop from '@/app/_components/ConnectWalletPop/ConnectWalletPop';
import { useHippoRank } from '@/hooks/useHippoRanking';

const rewards = [
	50000, 35000, 35000, 25000, 15000, 10000, 8000, 6000, 4000, 2000,
];

const SpinRules = () => {
	return (
		<div className="relative mb-6 flex w-full flex-col items-start justify-start px-6">
			<div className="font-jamjuree text-sm font-normal text-white">
				Please vote Hippo tokens to earn more spins!
			</div>
		</div>
	);
};

const SpinResult = ({ count }: { count: number }) => {
	return (
		<div className="relative flex w-full flex-col items-center justify-center">
			<img className="h-60 w-56" src="/img/hippo-spin-result.png" />
			<div className="mt-6 w-full text-center font-jamjuree text-lg font-medium text-white">
				You have got $Hippo lottery entires
			</div>
			<div className="mb-12 mt-2 w-full text-center font-jamjuree text-3xl font-semibold text-[#ffe715]">
				{count} times!
			</div>
		</div>
	);
};

const InvitationContest = () => {
	const router = useRouter();
	const [xsUrl, setxsUrl] = useState('');
	const [inviteCode, setInviteCode] = useState<string>('');
	const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isConnectWalletPop, setIsConnectWalletPop] = useState(false);
	const [isResultModalOpen, setIsResultModalOpen] = useState(false);
	const [freeSpinCount, setFreeSpinCount] = useState(0);
	const wallet = useSelector((state: RootState) => state.wallet);
	const { user } = useUserInfo();
	const { showToast } = useToastContext();
	const { data } = useHippoRank();

	useEffect(() => {
		setInviteCode(user?.invitationCode);
	}, [user]);

	useEffect(() => {
		if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
			setxsUrl('https://t.me/nextmateai_bot');
		} else {
			setxsUrl('https://t.me/testnextmate_bot');
		}
	}, []);

	const clickVerify = async () => {
		if (!wallet.address) {
			setIsConnectWalletPop(true);
			return;
		}
		if (isLoading) return;
		setIsLoading(true);
		const res = await fetchAPI('/api/task/hippo-vote-event/claim', {
			method: 'POST',
			body: {
				chainType: wallet.chain?.name.toLowerCase(),
				address: wallet.address,
			},
		});
		setIsLoading(false);
		if (!res.success || res.data?.claimedCount === 0) {
			setIsMessageBoxOpen(true);
		} else {
			setIsResultModalOpen(true);
			setFreeSpinCount(res.data?.claimedCount);
		}
	};

	return (
		<div className="no-scrollbar relative h-full w-full overflow-y-auto px-3 pt-5">
			<div className="relative flex justify-center">
				<ChevronLeft
					color="white "
					className="absolute -left-3 top-[3px] w-6"
					onClick={() => router.back()}
				/>
				<div className="text-center font-jamjuree text-xl font-semibold text-white">
					$1,500,000 Hippo Contest
				</div>
			</div>
			<div className="my-6 pl-3 text-left font-jamjuree text-sm font-normal text-white">
				<p>Time: December 9th - December 16th(UTC)</p>
			</div>
			<div className="relative flex min-h-60 w-full flex-col items-stretch pb-9">
				<img
					className="absolute h-full w-full"
					src="/img/ranking/invitation-bg-ranking.png"
					alt=""
				/>
				<div className="relative mx-auto mt-6 h-[26px] w-36">
					<div className="font-Chakra absolute left-[1px] top-0 text-center text-xl font-bold text-[#ffe715]/90">
						LEADERBOARD
					</div>
					<div className="font-Chakra absolute left-0 top-0 text-center text-xl font-bold text-[#aca8ff]">
						LEADERBOARD
					</div>
				</div>
				<div className="mt-4 flex justify-between px-2 uppercase">
					<span className="font-Chakra w-10 text-center text-xs font-bold text-white/70">
						Rank
					</span>
					<span className="font-Chakra w-20 text-center text-xs font-bold text-white/70">
						User
					</span>
					<span className="font-Chakra w-28 text-center text-xs font-bold text-white/70">
						Volume
					</span>
					<span className="font-Chakra w-20 text-center text-xs font-bold text-white/70">
						Rewards
					</span>
				</div>
				{data.list?.map((item, index) => (
					<div className={`mt-3 px-2`} key={item.userId}>
						<div
							className={`flex h-6 items-center justify-between ${index === 0 ? 'bg-invition-bg-top1' : index === 1 ? 'bg-invition-bg-top2' : index === 2 ? 'bg-invition-bg-top3' : 'bg-invition-bg-top4'}`}
						>
							<div className="w-10 text-center font-jamjuree text-xs font-bold text-white">
								{index + 1}
							</div>
							<div className="w-20 text-center font-jamjuree text-xs font-bold text-white">
								{(item.username || item.userId)?.length > 4
									? `${(item.username || item.userId).slice(0, 2)}...${(item.username || item.userId).slice(-2)}`
									: item.username || item.userId}
							</div>
							<div className="w-28 text-center font-jamjuree text-xs font-bold text-white">
								{item.totalPlaceTokenAmount}
							</div>
							<div className="flex w-20 items-center justify-end gap-1 pr-2 font-jamjuree text-xs font-bold text-white">
								<span
									className={`text-right ${index === 0 ? 'text-custom-yellow-010' : index === 1 ? 'text-[#FF6761]' : index === 2 ? 'text-[#ACA8FF]' : ''}`}
								>
									{rewards[index]}
								</span>
								<img
									src="/img/logo/hippo.png"
									className="h-[14px] w-[14px]"
									alt=""
								/>
							</div>
						</div>
					</div>
				))}

				{/* no data */}
				{data.list.length === 0 && (
					<div className="mt-16 flex flex-col items-center justify-center"></div>
				)}
			</div>
			<div className="fixed bottom-0 left-0 z-10 flex w-full items-center justify-center px-8">
				<div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-b from-black to-transparent" />
				<button className={`relative mb-4 h-14 w-full`} onClick={clickVerify}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-full"
						viewBox="0 0 320 48"
						fill={inviteCode ? '#6E67F6' : '#747d8c'}
					>
						<path
							d="M0.5 6.12766V3.36943L20.4613 0.5H54.4681H284.255H302.979H319.5V4.21277V42.5106V44.8295L302.939 47.5H268.936H52.766H17.8723H0.5V42.383V6.12766Z"
							fill={inviteCode ? '#6E67F6' : '#747d8c'}
							stroke={inviteCode ? '#6E67F6' : '#747d8c'}
						/>
					</svg>

					<div className="absolute top-[50%] w-full translate-y-[-50%] text-center font-chakra text-xs font-semibold uppercase tracking-wide text-white">
						Verify and claim
					</div>
					{isLoading && (
						<LoaderCircle
							className="absolute right-[9%] top-[29%] animate-spin"
							color="white"
						/>
					)}
				</button>
			</div>
			<div className="relative mt-4 flex w-full items-stretch pb-20">
				<img
					className="absolute h-full w-full"
					src="/img/ranking/bg-rules.png"
				/>
				<div className="relative flex w-full flex-col items-center justify-center px-4">
					{/* title */}
					<div className="relative mt-6 h-[26px] w-[54px]">
						<div className="absolute left-[1px] top-0 text-center font-chakra text-xl font-bold text-white/90">
							Rules
						</div>
						<div className="absolute left-0 top-0 text-center font-chakra text-xl font-bold text-[#aca8ff]">
							Rules
						</div>
					</div>
					{/* event info */}
					<div className="mt-4 flex w-full flex-col items-start justify-start">
						<div className="flex w-full flex-col items-start justify-start gap-2 self-stretch">
							<div className="flex flex-col items-start justify-start self-stretch">
								<div className="self-stretch font-jamjuree text-[10px] font-normal text-white/80">
									Event Name
								</div>
								<div className="self-stretch font-jamjuree text-xs font-bold text-white">
									$1,500,000 Hippo Contest Leaderboard
								</div>
							</div>
							<div className="flex flex-col items-start justify-start self-stretch">
								<div className="self-stretch font-jamjuree text-[10px] font-normal text-white/80">
									Event Duration
								</div>
								<div className="self-stretch font-jamjuree text-xs font-bold text-white">
									December 9th - December 16th
								</div>
							</div>
							<div className="flex flex-col items-start justify-start self-stretch">
								<div className="self-stretch font-jamjuree text-[10px] font-normal text-white/80">
									Prize Pool
								</div>
								<div className="self-stretch font-jamjuree text-xs font-bold text-white">
									<li>190000 $Hippo for contest</li>
									<li>800000 $Hippo for Prediction Event</li>
									<li>10000 $Hippo for Twitter Event</li>
									<li>$1,500,000 worth of Gems, Gold Coins, and Outfits.</li>
								</div>
							</div>
						</div>
					</div>

					{/* prizes */}
					<div className="mt-4 flex w-full flex-col items-start justify-start">
						<div className="text-center font-jamjuree text-[10px] font-normal text-white/80">
							Prizes
						</div>
						<div className="font-jamjuree text-sm font-semibold text-[#aca8ff]">
							Social Media Prize
						</div>

						<p className="font-jamjuree text-sm font-normal text-white">
							<span className="text-xs font-medium">Bonus: </span>
							10,000 $Hippo (1000 $Hippo x 10)
						</p>
						<p className="font-jamjuree text-sm font-normal text-white">
							<span className="text-xs font-medium">How to win: </span>
							Retweeting, Liking, and Tagging 3 Friends!
						</p>
						<div className="mt-4 font-jamjuree text-sm font-semibold text-[#aca8ff]">
							Leaderboard Prize
						</div>
						<div className="font-jamjuree text-xs font-normal text-white/80">
							A live leaderboard will track the top ten participants with the
							highest voting amounts, who will receive rewards for the contest.
							<br />
							The top 10 winners will receive additional rewards:
						</div>
						<ul className="flex list-disc flex-col items-center justify-start gap-0.5">
							<li className="flex items-center justify-start gap-1.5 text-white">
								•
								<div className="w-[80px] font-jamjuree text-xs font-medium">
									1st Place:
								</div>
								<div className="w-[130px] font-jamjuree text-xs font-medium">
									50,000 $Hippo
								</div>
							</li>
							<li className="flex items-center justify-start gap-1.5 text-white">
								•
								<div className="w-[80px] font-jamjuree text-xs font-medium">
									2nd Place:
								</div>
								<div className="w-[130px] font-jamjuree text-xs font-medium">
									35,000 $Hippo
								</div>
							</li>
							<li className="flex items-center justify-start gap-1.5 text-white">
								•
								<div className="w-[80px] font-jamjuree text-xs font-medium">
									3rd Place:
								</div>
								<div className="w-[130px] font-jamjuree text-xs font-medium">
									35,000 $Hippo
								</div>
							</li>
							<li className="flex items-center justify-start gap-1.5 text-white">
								•
								<div className="w-[80px] font-jamjuree text-xs font-medium">
									4th Place:
								</div>
								<div className="w-[130px] font-jamjuree text-xs font-medium">
									25,000 $Hippo
								</div>
							</li>
							<li className="flex items-center justify-start gap-1.5 text-white">
								•
								<div className="w-[80px] font-jamjuree text-xs font-medium">
									5th Place:
								</div>
								<div className="w-[130px] font-jamjuree text-xs font-medium">
									15,000 $Hippo
								</div>
							</li>
							<li className="flex items-center justify-start gap-1.5 text-white">
								•
								<div className="w-[80px] font-jamjuree text-xs font-medium">
									6th Place:
								</div>
								<div className="w-[130px] font-jamjuree text-xs font-medium">
									10,000 $Hippo
								</div>
							</li>
							<li className="flex items-center justify-start gap-1.5 text-white">
								•
								<div className="w-[80px] font-jamjuree text-xs font-medium">
									7th Place:
								</div>
								<div className="w-[130px] font-jamjuree text-xs font-medium">
									8,000 $Hippo
								</div>
							</li>
							<li className="flex items-center justify-start gap-1.5 text-white">
								•
								<div className="w-[80px] font-jamjuree text-xs font-medium">
									8th Place:
								</div>
								<div className="w-[130px] font-jamjuree text-xs font-medium">
									6,000 $Hippo
								</div>
							</li>
							<li className="flex items-center justify-start gap-1.5 text-white">
								•
								<div className="w-[80px] font-jamjuree text-xs font-medium">
									9th Place:
								</div>
								<div className="w-[130px] font-jamjuree text-xs font-medium">
									4,000 $Hippo
								</div>
							</li>
							<li className="flex items-center justify-start gap-1.5 text-white">
								•
								<div className="w-[80px] font-jamjuree text-xs font-medium">
									10th Place:
								</div>
								<div className="w-[130px] font-jamjuree text-xs font-medium">
									2,000 $Hippo
								</div>
							</li>
						</ul>
					</div>
					{/* how to join */}
					<div className="mt-4 flex w-full flex-col items-start justify-start">
						<div className="font-jamjuree text-[10px] font-normal text-white/80">
							How to Join
						</div>

						<p className="font-jamjuree text-xs font-normal text-white">
							For any vote with X $Hippo, you'll receive X/1000 entries. If
							X/1000 is not an integer, it will be rounded down.
						</p>
						<p className="mt-4 font-jamjuree text-xs text-white">For example</p>
						<ul className="font-jamjuree text-xs text-white">
							<li>
								• Each time you vote with 1000 $Hippo, you earn 1 lottery
								entry,regardless of winning or losing.
							</li>
							<li>• Vote with 200 $Hippo to receive 2 entries.</li>
							<li>• Vote with 1020 $Hippo to earn 10 entries.</li>
						</ul>
					</div>
				</div>
			</div>

			<ConnectWalletPop
				isOpen={isConnectWalletPop}
				title="Connect Wallet"
				content="Please connect your wallet before claiming the rewards."
				btnText={wallet.address ? 'Connecting' : 'Connect Wallet'}
				onClose={() => {
					setIsConnectWalletPop(false);
				}}
			/>
			<MessageBox
				isOpen={isMessageBoxOpen}
				onClose={() => setIsMessageBoxOpen(false)}
				title="Eligibility Required"
				content={<SpinRules />}
				confirmText="Confirm"
				onConfirm={() => {
					// router.push('/vote');
					setIsMessageBoxOpen(false);
				}}
			/>
			{/* 免费转盘结果 */}
			<ResultModal
				isOpen={isResultModalOpen}
				content={<SpinResult count={freeSpinCount} />}
				confirmText="Go Spin"
				onClose={() => setIsResultModalOpen(false)}
				handleConfirm={() => {
					setIsResultModalOpen(false);
					router.push('/roulette/hippo');
				}}
			/>
		</div>
	);
};

export default withAuth(InvitationContest);
