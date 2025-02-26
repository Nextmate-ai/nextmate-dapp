import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { postEvent } from '@telegram-apps/sdk';

interface MessageBoxProps {
	isOpen: boolean;
	title: string;
	content: React.ReactNode;
	confirmText: string;
	onClose: () => void;
	onConfirm: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({
	isOpen,
	title,
	content,
	confirmText = 'Confirm',
	onClose,
	onConfirm,
}) => {
	const animation = useSpring({
		opacity: isOpen ? 1 : 0,
		transform: isOpen ? 'scale(1)' : 'scale(0.9)',
		config: { tension: 500, friction: 20 },
	});

	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	if (!isOpen) return null;
	return (
		// mask
		<animated.div
			style={animation}
			className="fixed inset-0 z-50 h-screen max-h-screen w-full flex-col bg-black/80 bg-cover"
		>
			<div className="relative flex h-full w-full flex-col items-center justify-center px-6">
				<div className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-white">
					<div className="absolute inset-0 rounded-lg bg-black/50 blur-lg"></div>
					<div
						className="relative flex h-full w-full flex-col items-center justify-center rounded-lg"
						style={{
							background:
								'linear-gradient(180deg, rgba(110, 103, 246, 0.30) -17.65%, rgba(255, 255, 255, 0.00) 82.35%)',
						}}
					>
						<div className="relative mb-8 mt-6 flex w-full justify-end px-3">
							<div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center font-jamjuree text-lg font-semibold text-white">
								{title}
							</div>
							<X
								className="relative z-20 h-6 w-6 text-white"
								onClick={e => {
									e.stopPropagation();
									onClose();
								}}
							/>
						</div>

						{/* content */}
						<div className="relative z-20 w-full">{content}</div>

						{/* Confirm */}
						<button
							className="relative mx-auto mb-8 w-72"
							onClick={handleConfirm}
						>
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
								{confirmText}
							</div>
						</button>
					</div>
				</div>
			</div>
		</animated.div>
	);
};

export default MessageBox;
