import { LoaderCircle, X } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';

interface ApproveProps {
	isOpen: boolean;
	loading: boolean;
	title: string;
	handleApprove: () => void;
	onClose: () => void;
}

const ApprovePop: React.FC<ApproveProps> = ({
	isOpen,
	loading,
	title,
	handleApprove,
	onClose,
}) => {
	const animation = useSpring({
		opacity: isOpen ? 1 : 0,
		transform: isOpen ? 'scale(1)' : 'scale(0.9)',
		config: { tension: 500, friction: 20 },
	});

	const handleClickApprove = () => {
		handleApprove();
		onClose();
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
						className="absolute right-5 top-5 h-6 w-6 text-white"
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							onClose();
						}}
					/>
					<div className="absolute left-1/2 top-5 z-0 w-60 -translate-x-1/2 text-center font-jamjuree text-lg font-semibold text-white">
						Approval Request
					</div>

					{/* connect wallet */}

					<div className="mb-8 mt-[78px] w-72 text-center font-chakra text-base font-normal tracking-wide text-white">
						{title}.
					</div>

					{/* connect wallet */}
					<div className="mb-8 w-72">
						<button
							className="relative flex h-12 w-full items-center justify-center"
							disabled={loading}
							onClick={() => handleClickApprove()}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-full"
								viewBox="0 0 312 50"
								fill="none"
							>
								<path
									d="M0 6.38298C0 4.47049 1.39562 2.84417 3.28594 2.55386L19.1603 0.115887C19.6626 0.0387411 20.1701 0 20.6783 0H53.1064H277.149H295.404H307.612C310.035 0 312 1.96471 312 4.3883V44.2819C312 45.9339 310.81 47.3459 309.182 47.6264L296.247 49.8548C295.686 49.9514 295.118 50 294.549 50H262.213H51.4468H17.4255H5.85106C2.61961 50 0 47.3804 0 44.1489V6.38298Z"
									fill="#FFF"
								/>
							</svg>
							<div className="absolute flex w-full items-center justify-center gap-3">
								<div className="text-center font-jamjuree text-lg font-bold tracking-widest text-black">
									Confirm
								</div>
							</div>
							{loading && (
								<LoaderCircle
									className="absolute right-[5%] w-4 animate-spin"
									color="white"
								/>
							)}
						</button>
					</div>
				</div>
			</div>
		</animated.div>
	);
};

export default ApprovePop;
