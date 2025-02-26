'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { useRouter } from 'next/navigation';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import useCountdown from '@/hooks/useCountDown';
import { useInviteRank } from '@/hooks/useInviteRank';
import { useInviteRecord } from '@/hooks/useInviteRecord';
import moment from 'moment';

const usdtRewards = [200, 100, 100, 80, 70, 60, 50, 40, 30, 20];

const InvitationContest = () => {
	const router = useRouter();
	const [baseUrl, setBaseUrl] = useState('');
	const [inviteCount, setInviteCount] = useState(0);
	const [inviteCode, setInviteCode] = useState<string>('');
	const { user } = useUserInfo();
	const [isCopied, setIsCopied] = useState(false);
	const { showToast } = useToastContext();
	const { inviteRecordData } = useInviteRecord();

	const { data } = useInviteRank();

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

	useEffect(() => {
		if (inviteRecordData?.records) {
			const newRecords = inviteRecordData.records.filter(record => {
				return moment(record.createdAt).isBetween(1733227200000, 1733745600000);
			});
			console.log(newRecords);
			setInviteCount(newRecords.length);
		}
	}, [inviteRecordData]);

	return (
		<div className="no-scrollbar relative h-full w-full overflow-y-auto px-3 pt-5">
			<div className="relative flex justify-center">
				<ChevronLeft
					color="white "
					className="absolute -left-3 top-[3px] w-6"
					onClick={() => router.back()}
				/>
				<div className="text-center font-jamjuree text-xl font-semibold text-white">
					$5000 Friends Invitation Contest
				</div>
			</div>
			<div className="my-6 text-center font-jamjuree text-sm font-normal text-white">
				December 3, 12 PM UTC - December 10, 12 PM UTC
			</div>
			{/* <div className="mb-1 flex justify-center gap-2 text-white">
				<span>Days</span>
				<span>Hours</span>
				<span>Minutes</span>
				<span>Seconds</span>
			</div>
			<div className="mb-6 flex justify-center gap-2 text-3xl text-white">
				<span>{String(days).padStart(2, '0')}</span>
				<span className="mx-2">{String(hours).padStart(2, '0')}</span>
				<span>:</span>
				<span className="mx-2">{String(minutes).padStart(2, '0')}</span>
				<span>:</span>
				<span className="mx-2">{String(seconds).padStart(2, '0')}</span>
			</div> */}
			<div className="relative flex w-full flex-col items-stretch pb-9">
				<img
					className="absolute h-full w-full"
					src="/img/ranking/invitation-bg-ranking.png"
					alt=""
				/>
				<div className="relative mx-auto mt-6 h-[26px] w-36">
					<div className="absolute left-[1px] top-0 text-center font-chakra text-xl font-bold text-[#ffe715]/90">
						LEADERBOARD
					</div>
					<div className="absolute left-0 top-0 text-center font-chakra text-xl font-bold text-[#aca8ff]">
						LEADERBOARD
					</div>
				</div>
				<div className="absolute right-4 top-6 flex flex-col items-center justify-center">
					<div className="inline-flex h-7 items-center justify-center gap-1 rounded-[14px] bg-[#6e67f6] px-3 py-1">
						<div className="inline-flex flex-col items-center justify-center">
							<div className="inline-flex items-center justify-start gap-1">
								<img
									src="/img/icon/invite-person.png"
									alt="invite"
									className="w-4"
								/>
								<div className="w-4 font-jamjuree text-base font-medium uppercase text-white">
									{inviteCount}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-4 flex justify-between px-4">
					<span className="font-Chakra w-7 text-center text-xs font-bold text-white/70">
						Rank
					</span>
					<span className="font-Chakra w-24 text-center text-xs font-bold text-white/70">
						User
					</span>
					<span className="font-Chakra w-12 text-center text-xs font-bold text-white/70">
						Invites
					</span>
					<span className="font-Chakra w-20 text-center text-xs font-bold text-white/70">
						Bonus
					</span>
				</div>
				{data.list?.map((item, index) => (
					<div className={`mt-3 px-4`} key={item.userId}>
						<div
							className={`flex h-6 items-center justify-between ${index === 0 ? 'bg-invition-bg-top1' : index === 1 ? 'bg-invition-bg-top2' : index === 2 ? 'bg-invition-bg-top3' : 'bg-invition-bg-top4'}`}
						>
							<div className="w-7 text-center font-jamjuree text-xs font-bold text-white">
								{index + 1}
							</div>
							<div className="w-24 text-center font-jamjuree text-xs font-bold text-white">
								{(item.username || item.userId)?.length > 4
									? `${(item.username || item.userId).slice(0, 2)}...${(item.username || item.userId).slice(-2)}`
									: item.username || item.userId}
							</div>
							<div className="w-12 max-w-20 text-center font-jamjuree text-xs font-bold text-white">
								{item.inviteCount}
							</div>
							<div className="flex w-20 max-w-20 justify-end pr-4 font-jamjuree text-xs font-bold text-white">
								<span
									className={`mr-1 w-6 text-right ${index === 0 ? 'text-custom-yellow-010' : index === 1 ? 'text-[#FF6761]' : index === 2 ? 'text-[#ACA8FF]' : ''}`}
								>
									{usdtRewards[index]}
								</span>
								<img src="/img/USDT.png" className="h-[14px] w-[14px]" alt="" />
							</div>
						</div>
					</div>
				))}

				{/* no data */}
				{data.list.length === 0 && (
					<div className="mt-16 flex flex-col items-center justify-center">
						<img className="h-28 w-28" src="/img/invite-record-no-data.png" />
						<div className="mt-8 flex flex-col items-start justify-start gap-2">
							<div className="self-stretch text-center font-jamjuree text-base font-normal text-white">
								No friends have joined recently.
							</div>
							<div className="self-stretch text-center font-jamjuree text-base font-normal text-white">
								Share and invite them to join now!
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="mt-6 flex w-full items-center justify-center">
				<CopyToClipboard
					text={`${baseUrl}/join?startapp=${inviteCode}`}
					onCopy={() => {
						setIsCopied(true);
					}}
					disabled={!inviteCode}
				>
					{/* copy invite link */}
					<button className={`relative mx-auto h-14 w-72`}>
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
							{isCopied ? 'Copied!' : 'Copy invitation link'}
						</div>
					</button>
				</CopyToClipboard>
			</div>
			{/* copy invite code */}
			<div className="mb-6 mt-3 flex w-full items-center justify-center gap-2 text-center text-white">
				<div className="font-jamjuree text-base font-normal capitalize leading-normal text-white">
					Your Invitation code |
				</div>
				<span className="font-jamjuree text-base font-semibold capitalize leading-normal text-white">
					{inviteCode}
				</span>
				<CopyToClipboard
					text={inviteCode}
					onCopy={() => {
						showToast('copied', 'success');
					}}
				>
					<img
						src="/img/icon/copy.svg"
						alt="copy"
						className="w-4 cursor-pointer"
					/>
				</CopyToClipboard>
			</div>
			<img className="mb-16" src="/img/ranking/invitation-rules.png" alt="" />
		</div>
	);
};

export default withAuth(InvitationContest);
