import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { postEvent } from '@telegram-apps/sdk';

interface WithdrawResultProps {
	isOpen: boolean;
	hashcode: string;
	onClose: () => void;
}

const WithdrawResultPop: React.FC<WithdrawResultProps> = ({
	isOpen,
	hashcode,
	onClose,
}) => {
	const animation = useSpring({
		opacity: isOpen ? 1 : 0,
		transform: isOpen ? 'scale(1)' : 'scale(0.9)',
		config: { tension: 500, friction: 20 },
	});

	const handleConfirm = () => {
		const link = `https://tronscan.org/#/transaction/${hashcode}`;
		postEvent('web_app_open_link', { url: link, try_instant_view: true });
		onClose();
		// window.open(`https://tronscan.io/#/transaction/${hashcode}`, '_blank');
	};

	if (!isOpen) return null;
	return (
		// mask
		<animated.div
			style={animation}
			className="fixed inset-0 z-50 h-screen max-h-screen w-full flex-col bg-black/90 bg-cover"
		>
			<div className="relative flex h-full w-full flex-col items-center justify-center px-3">
				<div className="relative flex w-full flex-col items-center justify-center bg-bg-popup bg-[length:100%_100%] bg-no-repeat">
					<X
						className="absolute right-5 top-5 z-20 h-6 w-6 text-white"
						onClick={e => {
							e.stopPropagation();
							onClose();
						}}
					/>
					<div className="absolute left-1/2 top-5 w-full -translate-x-1/2 text-center font-jamjuree text-lg font-semibold text-white">
						Withdrawal Complete
					</div>
					<div className="mt-20 w-full text-center font-chakra text-base font-normal tracking-wide text-white">
						Your Hash code is:
					</div>
					<div className="mb-8 mt-2 w-[300px] break-words text-center font-chakra text-base font-medium tracking-wide text-white">
						{hashcode}
					</div>
					{/* Confirm */}
					<button className="relative mb-8 w-72" onClick={handleConfirm}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-full"
							viewBox="0 0 321 48"
							fill="none"
						>
							<path
								d="M0.5 2.93617L20.9255 0H54.9681H284.755H303.479H320.5V4.21277V42.5106V45.2553L303.479 48H269.436H53.266H18.3723H0.5V42.383V6.12766V2.93617Z"
								fill="white"
							/>
						</svg>
						<div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center font-chakra text-base font-semibold uppercase tracking-wide text-black">
							Go Confirm
						</div>
					</button>
				</div>
			</div>
		</animated.div>
	);
};

export default WithdrawResultPop;
