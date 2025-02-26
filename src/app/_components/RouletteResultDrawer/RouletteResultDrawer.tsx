import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

interface RouletteHistoryProps {
	isOpen: boolean;
	result: any;
	onClose: () => void;
}

const RouletteHistoryDrawer: React.FC<RouletteHistoryProps> = ({
	isOpen,
	onClose,
	result,
}) => {
	const animation = useSpring({
		opacity: isOpen ? 1 : 0,
		transform: isOpen ? 'scale(1)' : 'scale(0.9)',
		config: { tension: 500, friction: 20 },
	});

	const getPrizeImage = (type: string) => {
		switch (type) {
			case 'DIAMOND':
				return `/img/icon/diamond.svg`;
			case 'TRON_USDT':
				return `/img/USDT.png`;
			case 'TRX':
				return `/img/TRX.png`;
			case 'MOE':
				return `/img/Moe-token.png`;
			case 'GOLD':
				return `/img/icon/coin.svg`;
			case 'SUNDOG':
				return `/img/SUNDOG-token.png`;
			case 'HIPPO':
				return `/img/Hippo-token.png`;
			case 'SUNDOG_HAT':
				return `/img/SUNDOG-token.png`;
			case 'EQUIPMENT':
				return `/img/equipment.png`;
			default:
				return '/img/icon/coin.svg';
		}
	};

	const getPrizeName = (item: any) => {
		switch (item?.type) {
			case 'DIAMOND':
				return `GEMS`;
			case 'TRON_USDT':
				return `USDT`;
			case 'TRX':
				return `TRX`;
			case 'MOE':
				return `MOE`;
			case 'GOLD':
				return `GOLD COINS`;
			case 'SUNDOG':
				return 'SUNDOG';
			case 'HIPPO':
				return 'HIPPO';
			case 'EQUIPMENT':
				return item.name;
			case 'SUNDOG_HAT':
				return 'SUNDOG HAT';
			default:
				return 'GOLD COINS';
		}
	};

	if (!isOpen) return null;
	return (
		// bg-lottery-mask
		<animated.div
			style={animation}
			className="fixed inset-0 z-50 h-screen max-h-screen w-full flex-col bg-black/90 bg-cover"
			onClick={e => {
				e.stopPropagation();
				onClose();
			}}
		>
			<div className="relative flex h-full w-full flex-col items-center justify-start">
				{/* <div className="popup-board-animate absolute inset-0 h-full w-full"></div> */}
				<div className="relative h-full w-full animate-spin-slow">
					<img
						src="/img/icon/light.svg"
						alt="light"
						className="absolute inset-0 h-full w-full scale-[300%]"
					/>
				</div>

				<X className="absolute right-3 top-3 h-6 w-6 text-white" />
				<div className="absolute left-1/2 top-[14%] w-full -translate-x-1/2 text-center font-jamjuree text-3xl font-medium text-white">
					Lucky You!
				</div>
				<div className="absolute left-1/2 top-[20%] flex w-full -translate-x-1/2 items-center justify-center gap-3">
					<div className="text-center font-jamjuree text-2xl font-normal text-white">
						You have got
					</div>
					<div className="text-center font-jamjuree text-2xl font-semibold text-[#ffe715]">
						{result?.amount} {getPrizeName(result)}
					</div>
				</div>
				<img
					src="/img/roulette/bg-gift.png"
					alt="gift"
					className="absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2"
				/>
				{result?.type && (
					<img
						src={getPrizeImage(result?.type)}
						alt="item"
						className="absolute left-[25%] top-[42%] w-28 origin-top-left rotate-[-12.23deg]"
					/>
				)}
			</div>
		</animated.div>
	);
};

export default RouletteHistoryDrawer;
