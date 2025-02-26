'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import fetchAPI from '@/lib/api';
import { useRouter } from 'next/navigation';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ChevronLeft } from 'lucide-react';
import InvitePop from '@/app/_components/InvitePop/InvitePop';
import InviteRecord from '@/app/_components/InviteRecord/InviteRecord';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import { useUserInfo } from '@/hooks/useUserInfo';

// eslint-disable-next-line react-refresh/only-export-components
const InvestPage = () => {
	const router = useRouter();
	// const account = useSelector((state: RootState) => state.accountInfo.account);
	// const dispatch = useDispatch<AppDispatch>();
	const [isOpen, setIsOpen] = useState(false);
	const [isRecordOpen, setIsRecordOpen] = useState(false);
	const [baseUrl, setBaseUrl] = useState('');
	const [isCopied, setIsCopied] = useState(false);
	const [inviteCode, setInviteCode] = useState<string>('');
	const [invitationConfirmed, setInvitationConfirmed] = useState(false);
	const { showToast } = useToastContext();
	const { user, reload } = useUserInfo();

	useEffect(() => {
		setInviteCode(user?.invitationCode);
		setInvitationConfirmed(user?.invitingConfirmed);
	}, [user]);

	async function handleOpenConfirm() {
		if (invitationConfirmed) {
			showToast('You have already received', 'success');
			console.log('You have already received..');
			return;
		} else {
			setIsOpen(true);
		}
	}

	/* 分享链接 */
	const shareLink = () => {
		const link = `${baseUrl}/join?startapp=${inviteCode}`;
		const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}`;
		window.open(telegramShareUrl, '_blank');
	};

	useEffect(() => {
		if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
			setBaseUrl('https://t.me/nextmateai_bot');
		} else {
			setBaseUrl('https://t.me/testnextmate_bot');
		}
	}, []);

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<div className="relative h-screen w-full bg-bg-invite bg-[length:100%_100%] bg-no-repeat">
			<div className="relative h-full w-full px-3 pt-[30vh]">
				{/* top bar */}
				<div className="fixed left-0 top-0 flex w-full items-center justify-between px-3 py-4">
					<div className="relative flex items-center justify-center gap-7">
						{/* back */}
						<ChevronLeft
							color="white"
							className="w-6"
							onClick={() => router.back()}
						/>
						<div className="font-jamjuree text-xl font-semibold text-white">
							Invitation Code
						</div>
					</div>
					<div
						className="text-center font-pingfang text-base font-semibold text-white underline"
						onClick={() => handleOpenConfirm()}
					>
						Claim Rewards
					</div>
				</div>

				<img className="w-full" src="/img/invite/invite-deal.png" alt="" />

				<div className="relative mx-auto flex w-full max-w-sm flex-col items-stretch">
					{/* 边框 */}
					<img
						className="absolute h-auto min-h-28"
						src={'/img/bg-invite-tips.png'}
					/>
					{/* 内容 */}
					<div className="relative z-10 flex w-full flex-col items-center justify-center">
						<p className="mt-2.5 font-jamjuree text-base font-normal text-white">
							For every friend you invite, you get...
						</p>
						<div className="flex items-center justify-center gap-4 pb-4 pt-2">
							<div className="font-jamjuree text-6xl font-medium uppercase tracking-widest text-white">
								{200}
							</div>
							<img src="/img/icon/coin.png" alt="coin" className="w-12" />
						</div>
					</div>
				</div>

				<div className="mt-4 flex w-full items-center justify-center">
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
				<div className="mt-3 flex w-full items-center justify-center gap-2 text-center text-white">
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
			</div>

			<InviteRecord
				isOpen={isRecordOpen}
				onClose={() => setIsRecordOpen(false)}
			/>

			<InvitePop
				isOpen={isOpen}
				title="Get Rewards"
				description="Enter the invitation code and get rewards of 500 gold coins."
				onClose={handleClose}
				referralCode={null}
				invitationConfirmed={invitationConfirmed}
			/>
		</div>
	);
};

export default withAuth(InvestPage);
