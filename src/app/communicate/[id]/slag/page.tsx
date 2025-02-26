'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import fetchAPI from '@/lib/api';
import { enqueueSnackbar } from 'notistack';
import { ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useUserBalance } from '@/hooks/useBalance';
import { useCharacterStories } from '@/hooks/useUserCharacter';
import gifImage from './bg-action-sundog-dynamic.gif'; // 请替换为你的 GIF 文件路径
import Link from 'next/link';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';

const SlagPage = () => {
	const { id: characterId } = useParams();
	const router = useRouter();
	const account = useSelector((state: RootState) => state.accountInfo).account;
	const balanceData = useUserBalance();
	const { data: charactersData } = useCharacterStories();
	const curCharacter = charactersData?.find(
		character => character.id === characterId,
	);
	const { name } = curCharacter || {};
	const [showDynamic, setShowDynamic] = useState(false);
	const [timer, setTimer] = useState(null);
	const [gifSrc, setGifSrc] = useState<any>(gifImage.src);
	const { showRouterLoading } = useRouterLoadingContext();

	useEffect(() => {
		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [timer]);

	// 创建一个音频对象
	const audioRef = useRef<HTMLAudioElement | null>(null);
	useEffect(() => {
		if (typeof window !== 'undefined') {
			audioRef.current = new Audio('/audio/sundog-bark.mp3');
			audioRef.current.load(); // 预加载音频
		}
	}, []);

	const playDogBark = () => {
		if (audioRef.current) {
			audioRef.current.currentTime = 0; // 重置到开始
			audioRef.current
				.play()
				.then(() => console.log('音频播放成功'))
				.catch(error => console.error('播放音频失败:', error));
		}
	};

	const clickSlap = async () => {
		navigator.vibrate =
			typeof window !== 'undefined'
				? navigator.vibrate ||
					// @ts-expect-error xxxx
					navigator.webkitVibrate ||
					// @ts-expect-error xxxx
					navigator.mozVibrate ||
					// @ts-expect-error xxxx
					navigator.msVibrate
				: '';
		if (navigator.vibrate) {
			navigator.vibrate(0);
		}
		if (timer) clearTimeout(timer);

		setShowDynamic(true);
		setGifSrc(gifImage.src + '?t=' + new Date().getTime());

		if (navigator.vibrate) {
			navigator.vibrate(400);
		}
		playDogBark();

		const newTimer = setTimeout(() => {
			setShowDynamic(false);
		}, 2500);
		setTimer(newTimer);

		// const res = await fetchAPI('/api/userCharacter/interact', {
		// 	method: 'POST',
		// 	body: { userCharacterId: characterId, action: 'slap' },
		// });
		// if (res?.success) {

		// } else {
		// 	enqueueSnackbar(res?.msg, { variant: 'error' });
		// }
	};

	return (
		<div className="relative">
			{/* 顶部栏，包含金币数量 */}
			<div className="absolute top-0 z-10 flex w-full items-center justify-between bg-opacity-100 p-4">
				<div className="w-[75px]">
					<Link
						href={`/communicate/${characterId}`}
						onClick={() => showRouterLoading(`/communicate/${characterId}`)}
					>
						<ChevronLeft color="white" />
					</Link>
				</div>
				<span className="text-white">
					{name ? `${name?.charAt(0).toUpperCase()}${name?.slice(1)}` : ''}
				</span>
				<div className="flex justify-center rounded-xl border border-gray-300 px-4 py-1">
					<img src={'/img/icon/energy.png'} width={24} height={24} />
					<div className="ml-2 text-white">{balanceData?.data?.energy}</div>
				</div>
			</div>
			<div className="relative">
				<img className="h-screen w-full" src="/img/bg-slap-sun.jpeg" />
				{!showDynamic && (
					<div className="absolute left-1/2 top-[58%] z-20 -translate-x-1/2 -translate-y-1/2">
						<img
							onClick={clickSlap}
							className="w-[180px]"
							src="/img/click-slap.gif"
						/>
						<div className="text-2xl text-white">Tap to pat him</div>
					</div>
				)}

				<img
					className={`absolute left-1/2 top-1/2 w-[326px] -translate-x-1/2 -translate-y-1/2 ${showDynamic ? 'opacity-0' : 'opacity-100'}`}
					src="/img/bg-action-sundog-static.png"
				/>
				<img
					onClick={clickSlap}
					src={gifSrc}
					className={`absolute left-1/2 top-1/2 w-[326px] -translate-x-1/2 -translate-y-1/2 ${showDynamic ? 'opacity-100' : 'opacity-0'}`}
				/>
			</div>
		</div>
	);
};

export default SlagPage;
