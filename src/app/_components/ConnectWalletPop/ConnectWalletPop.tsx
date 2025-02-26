// vote页面未连接钱包时的弹窗
import { X } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import CustomConnectButton from '../CustomConnectButton/CustomConnectButton';
import { useToastContext } from '../ToastModal/ToastContext';

interface ConnectWalletProps {
	isOpen: boolean;
	title: string;
	content: string;
	btnText: string;
	onClose: () => void;
}

const ConnectWalletPop: React.FC<ConnectWalletProps> = ({
	isOpen,
	title = 'Switch Wallet',
	content = 'Please switch to the wallet used for voting to claim the rewards.',
	btnText = 'Switch Wallet',
	onClose,
}) => {
	const animation = useSpring({
		opacity: isOpen ? 1 : 0,
		transform: isOpen ? 'scale(1)' : 'scale(0.9)',
		config: { tension: 500, friction: 20 },
	});

	const [isShow, setIsShow] = useState(true);
	const { showToast } = useToastContext();

	const checkConnectModalStatus = useCallback((status: boolean) => {
		setIsShow(!status);
	}, []);

	if (!isOpen) return null;
	return (
		// mask
		<animated.div
			style={animation}
			className={`fixed inset-0 z-50 h-screen max-h-screen w-full flex-col bg-black/90 bg-cover ${isShow ? 'opacity-100' : 'opacity-0'}`}
		>
			<div className="relative flex h-full w-full flex-col items-center justify-center px-6">
				<div
					className={`relative flex w-full flex-col items-center justify-center ${isShow ? 'rounded-lg border-2 border-white' : ''}`}
				>
					<div
						className={`absolute inset-0 rounded-lg bg-black/50 blur-lg ${isShow ? 'opacity-100' : 'opacity-0'}`}
					></div>
					<div
						className={`relative flex h-full w-full flex-col items-center justify-center rounded-lg`}
						style={{
							background: isShow
								? 'linear-gradient(180deg, rgba(110, 103, 246, 0.30) -17.65%, rgba(255, 255, 255, 0.00) 82.35%)'
								: 'none',
						}}
					>
						<div
							className={`relative mb-8 mt-6 flex w-full justify-end px-3 ${isShow ? 'opacity-100' : 'opacity-0'}`}
						>
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
						<div
							className={`relative z-20 w-full px-6 text-center text-white ${isShow ? 'opacity-100' : 'opacity-0'}`}
						>
							{content}
						</div>

						{/* Confirm */}
						<div
							className={`relative mx-auto w-full px-6 ${isShow ? 'my-8' : 'mt-24'}`}
						>
							<CustomConnectButton
								bgColor="#FFF"
								textColor="#000"
								isShowIcon={false}
								text={btnText}
								isSwitchChain={title === 'Switch Wallet'}
								closeConnectModal={() => {
									onClose();
									showToast('Wallet connected.', 'success');
								}}
								getConnectModalStatus={status => {
									checkConnectModalStatus(status);
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</animated.div>
	);
};

export default ConnectWalletPop;
