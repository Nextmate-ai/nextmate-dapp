import React from 'react';
import { animated, useSpring, useTransition } from 'react-spring';
import { CircleX } from 'lucide-react';
interface ModalProps {
	isOpen: boolean;
	content: string;
	type?: 'success' | 'error' | 'info';
	position?: 'top' | 'bottom' | 'center';
	onClose: () => void;
}

const ToastModal: React.FC<ModalProps> = ({
	isOpen = false,
	content = 'You have already received.',
	type = 'success',
	position = 'bottom',
	onClose,
}: ModalProps) => {
	const transitions = useTransition(isOpen, {
		from: {
			opacity: 0,
			transform:
				position === 'top'
					? 'translateY(-100%)'
					: position === 'bottom'
						? 'translateY(100%)'
						: 'scale(0.9)', // center 位置使用缩放效果
		},
		enter: {
			opacity: 1,
			transform: position === 'center' ? 'scale(1)' : 'translateY(0%)',
		},
		leave: {
			opacity: 0,
			transform:
				position === 'top'
					? 'translateY(-100%)'
					: position === 'bottom'
						? 'translateY(100%)'
						: 'scale(0.9)',
		},
		config: { tension: 300, friction: 20 },
	});

	return transitions((styles, item) =>
		item ? (
			<animated.div
				style={styles}
				className={`fixed inset-x-0 z-50 flex justify-center ${
					position === 'top'
						? 'top-0'
						: position === 'bottom'
							? 'bottom-16'
							: 'inset-y-0 items-center' // center 位置垂直居中
				}`}
			>
				<div
					className={`${
						position === 'top' ? 'mt-4' : position === 'bottom' ? 'mb-4' : ''
					} w-full px-6`}
				>
					<div className="relative flex w-auto max-w-xs items-stretch shadow-md">
						<img className="absolute h-full w-full" src="/img/bg-toast.png" />

						<div className={`z-10 flex-1 px-3 py-4`}>
							<div className="flex w-full items-center justify-between">
								<div className="flex items-center justify-start gap-3">
									{type === 'success' && (
										<img
											src="/img/icon/check-success.svg"
											alt="check-success"
											className="w-4"
										/>
									)}
									{type === 'error' && <CircleX className="w-4 text-white" />}
									<div className="font-jamjuree text-base font-normal text-white">
										{content}
									</div>
								</div>
								<img
									src="/img/icon/close.svg"
									alt="close"
									className="w-4 cursor-pointer"
									onClick={onClose}
								/>
							</div>
						</div>
					</div>
				</div>
			</animated.div>
		) : null,
	);
};

export default ToastModal;
