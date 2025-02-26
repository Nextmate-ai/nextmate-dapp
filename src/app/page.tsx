'use client';

import { useEffect, useState } from 'react';
// import Image from 'next/image';
import SliderButton from './_components/SliderButton/SliderButton';
import LoginDrawer from './_components/LoginDrawer/LoginDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { setAccount } from '@/store/slices/accountInfoSlice';
import { RootState } from '@/store/store';
import { useAccount } from 'wagmi';
import { useRouter, usePathname } from 'next/navigation';
import {
	mockTelegramEnv,
	parseInitData,
	postEvent,
	retrieveLaunchParams,
} from '@telegram-apps/sdk';
import { enqueueSnackbar } from 'notistack';
import fetchAPI from '@/lib/api';
import { setCookie } from 'cookies-next';
import PreloadImages from './_components/PreloadImages/PreloadImags';
import { LoaderCircle } from 'lucide-react';
import { useRoleList } from '@/hooks/useRoleList';
import { usePreloadImage } from '@/hooks/usePreloadImage';
import { fetchBalance } from '@/lib/balanceApi';
import { useUserBalance } from '@/hooks/useBalance';
import { useCharacterEquipment } from '@/hooks/useUserEquipment';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';
import { useToastContext } from './_components/ToastModal/ToastContext';
import { useWalletModal } from './_components/WalletModal/WalletModalContext';

export default function Home() {
	const [images, setImages] = useState([
		'/img/chat-talk.png',
		'/img/bg-roles-btn.png',
		'/img/sundog.png',
		'/img/lucy.png',
		'/img/dragon.png',
		'/img/afro.png',
		'/img/fud.png',
		'/img/equipment.png',
		'/img/Avatar3_SunDog.png',
		'/img/Avatar1_Lucy.png',
		'/img/Avatar_Dragon.png',
		'/img/Avatar1_Afro.png',
		'/img/Avatar_MunCat.png',
		'/img/Avatar_Fud.png',
		'/img/Avatar_Pepe.png',
		'/img/SunDog-background.png',
		'/img/Dragon-background.png',
		'/img/Lucy-background.png',
		'/img/MunCat-background.png',
		'/img/Afro-background.png',
		'/img/Fud-background.png',
		'/img/pepe-background.png',
		'/img/bg-purple.jpg',
		'/img/bg-profile.png',
		'/img/home-login-btn.png',
		'/img/top-up.png',
		'/img/save-btn.png',
		'/img/roulette/bg-roulette.png',
		'/img/roulette/USDT0.1.png',
		'/img/roulette/USDT1.png',
		'/img/roulette/USDT50.png',
		'/img/roulette/DIAMOND100.png',
		'/img/roulette/GOLD50.png',
		'/img/roulette/GOLD200.png',
		'/img/roulette/GOLD1000.png',
		'/img/roulette/SUNDOG10.png',
		'/img/roulette/SUNDOG100.png',
		'/img/roulette/SUNDOG500.png',
		'/img/roulette/SUNDOG1000.png',
		'/img/roulette/SUNDOG3000.png',
		'/img/roulette/SUNDOG10000.png',
		'/img/roulette/TRX1.png',
		'/img/roulette/TRX10.png',
		'/img/roulette/TRX50.png',
		'/img/roulette/TRX100.png',
		'/img/roulette/TRX1000.png',
		'/img/roulette/TRX10000.png',
		'/img/roulette/MOE10.png',
		'/img/roulette/MOE100.png',
		'/img/roulette/MOE1000.png',
		'/img/roulette/MOE10000.png',
		'/img/roulette/HIPPO10.png',
		'/img/roulette/HIPPO100.png',
		'/img/roulette/HIPPO1000.png',
		'/img/roulette/HIPPO10000.png',
		'/img/roulette/HIPPO100000.png',
		'/img/roulette/outfit.png',
		'/img/roulette/SUNDOG_HAT.png',
		'/img/icon/diamond.svg',
		'/img/icon/coin.svg',
		'/img/icon/energy.svg',
		'/img/icon/equipment.svg',
		'/img/icon/coming-soon.svg',
		'/img/icon/add-btn.svg',
		'/img/icon/wallet.svg',
		'/img/wallet/wallet-tronlink.png',
		'/img/wallet/wallet-okx.png',
		'/img/icon/chat.svg',
		'/img/icon/vote.svg',
		'/img/icon/vote-ring.gif',
		'/img/vote-to-earn.png',
		'/img/bg-toast.png',
		'/img/icon/close.svg',
		'/img/bg-popup.png',
		'/img/TRX.png',
		'/img/logo/moe.png',
		'/img/logo/hippo.png',
		'/img/logo/sundog.png',
		'/img/logo/sunpump.png',
		'/img/roulette/red-roulette.png',
		'/img/roulette/red-point.png',
		'/img/roulette/gray-roulette.png',
		'/img/roulette/gray-point.png',
		'/img/roulette/blue-roulette.png',
		'/img/roulette/blue-point.png',
		'/img/bg-red.png',
		'/img/bg-blue.png',
		'/img/bg-gray.png',
		'/img/red-btn.png',
		'/img/gray-btn.png',
		'/img/blue-btn.png',
		'/img/SUNDOG-token.png',
		'/img/Moe-token.png',
		'/img/Hippo-token.png',
		'/img/moe-spin.png',
		'/img/hippo-spin.png',
		'/img/connect-wallet-bg.png',
		'/img/wallet/wallet-okx.png',
		'/img/wallet/wallet-uxuy.png',
		'/img/wallet/wallet-tronlink.png',
		'/img/chain/sui.png',
		'/img/chain/base.png',
		'/img/chain/solana.png',
		'/img/sundog-spin-result.png',
		'/img/equipment/Superman.png',
		'/img/equipment/Dragon.png',
		'/img/equipment/Pink Cape.png',
		'/img/equipment/pepe-knight.png',
		'/img/equipment/pepe-pharaoh.png',
		'/img/equipment/pepe-wizard.png',
		'/img/sundog_Dragon.png',
		'/img/sundog_Pink Cape.png',
		'/img/sundog_Superman.png',
		'/img/sundog-spin.png',
		'/img/pepe_pepe-knight.png',
		'/img/pepe_pepe-pharaoh.png',
		'/img/pepe_pepe-wizard.png',
		'/img/pepe_pepe-knight.jpeg',
		'/img/pepe_pepe-pharaoh.jpeg',
		'/img/pepe_pepe-wizard.jpeg',
		'/img/pepe-pure.png',
		'/img/pepe.png',
		'/img/sunpump-spin.png',
		'/img/moe-spin-result.png',
		'/img/bg-vote-meme.png',
		'/img/bg-vote-meme-full.png',
		'/img/slag/pepe/slag-bg.png',
		'/img/slag/pepe/cd.png',
		'/img/slag/pepe/pepe-sprites.png',
		'/img/profile-top.png',
	]);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [tgLoading, setTgLoading] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();
	const account = useSelector((state: RootState) => state.accountInfo).account;
	const { characters = [], reload } = useRoleList();
	const { isLoadingImage, preloadImages } = usePreloadImage(images);
	const { data: balanceData, reload: reloadBalance } = useUserBalance();
	const { data: characterEquipment, isLoading: isLoadingCharacterEquipment } =
		useCharacterEquipment(characters[0]?.id);
	const { isOpen, openModal } = useWalletModal();
	const { showRouterLoading } = useRouterLoadingContext();

	const { showToast } = useToastContext();
	const handleButtonClick = async () => {
		setIsLoginOpen(true);
	};

	const handleClose = () => {
		setIsLoginOpen(false);
	};

	if (process.env.NEXT_PUBLIC_NODE_ENV === 'local') {
		const initDataRaw = new URLSearchParams([
			[
				'user',
				JSON.stringify({
					id: 6550434311, // tg id 添加 @RawDataBot 机器人获取 message.chat.id
					first_name: 'John',
					last_name: 'Kevin',
					username: 'Kevin_Flare',
					language_code: 'en',
					is_premium: false,
					allows_write_to_pm: true,
					photo: {
						small_file_id: 'AQADAQADuasxG102yUYACAIAAweyb4YBAAMMQW2bK0EhOTUE',
						small_file_unique_id: 'AQADuasxG102yUYAAQ',
						big_file_id: 'AQADAQADuasxG102yUYACAMAAweyb4YBAAMMQW2bK0EhOTUE',
						big_file_unique_id: 'AQADuasxG102yUYB',
					},
				}),
			],
			[
				'hash',
				'89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31',
			],
			['auth_date', '1716922846'],
			['start_param', 'debug'],
			['chat_type', 'sender'],
			['chat_instance', '8428209589180549439'],
		]).toString();

		mockTelegramEnv({
			themeParams: {
				accentTextColor: '#6ab2f2',
				bgColor: '#17212b',
				buttonColor: '#5288c1',
				buttonTextColor: '#ffffff',
				destructiveTextColor: '#ec3942',
				headerBgColor: '#17212b',
				hintColor: '#708499',
				linkColor: '#6ab3f3',
				secondaryBgColor: '#232e3c',
				sectionBgColor: '#17212b',
				sectionHeaderTextColor: '#6ab3f3',
				subtitleTextColor: '#708499',
				textColor: '#f5f5f5',
			},
			initData: parseInitData(initDataRaw),
			initDataRaw,
			version: '7.2',
			platform: 'tdesktop',
		});
	}

	useEffect(() => {
		signInWithTelegram();
	}, []);

	/* tg 登录 */
	const signInWithTelegram = async () => {
		let telegramId = 0;
		let tgUsername = '';
		let initDataRawData = '';
		try {
			const { initData, initDataRaw } = retrieveLaunchParams();
			telegramId = initData.user?.id;
			tgUsername = initData.user?.username;
			initDataRawData = initDataRaw;
		} catch (error) {
			showToast('Please open the page in telegram miniapp', 'info');
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
			await reloadBalance();
			await reload();
		}

		setTgLoading(false);
		if (result?.error) {
			throw new Error(result.error);
		}
		// enqueueSnackbar('Login Successfully', { variant: 'success' });
	};

	const handleLoginClick = () => {
		if (isLoadingImage || tgLoading || isLoadingCharacterEquipment) {
			return;
		}
		if (account && account.id) {
			showRouterLoading('/roles/v1');
			router.push('/roles/v1');
		} else {
			signInWithTelegram()
				.then(() => {
					showRouterLoading('/roles/v1');
					router.push('/roles/v1');
				})
				.catch(error => {
					showToast(error, 'error');
				});
		}
	};

	return (
		<>
			{/* <div className="flex h-full w-full flex-col justify-between pb-10"> */}
			<div className="relative">
				<img className="h-screen w-full" src="/img/home-bg.jpeg" />

				<button
					className={`absolute bottom-14 left-1/2 h-24 w-80 -translate-x-1/2 transform cursor-pointer bg-bg-home-login-btn ${!isLoadingImage && !tgLoading ? '' : 'grayscale-[99%]'} bg-[length:100%_100%] bg-no-repeat`}
					onClick={() => {
						handleLoginClick();
					}}
				>
					<div className="w-full text-center font-chakra text-[32px] font-semibold text-white">
						Start
					</div>
					{(isLoadingImage || tgLoading || isLoadingCharacterEquipment) && (
						<LoaderCircle
							className="absolute right-[25%] top-[38%] animate-spin"
							color="white"
						/>
					)}
				</button>

				{/* 预加载 roles 的 character 图片 */}
				<PreloadImages loading={isLoadingImage} preloadImages={preloadImages} />
				{/* <div className="relative z-10 h-[480px] rounded-b-[25px] bg-custom-purple-005 390:h-[600px]">
					<div className="absolute left-0 top-6">
						<img
							src={'/img/boy_1.png'}
							className="w-[220px] 390:w-[260px]"
							alt="charlie avatar"
						/>
					</div>
					<div className="absolute right-0 top-16">
						<img
							src={'/img/girl_1.png'}
							className="w-[210px] 390:w-[255px]"
							alt="charlie avatar"
						/>
					</div>
					<div className="absolute bottom-0 left-1/2 flex w-full -translate-x-1/2 transform justify-center">
						<img
							src={'/img/girl_2.png'}
							className="w-[210px] 390:w-[300px]"
							alt="charlie avatar"
						/>
					</div>
				</div> */}
				{/* <div className="mx-auto mt-[-126px] h-[250px] w-[250px] rounded-full bg-custom-purple-005 pt-[130px] text-center text-white 390:mt-[-150px] 390:h-[300px] 390:w-[300px] 390:pt-[160px]">
					<div className="text-lg 390:text-hd2">Welcome To</div>
					<div className="text-[34px] 390:text-hd1">Nextmate.AI</div>
				</div> */}
			</div>
			{/* <SliderButton
				onClick={async () => {
					await handleButtonClick();
				}}
			/> */}
			{/* <LoginDrawer isOpen={isLoginOpen} onClose={handleClose} /> */}
			{/* </div> */}
		</>
	);
}
