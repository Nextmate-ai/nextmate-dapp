'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { useRouter } from 'next/navigation';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import useCountdown from '@/hooks/useCountDown';
import { useVoteSundogRank } from '@/hooks/useRanking';
import MessageBox from '@/app/_components/MessageBox/MessageBox';
import fetchAPI from '@/lib/api';
import ResultModal from '@/app/_components/ResultModal/ResultModal';

const sundogRewards = [5000, 3500, 3500, 2500, 1500, 1000, 800, 600, 400, 200];

const SpinRules = () => {
	return (
		<div className="relative mb-6 flex w-full flex-col items-start justify-start px-6">
			<div className="font-jamjuree text-sm font-normal text-white">
				Please vote by $sundog tokens to earn more spins!
			</div>
		</div>
	);
};

const SpinResult = ({ count }: { count: number }) => {
	return (
		<div className="relative flex w-full flex-col items-center justify-center">
			<img className="h-60 w-56" src="/img/sundog-spin-result.png" />
			<div className="mt-6 w-full text-center font-jamjuree text-lg font-medium text-white">
				You have got $SUNDOG lottery entires
			</div>
			<div className="mb-12 mt-2 w-full text-center font-jamjuree text-3xl font-semibold text-[#ffe715]">
				{count} times!
			</div>
		</div>
	);
};

const InvitationContest = () => {
	const router = useRouter();
	const [baseUrl, setBaseUrl] = useState('');
	const [inviteCode, setInviteCode] = useState<string>('');
	const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isResultModalOpen, setIsResultModalOpen] = useState(false);
	const [sundogFreeSpinCount, setSundogFreeSpinCount] = useState(0);

	const { user } = useUserInfo();
	const { showToast } = useToastContext();
	const { data } = useVoteSundogRank();

	useEffect(() => {
		setInviteCode(user?.invitationCode);
	}, [user]);

	useEffect(() => {
		if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
			setBaseUrl('https://t.me/nextmateai_bot');
		} else {
			setBaseUrl('https://t.me/testnextmate_bot');
		}
	}, []);

	const clickVerify = async () => {
		if (isLoading) return;
		setIsLoading(true);
		const res = await fetchAPI('/api/task/vote-sundog-draw/claim', {
			method: 'POST',
		});
		setIsLoading(false);
		if (!res.success || res.data?.claimedCount === 0) {
			setIsMessageBoxOpen(true);
		} else {
			setIsResultModalOpen(true);
			setSundogFreeSpinCount(res.data?.claimedCount);
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
					$150,000 Vote-to-Earn Contest
				</div>
			</div>
			<div className="my-6 pl-3 text-left font-jamjuree text-sm font-normal text-white">
				<p>Time: November 16th - November 30th(UTC)</p>
				{/* <p>Daily Open Time: 6-10 AM, 2-6 PM, 10 PM-2 AM (UTC)</p> */}
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
						Voting amount
					</span>
					<span className="font-Chakra w-20 text-center text-xs font-bold text-white/70">
						rewards
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
							<div className="flex w-20 items-center justify-end gap-1 pr-4 font-jamjuree text-xs font-bold text-white">
								<span
									className={`mr-1 w-6 text-right ${index === 0 ? 'text-custom-yellow-010' : index === 1 ? 'text-[#FF6761]' : index === 2 ? 'text-[#ACA8FF]' : ''}`}
								>
									{sundogRewards[index]}
								</span>
								<img
									src="/img/logo/sundog.png"
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
			<div className="fixed bottom-0 left-0 flex w-full items-center justify-center px-8">
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

					<div className="absolute top-[50%] w-full translate-y-[-50%] text-center font-chakra text-base font-semibold uppercase tracking-wide text-white">
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
			<img
				className="mb-16 mt-4"
				src="/img/ranking/ranking-sundog-rules.png"
				alt=""
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
				content={<SpinResult count={sundogFreeSpinCount} />}
				confirmText="Go Spin"
				onClose={() => setIsResultModalOpen(false)}
				handleConfirm={() => {
					setIsResultModalOpen(false);
					router.push('/roulette/sundog');
				}}
			/>
		</div>
	);
};

export default withAuth(InvitationContest);
