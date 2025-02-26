import { LoaderCircle, X } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import { parseUnits } from 'viem';

interface DialogProps {
	isOpen: boolean;
	content: string;
	onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, content, onClose }) => {
	const animation = useSpring({
		opacity: isOpen ? 1 : 0,
		transform: isOpen ? 'scale(1)' : 'scale(0.9)',
		config: { tension: 500, friction: 20 },
	});

	useEffect(() => {
		setTimeout(() => {
			onClose();
		}, 3000);
	}, [isOpen]);

	if (!isOpen) return null;
	return (
		// mask
		<animated.div
			style={animation}
			className="fixed inset-0 z-50 h-screen max-h-screen w-full flex-col"
		>
			<div
				className="relative flex h-full w-full flex-col items-center justify-center px-3"
				onClick={onClose}
			>
				<div className="relative">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="120"
						height="120"
						viewBox="0 0 120 120"
						fill="none"
					>
						<g filter="url(#filter0_b_2974_13978)">
							<path
								d="M15 0H30H60H120V60V90V105L105 120H90H60H0V60V30V15L15 0Z"
								fill="black"
							/>
							<path
								d="M0.5 15.2071L15.2071 0.5H30H60H119.5V60V90V104.793L104.793 119.5H90H60H0.5V60V30V15.2071Z"
								stroke="white"
								stroke-opacity="0.5"
							/>
						</g>
						<defs>
							<filter
								id="filter0_b_2974_13978"
								x="-15"
								y="-15"
								width="150"
								height="150"
								filterUnits="userSpaceOnUse"
								color-interpolation-filters="sRGB"
							>
								<feFlood flood-opacity="0" result="BackgroundImageFix" />
								<feGaussianBlur in="BackgroundImageFix" stdDeviation="7.5" />
								<feComposite
									in2="SourceAlpha"
									operator="in"
									result="effect1_backgroundBlur_2974_13978"
								/>
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="effect1_backgroundBlur_2974_13978"
									result="shape"
								/>
							</filter>
						</defs>
					</svg>
					<div className="absolute left-[34px] top-[22px] inline-flex flex-col items-center justify-start gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="49"
							height="48"
							viewBox="0 0 49 48"
							fill="none"
						>
							<path
								d="M42.5 14.0001L18.5 38.0001L7.5 27.0001L10.32 24.1801L18.5 32.3401L39.68 11.1801L42.5 14.0001Z"
								fill="white"
							/>
						</svg>
						<div className="font-['Bai Jamjuree'] text-center text-base font-medium text-white">
							{content}
						</div>
					</div>
				</div>
			</div>
		</animated.div>
	);
};

export default Dialog;
