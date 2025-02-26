import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { MAIL_SVG } from '../../../assets/logo/mail.svg';
import { CHECK_SVG } from '@/assets/icon/check.svg';
import { GOOGLE_SVG } from '@/assets/logo/google.svg';
import { setAccount } from '@/store/slices/accountInfoSlice';
import { AccountType } from '@/types/rainbowkit.type';
import CustomConnectButton from '../CustomConnectButton/CustomConnectButton';
import { useAccount } from 'wagmi';
import { useRouter, usePathname } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { UserInfo } from '@/types/user.type';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import isMobile from '@/lib/isMobile';
import { setCookie } from 'cookies-next';
import { LoaderCircle } from 'lucide-react';
import fetchAPI from '@/lib/api';
import {
	mockTelegramEnv,
	parseInitData,
	postEvent,
	retrieveLaunchParams,
} from '@telegram-apps/sdk';
import { useToastContext } from '../ToastModal/ToastContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';

interface LoginDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

const LoginDrawer: React.FC<LoginDrawerProps> = ({ isOpen, onClose }) => {
	const [visible, setVisible] = useState(isOpen);
	const [agree, setAgree] = useState<boolean>(true);
	const dispatch = useDispatch();
	// const wagmiAccount = useAccount();
	const router = useRouter();
	const { address: pcAddress } = useWallet();
	const [loading, setLoading] = useState(false);
	const [tgLoading, setTgLoading] = useState(false);
	const { showRouterLoading } = useRouterLoadingContext();

	const isH5 = typeof window !== 'undefined' && isMobile();
	const { showToast } = useToastContext();

	const wallet = useSelector((state: RootState) => state.wallet);

	useEffect(() => {
		if (isOpen) {
			setVisible(true);
		} else {
			const timer = setTimeout(() => setVisible(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	// const handleGoogleSignIn = async () => {
	// 	try {
	// 		const result = await signIn('google', { callbackUrl: '/roles/v1' });
	// 		if (result?.url) {
	// 			window.location.href = result.url;
	// 		}
	// 	} catch (error) {
	// 		enqueueSnackbar('Failed to sign in with Google', { variant: 'error' });
	// 	}
	// };

	/* tg 登录 */
	const signInWithTelegram = async () => {
		let telegramId = 0;
		let initDataRawData = '';
		try {
			const { initData, initDataRaw } = retrieveLaunchParams();
			telegramId = initData.user?.id;
			initDataRawData = initDataRaw;
		} catch (error) {
			showToast('Please open the page in telegram miniapp', 'error');
			return;
		}
		setTgLoading(true);

		const result = await fetchAPI('/api/auth/callback/tg', {
			method: 'POST',
			body: {
				initDataRaw: initDataRawData,
			},
		});
		console.log('info....', result);
		if (result?.Authorization) {
			setCookie('Authorization', result.Authorization, {
				maxAge: 14 * 24 * 60 * 60,
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
			});
		}
		if (result?.userInfo) {
			console.log(112, result.userInfo);

			dispatch(
				setAccount({
					id: result.userInfo.id,
					accountId: result.userInfo.accountId,
					email: result.userInfo.email || undefined,
					wallet: result.userInfo.wallet || undefined,
					googleId: result.userInfo.googleId || undefined,
					createdAt: result.userInfo.createdAt || new Date().toISOString(),
					lastLogin: result.userInfo.lastLogin || new Date().toISOString(),
					invitationCode: result.userInfo.invitationCode,
					inviterDisplay: result.userInfo.inviterDisplay || undefined,
					type: 'thirdParty',
				}),
			);
		}

		setTgLoading(false);
		if (result?.error) {
			throw new Error(result.error);
		}
		showRouterLoading('/roles/v1');
		router.push('/roles/v1');
	};

	const signInWithWallet = async (wallet: string, chainId: string) => {
		if (!agree) {
			showToast('Please agree to the terms and conditions', 'info');
			return;
		}
		if (!wallet) {
			// if (!wagmiAccount.address) {
			enqueueSnackbar('Please connect your wallet first', {
				variant: 'warning',
			});
			return;
		}
		try {
			setLoading(true);

			// const result = await signIn('credentials', {
			// 	wallet: wallet,
			// 	chainId,
			// 	redirect: false,
			// });
			const result = await fetchAPI('/api/auth/callback/tron_wallet', {
				method: 'POST',
				body: {
					wallet,
					chainId,
				},
			});
			console.log(129, result);

			if (result?.Authorization) {
				setCookie('Authorization', result.Authorization, {
					maxAge: 14 * 24 * 60 * 60,
					path: '/',
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
				});
			}
			if (result?.userInfo) {
				console.log(112, result.userInfo);

				dispatch(
					setAccount({
						id: result.userInfo.id,
						accountId: result.userInfo.accountId,
						email: result.userInfo.email || undefined,
						wallet: result.userInfo.wallet || undefined,
						googleId: result.userInfo.googleId || undefined,
						createdAt: result.userInfo.createdAt || new Date().toISOString(),
						lastLogin: result.userInfo.lastLogin || new Date().toISOString(),
						invitationCode: result.userInfo.invitationCode,
						inviterDisplay: result.userInfo.inviterDisplay || undefined,
						type: 'thirdParty',
					}),
				);
			}

			setLoading(false);
			if (result?.error) {
				throw new Error(result.error);
			}
			console.log(131);

			// enqueueSnackbar('Login Successfully', { variant: 'success' });
			router.push('/roles/v1');
		} catch (error) {
			enqueueSnackbar((error as Error).message, { variant: 'error' });
		}
	};

	return (
		<>
			{visible && (
				<>
					<div
						className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
							isOpen ? 'opacity-100' : 'opacity-0'
						}`}
					>
						<div
							className="fixed inset-0 bg-black bg-opacity-50"
							onClick={onClose}
						></div>
						<div
							className={`flex h-screen w-full transform flex-col gap-8 bg-white bg-bg-purple bg-cover p-4 transition-transform duration-300 sm:w-3/4 sm:max-w-[520px] lg:w-1/2 ${
								isOpen ? 'translate-y-0' : 'translate-y-full'
							}`}
							onClick={e => e.stopPropagation()}
						>
							{/* 链接钱包 */}
							<h2 className="mb-4 text-center text-lg font-bold text-white">
								LOG IN
							</h2>
							<div className="flex w-full flex-col gap-4">
								<div className="flex w-full justify-between">
									<CustomConnectButton
										bgColor="#FF0000"
										text="Connect Wallet"
										textColor="#FFF"
										isShowIcon={false}
									/>
								</div>
							</div>
							{/* 钱包登录 */}
							{wallet?.address && (
								// <div
								// 	className="relative m-auto mt-36 w-80 cursor-pointer"
								// 	onClick={() => signInWithWallet(address, 728126428)}
								// >
								// 	<img className="h-16" src="/img/bg-dotted.png"></img>
								// 	<div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
								// 		<span className="text-white">LOG IN</span>
								// 		{loading && (
								// 			<LoaderCircle className="ml-3 animate-spin" color="white" />
								// 		)}
								// 	</div>
								// </div>

								<div
									className="absolute left-1/2 top-[38%] w-80 translate-x-[-50%] translate-y-[-50%] cursor-pointer"
									onClick={() => signInWithWallet(wallet?.address, '728126428')}
								>
									<img className="h-16" src="/img/bg-dotted.png"></img>
									<div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
										<div className="relative flex w-full items-center justify-center gap-1">
											<span className="w-64 text-center text-xl font-bold uppercase text-white">
												Log In
											</span>
											{loading && (
												<LoaderCircle
													className="absolute right-[25%] animate-spin"
													color="white"
												/>
											)}
										</div>
									</div>
								</div>
								// <div
								// 	className="bg-bg-dotted h-16 w-[322px] bg-cover text-white"
								// 	// className="flex h-16 w-full items-center justify-center gap-8 rounded-full bg-custom-purple-006 px-16 py-2 font-semibold text-white"
								// 	onClick={() => {
								// 		signInWithWallet(address, 728126428);
								// 		// signInWithWallet(wagmiAccount.address!, wagmiAccount.chainId!);
								// 	}}
								// >
								// 	LOG IN
								// </div>
							)}

							{/* tg 登录 */}
							<div
								className="absolute left-1/2 top-1/2 w-80 translate-x-[-50%] translate-y-[-50%] cursor-pointer"
								onClick={() => signInWithTelegram()}
							>
								<img className="h-16" src="/img/bg-dotted.png"></img>
								<div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2">
									<div className="relative flex w-full items-center justify-center gap-1">
										<span className="w-64 text-center text-xl font-bold uppercase text-white">
											Log In With Telegram
										</span>
										{tgLoading && (
											<LoaderCircle
												className="absolute right-[-10%] animate-spin"
												color="white"
											/>
										)}
									</div>
								</div>
							</div>

							{/* <div className="my-2 flex items-center">
							<div className="flex-grow border-t border-gray-400"></div>
							<span className="mx-4 flex-shrink text-gray-500">OR</span>
							<div className="flex-grow border-t border-gray-400"></div>
						</div> */}
							{/* <div className="flex flex-col gap-4">
							<button
								onClick={handleGoogleSignIn}
								className="flex h-16 items-center gap-8 rounded-full bg-gray-100 px-16 py-2 font-semibold"
							>
								<Image
									src={GOOGLE_SVG}
									width={24}
									height={24}
									alt="Google Account"
								/>
								Google Account
							</button>
							<button className="flex h-16 items-center gap-8 rounded-full bg-gray-100 px-16 py-2 font-semibold">
								<Image src={MAIL_SVG} width={24} height={24} alt="Mail" />
								MAIL
							</button>
						</div> */}
							<div className="absolute bottom-8 flex items-center gap-4 px-4 text-white">
								<Image
									className={agree ? 'bg-green-600' : 'bg-gray-300'}
									src={CHECK_SVG}
									width={20}
									height={20}
									alt="check"
									onClick={() => {
										setAgree(!agree);
									}}
								/>
								I have agreed to the terms, conditions, and privacy policy.
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default LoginDrawer;
