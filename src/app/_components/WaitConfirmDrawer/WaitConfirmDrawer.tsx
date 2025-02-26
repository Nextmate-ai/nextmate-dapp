import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Lottie from 'react-lottie-player';
import voteConfirmJson from '@/assets/animation/vote-confirm.json';

interface WaitConfirmProps {
	isOpen: boolean;
	title?: string;
	content?: string;
	image?: string;
	json?: any;
	scale?: number;
	onClose: () => void;
}

const WaitConfirmDrawer: React.FC<WaitConfirmProps> = ({
	isOpen,
	title = 'Recharge in progress!',
	content = 'If you complete your transaction, it will take about 1 minute for on-chain confirmation.',
	image = '',
	json = voteConfirmJson,
	scale = 1,
	onClose,
}) => {
	const animation = useSpring({
		opacity: isOpen ? 1 : 0,
		transform: isOpen ? 'scale(1)' : 'scale(0.9)',
		config: { tension: 500, friction: 20 },
	});

	if (!isOpen) return null;
	return (
		<animated.div
			style={animation}
			className="fixed inset-0 z-50 h-screen max-h-screen w-full flex-col bg-black/80 bg-cover"
			onClick={e => {
				e.stopPropagation();
				onClose();
			}}
		>
			<div className="relative flex h-full w-full flex-col items-center justify-start">
				{image && (
					<img
						src={image}
						alt="collect"
						className="absolute left-1/2 top-[20%] w-44 -translate-x-1/2"
					/>
				)}
				{!image && json && (
					<Lottie
						animationData={json}
						play
						loop
						className="absolute left-1/2 top-[20%] w-44 -translate-x-1/2 scale-90"
						style={{ transform: `translateX(-50%) scale(${scale})` }}
					/>
				)}
				<div className="absolute left-1/2 top-[45%] w-full -translate-x-1/2 text-center font-jamjuree text-3xl font-semibold text-[#ffe715]">
					{title}
				</div>
				<div className="absolute left-1/2 top-[52%] w-full -translate-x-1/2 px-5 text-center font-jamjuree text-lg font-medium text-white">
					{content}
				</div>
			</div>
		</animated.div>
	);
};

export default WaitConfirmDrawer;
