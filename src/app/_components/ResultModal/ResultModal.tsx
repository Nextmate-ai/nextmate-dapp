import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

interface ResultModalProps {
	isOpen: boolean;
	content: React.ReactNode;
	confirmText: string;
	onClose: () => void;
	handleConfirm: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
	isOpen,
	content,
	confirmText = 'Confirm',
	onClose,
	handleConfirm,
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
			<div className="relative flex h-full w-full flex-col items-center justify-center">
				<div className="relative w-full">{content}</div>
				<button className="relative w-64" onClick={handleConfirm}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="241"
						height="60"
						viewBox="0 0 241 60"
						fill="none"
					>
						<path
							d="M0.5 3.67021L15.8192 0H41.3511H213.691H227.734H240.5V5.26596V53.1383V56.5691L227.734 60H202.202H40.0745H13.9043H0.5V52.9787V7.65957V3.67021Z"
							fill="#E0423B"
						/>
					</svg>
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-jamjuree text-xl font-semibold text-white">
						{confirmText}
					</div>
				</button>
			</div>
		</animated.div>
	);
};

export default ResultModal;
