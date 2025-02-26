'use client';

import React, { use, useEffect, useRef, useState, Ref } from 'react';
import './CustomConnectButton.css';
import { LoaderCircle, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import { useWalletModal } from '@/app/_components/WalletModal/WalletModalContext';
interface CustomConnectButtonProps {
	closeConnectModal?: () => void;
	getConnectModalStatus?: (status: boolean) => void;
	bgColor?: string;
	text?: string;
	textColor?: string;
	isShowIcon?: boolean;
	isSwitchChain?: boolean;
}

const CustomConnectButton: React.FC<CustomConnectButtonProps> = ({
	closeConnectModal = () => {},
	getConnectModalStatus = () => {},
	isShowIcon = true,
	bgColor = '#6E67F680',
	textColor = '#FFF',
	text = 'Connect Wallet',
	isSwitchChain = false,
}) => {
	const { isOpen, openModal } = useWalletModal();

	const wallet = useSelector((state: RootState) => state.wallet);
	const { loading } = useConnectWallet();

	useEffect(() => {
		getConnectModalStatus(isOpen);
	}, [isOpen]);

	useEffect(() => {
		if (!wallet.address || isSwitchChain) {
			return;
		}
		closeConnectModal();
	}, [wallet.address]);

	// 点击钱包按钮
	const clickWalletBtn = () => {
		if (loading) return;
		openModal('connect');
	};

	// 有 address 后再次点击钱包按钮
	const handleDisconnect = () => {
		openModal('disconnect');
	};

	return (
		<div id="login-drawer">
			<>
				{!wallet?.address && (
					<div
						className="relative flex h-12 w-full items-center justify-center"
						onClick={clickWalletBtn}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-full"
							viewBox="0 0 312 50"
							fill="none"
						>
							<path
								d="M0 6.38298C0 4.47049 1.39562 2.84417 3.28594 2.55386L19.1603 0.115887C19.6626 0.0387411 20.1701 0 20.6783 0H53.1064H277.149H295.404H307.612C310.035 0 312 1.96471 312 4.3883V44.2819C312 45.9339 310.81 47.3459 309.182 47.6264L296.247 49.8548C295.686 49.9514 295.118 50 294.549 50H262.213H51.4468H17.4255H5.85106C2.61961 50 0 47.3804 0 44.1489V6.38298Z"
								fill={bgColor}
							/>
						</svg>
						<div className="absolute flex w-full items-center justify-center gap-3">
							{isShowIcon && (
								<img src="/img/icon/wallet.svg" alt="wallet" className="w-6" />
							)}
							<div
								className="text-center font-jamjuree text-lg font-bold tracking-widest"
								style={{ color: textColor }}
							>
								{text}
							</div>
							{loading && (
								<LoaderCircle
									className="absolute right-[5%] w-4 animate-spin"
									// vote的时候传的文案
									color={text === 'Connecting' ? 'black' : 'white'}
								/>
							)}
						</div>
					</div>
				)}
				{wallet?.address && (
					<div
						className="relative flex h-12 w-full items-center justify-center"
						onClick={handleDisconnect}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-full"
							viewBox="0 0 312 50"
							fill="none"
						>
							<path
								d="M0 6.38298C0 4.47049 1.39562 2.84417 3.28594 2.55386L19.1603 0.115887C19.6626 0.0387411 20.1701 0 20.6783 0H53.1064H277.149H295.404H307.612C310.035 0 312 1.96471 312 4.3883V44.2819C312 45.9339 310.81 47.3459 309.182 47.6264L296.247 49.8548C295.686 49.9514 295.118 50 294.549 50H262.213H51.4468H17.4255H5.85106C2.61961 50 0 47.3804 0 44.1489V6.38298Z"
								fill={bgColor}
								fillOpacity={0.5}
							/>
						</svg>
						<div className="absolute flex w-full items-center justify-between px-4">
							<div className="flex items-center justify-start gap-2">
								<img src="/img/icon/wallet.svg" alt="wallet" className="w-6" />
								{/* <div className="text-center font-jamjuree text-lg font-bold tracking-widest text-white">
										Wallet
									</div> */}
							</div>
							<div className="text-right font-chakra text-lg font-normal text-white">
								{wallet?.address.slice(0, 6)}...
								{wallet?.address.slice(-4)}
							</div>
						</div>
					</div>
				)}
			</>
		</div>
	);
};

export default CustomConnectButton;
