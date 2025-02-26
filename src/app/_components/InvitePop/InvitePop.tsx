import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAccount } from '@/store/slices/accountInfoSlice';
import { AccountType } from '@/types/rainbowkit.type';
import CustomConnectButton from '../CustomConnectButton/CustomConnectButton';
import { useAccount } from 'wagmi';
import { useRouter, usePathname } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { UserInfo } from '@/types/user.type';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import fetchAPI from '@/lib/api';
import ReferralCode from '../ReferralCode/ReferralCode';
import confetti from 'canvas-confetti';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';

interface InvitePopProps {
	isOpen: boolean;
	title: string;
	description: string;
	invitationConfirmed: boolean;
	referralCode: string | null;
	onClose: () => void;
}

const InvitePop: React.FC<InvitePopProps> = ({
	isOpen,
	onClose,
	title,
	description,
	referralCode,
	invitationConfirmed,
}) => {
	const count = 200;
	const defaults = {
		origin: { y: 0.7 },
	};
	const [visible, setVisible] = useState(isOpen);
	const dispatch = useDispatch();
	const ref = useRef<any>(null);
	const [invitationCode, setInvitationCode] = useState('');
	const [invitationMsg, setInvitationMsg] = useState('');
	const [isClaimed, setIsClaimed] = useState(false);
	const router = useRouter();
	const { showRouterLoading } = useRouterLoadingContext();

	useEffect(() => {
		if (isOpen) {
			setVisible(true);
		} else {
			const timer = setTimeout(() => setVisible(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	const handleClaim = async () => {
		const res = await fetchAPI('/api/user', {
			method: 'POST',
			body: {
				invitingCode: invitationCode,
			},
		});
		if (res.success === false) {
			setInvitationMsg(res.msg);
			return;
		}
		if (res.success === true) {
			setInvitationMsg('');
			handleConfetti();
			onClose();
			showRouterLoading('/invite/1');
			router.push('/invite/1');
		}
	};

	// 礼花
	function fire(particleRatio: number, opts: any) {
		confetti({
			...defaults,
			...opts,
			particleCount: Math.floor(count * particleRatio),
		});
	}
	// 祝贺
	const handleConfetti = () => {
		fire(0.25, {
			spread: 26,
			startVelocity: 55,
		});
		fire(0.2, {
			spread: 60,
		});
		fire(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8,
		});
		fire(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
		});
		fire(0.1, {
			spread: 120,
			startVelocity: 45,
		});
	};

	// 邀请码
	const handleChangeVal = useCallback((val: string) => {
		const upVal = val.toUpperCase();
		setInvitationCode(prevCode => {
			if (prevCode !== upVal) {
				return upVal;
			}
			return prevCode;
		});

		setInvitationMsg(prevMsg => {
			if (!val && prevMsg !== '') {
				return '';
			}
			return prevMsg;
		});
	}, []);

	useEffect(() => {
		if (referralCode) {
			setInvitationCode(referralCode);
			setTimeout(() => {
				ref.current?.blurLastInput();
			}, 500);
		}
	}, [referralCode]);

	// 邀请码是否确认过
	useEffect(() => {
		if (invitationConfirmed) {
			setIsClaimed(true);
		}
	}, [invitationConfirmed]);

	return (
		<>
			{visible && (
				<>
					<div
						className={`fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/80 transition-opacity duration-300 ${
							isOpen ? 'opacity-100' : 'opacity-0'
						}`}
					>
						<div className="w-full px-4">
							<div className="relative flex w-full items-stretch">
								<img
									className="absolute top-1/2 min-h-64 -translate-y-1/2"
									src={'/img/bg-popup.png'}
								/>
								<div className="relative z-10 flex w-full flex-col items-center justify-center px-3 pb-7 pt-6">
									<div className="relative flex w-full items-end justify-end">
										<img
											src="/img/icon/close.svg"
											alt="close"
											className="w-6"
											onClick={onClose}
										/>
										<div className="absolute left-1/2 -translate-x-1/2 text-center font-jamjuree text-lg font-semibold text-white">
											{title}
										</div>
									</div>

									<div className="flex w-full flex-col items-center justify-center px-7">
										{/* description */}
										<div className="mb-3 mt-5 w-full text-center font-jamjuree text-sm font-normal text-white">
											{description}
										</div>
										{
											<ReferralCode
												ref={ref}
												invitationCode={invitationCode}
												invitationMsg={invitationMsg}
												onValueChange={val => handleChangeVal(val)}
												onComplete={() => {}}
											/>
										}

										{/* claim button */}
										<button
											className="relative mt-6 h-12 w-full"
											onClick={() => handleClaim()}
											disabled={isClaimed}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-full"
												viewBox="0 0 320 48"
												fill={isClaimed ? '#747d8c' : '#FFF'}
											>
												<path
													d="M0.5 2.93617L20.9255 0H54.9681H284.755H303.479H320.5V4.21277V42.5106V45.2553L303.479 48H269.436H53.266H18.3723H0.5V42.383V6.12766V2.93617Z"
													fill={isClaimed ? '#747d8c' : '#FFF'}
												/>
											</svg>
											<div className="absolute left-1/2 top-1/2 flex w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2">
												<div className="text-center font-chakra text-base font-semibold uppercase tracking-wide text-black">
													Claim 500
												</div>
												<img
													src="/img/icon/coin.svg"
													alt="coin"
													className="w-4"
												/>
											</div>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default InvitePop;
