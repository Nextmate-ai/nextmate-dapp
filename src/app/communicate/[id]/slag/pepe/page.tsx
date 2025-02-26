'use client';

import React, { useState, useRef, useEffect } from 'react';
// import './Record.css';
import GifPlayer from './GifPlayer';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserBalance } from '@/hooks/useBalance';
import './pepe.css';

const Record = () => {
	const [rotation, setRotation] = useState(0);
	const recordRef = useRef<any>(null);
	const isDragging = useRef(false);
	const startAngle = useRef(0);
	const router = useRouter();
	const balanceData = useUserBalance();
	const [showText, setShowText] = useState(true);
	const [currentSongIndex, setCurrentSongIndex] = useState(1);
	const totalSongs = 7;

	// 创建一个音频对象
	const audioRef = useRef<HTMLAudioElement | null>(null);
	useEffect(() => {
		if (typeof window !== 'undefined') {
			audioRef.current = new Audio(`/audio/pop${currentSongIndex}.mp3`);
			audioRef.current.load();
		}
	}, [currentSongIndex]);

	const playDisco = async () => {
		if (audioRef.current) {
			try {
				// 设置音量为较小的值
				// audioRef.current.volume = 0.3;
				audioRef.current.currentTime = 0;
				await audioRef.current.play();
			} catch (error) {
				// 静默处理错误，因为这可能是预期的行为
				console.debug('音频播放等待用户交互', error);
			}
		}
	};

	const stopDisco = () => {
		if (audioRef.current) {
			audioRef.current.pause();
		}
	};

	useEffect(() => {
		const record = recordRef.current;
		if (!record) return;

		// 添加 touch-action: none 样式
		record.style.touchAction = 'none';
		record.style.userSelect = 'none';
		record.style.webkitUserSelect = 'none';
		record.style.webkitTouchCallout = 'none';

		let startX = 0;
		let startY = 0;
		let touchStartTime = 0;

		const getAngle = (x: number, y: number) => {
			const rect = record.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			return (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI;
		};

		// 触摸事件处理
		const handleTouchStart = (e: TouchEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (e.touches?.length > 0) {
				const touch = e.touches[0];
				startX = touch.clientX;
				startY = touch.clientY;
				touchStartTime = Date.now();

				setShowText(false);
				isDragging.current = true;
				startAngle.current = getAngle(touch.clientX, touch.clientY) - rotation;
				playDisco();
			}
		};

		const handleTouchMove = (e: TouchEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (e.touches?.length > 0 && isDragging.current) {
				const touch = e.touches[0];
				const currentAngle = getAngle(touch.clientX, touch.clientY);
				let newRotation = currentAngle - startAngle.current;
				if (newRotation < 0) newRotation += 360;
				setRotation(newRotation);
			}
		};

		const handleTouchEnd = (e: TouchEvent) => {
			if (!e.changedTouches[0]) return;

			const touch = e.changedTouches[0];
			const deltaX = touch.clientX - startX;
			const deltaY = touch.clientY - startY;
			const touchDuration = Date.now() - touchStartTime;
			console.log('deltaX', deltaX);
			console.log('deltaY', deltaY);
			console.log('touchDuration', touchDuration, Math.abs(deltaX) > 150);
			// 判断是否为水平滑动

			console.log('Swipe detected!');
			if (Math.abs(deltaX) > 150) {
				handleNextSong();
				console.log('Swiping right - Previous song');
			} else {
				console.log('Swiping left - Next song');
				handlePrevSong();
			}

			isDragging.current = false;
			stopDisco();
		};

		// 切换歌曲的处理函数
		const handlePrevSong = () => {
			setCurrentSongIndex(prev => {
				if (prev === 1) return totalSongs; // 如果是第一首，切换到最后一首
				return prev - 1;
			});
			// 重置旋转角度
			setRotation(0);
			// 播放新的音频
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = new Audio(`/audio/pop${currentSongIndex}.mp3`);
				audioRef.current.load();
			}
		};

		const handleNextSong = () => {
			setCurrentSongIndex(prev => {
				if (prev === totalSongs) return 1; // 如果是最后一首，切换到第一首
				return prev + 1;
			});
			// 重置旋转角度
			setRotation(0);
			// 播放新的音频
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = new Audio(`/audio/pop${currentSongIndex}.mp3`);
				audioRef.current.load();
			}
		};

		// 添加触摸事件监听器
		record.addEventListener('touchstart', handleTouchStart, { passive: false });
		document.addEventListener('touchmove', handleTouchMove, { passive: false });
		document.addEventListener('touchend', handleTouchEnd, { passive: false });
		document.addEventListener('touchcancel', handleTouchEnd, {
			passive: false,
		});

		return () => {
			// 清理样式
			record.style.touchAction = '';
			record.style.userSelect = '';
			record.style.webkitUserSelect = '';
			record.style.webkitTouchCallout = '';

			record.removeEventListener('touchstart', handleTouchStart);
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('touchend', handleTouchEnd);
			document.removeEventListener('touchcancel', handleTouchEnd);
		};
	}, [rotation]);

	return (
		<div className="relative h-full overflow-hidden bg-bg-slag-pepe bg-cover">
			{/* 顶部栏，包含金币数量 */}
			<div className="absolute top-0 z-10 flex w-full items-center justify-between bg-opacity-100 p-4">
				<div className="w-[75px]">
					<ChevronLeft
						color="white"
						onClick={() => {
							router.back();
						}}
					/>
				</div>
				<span className="text-white">Pepe</span>
				<div className="flex justify-center rounded-xl border border-gray-300 px-4 py-1">
					<img src={'/img/icon/energy.png'} width={24} height={24} />
					<div className="ml-2 text-white">{balanceData?.data?.energy}</div>
				</div>
			</div>
			{/* 聚光灯效果 */}
			<div className="wrapper">
				<div className="stage_highlight_purple"></div>
				<div className="spotlight_swivel_purple">
					<div className="lamp_purple"></div>
				</div>

				<div className="stage_highlight_blue"></div>

				<div className="spotlight_swivel_blue">
					<div className="lamp_blue"></div>
				</div>
			</div>
			{/* pepe */}
			<div className="absolute inset-0 flex items-center justify-center">
				<GifPlayer rotation={rotation} />
			</div>
			{/* 互动文字 */}
			{showText && (
				<div className="floating-text absolute inset-0 top-[69vh] w-full text-center text-[18px] font-semibold text-white">
					Spin the disc to begin
				</div>
			)}
			{/* 转盘 */}
			<div className="absolute inset-0 top-[70vh] flex h-52 items-center justify-center overflow-hidden">
				<img
					src="/img/slag/pepe/cd.png"
					ref={recordRef}
					className="w-40 origin-center"
					style={{ transform: `rotate(${rotation}deg)` }}
				/>
			</div>
			<div className="absolute bottom-4 left-0 w-full text-center text-xs text-white">
				Music generated by{' '}
				<a href="https://mubert.com/render" className="underline">
					Mubert
				</a>
			</div>
		</div>
	);
};

export default Record;
