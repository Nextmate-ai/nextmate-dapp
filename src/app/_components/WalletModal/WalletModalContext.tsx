'use client';

import React, { createContext, useContext, useState } from 'react';
import { ModalType } from './types';
import {
	clearWallet,
	setAddress,
	setChain,
	setIsConnected,
	WalletState,
} from '@/store/slices/walletSlice';
import { CHAIN, Chain } from '@/app/constants/chains';
import Modal from './Modal';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useToastContext } from '../ToastModal/ToastContext';
import useTronlinkMethods from '@/hooks/useTronlinkMethod';
import ApprovePop from '../ApprovePop/ApprovePop';
import fetchAPI from '@/lib/api';
import { OKXSuiProvider } from '@okxconnect/sui-provider';
import { OKXSolanaProvider } from '@okxconnect/solana-provider';
import useOkxMethod from '@/hooks/useOkxMethod';

interface ModalContextType {
	isOpen: boolean;
	modalType: ModalType | null;
	showChainModal: boolean;
	selectedChain?: string;
	walletState?: WalletState;
	openModal: (type: ModalType, wallet?: WalletState) => void;
	closeModal: () => void;
	toggleChainModal: () => void;
	setSelectedChain: (chain: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const WalletModalProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const dispatch = useAppDispatch();
	const { showToast } = useToastContext();
	const [isOpen, setIsOpen] = useState(false);
	const [modalType, setModalType] = useState<ModalType | null>(null);
	const [showChainModal, setShowChainModal] = useState(false);
	const [selectedChain, setSelectedChain] = useState<string>();
	const [walletState, setWalletState] = useState<WalletState>();
	const wallet = useSelector((state: RootState) => state.wallet);
	const {
		addressNotVerify,
		loading,
		isApprovePop,
		signActionId,
		signMessage,
		setIsApprovePop,
		setLoading,
		conectOkxWallet,
		connectTronWallet,
		connectUxuyWallet,
	} = useConnectWallet();
	const { personalSign } = useOkxMethod();
	const { signMessage: tronSignMessage } = useTronlinkMethods();
	const openModal = (type: ModalType, wallet?: WalletState) => {
		setModalType(type);
		setIsOpen(true);
		if (wallet) {
			setWalletState(wallet);
		}
	};

	const closeModal = () => {
		setIsOpen(false);
		setShowChainModal(false);
		setModalType(null);
	};

	const toggleChainModal = () => setShowChainModal(!showChainModal);

	/**
	 * 处理钱包点击
	 * @param wallet 钱包
	 * @returns
	 */
	const handleWalletClick = async (wallet: string) => {
		console.log('handleWalletClick', wallet);

		try {
			// 根据钱包类型进行不同处理
			if (wallet === 'tronlink') {
				dispatch(setChain(CHAIN.TRON));
				await connectTronWallet();
				setIsOpen(false); // 连接成功后关闭模态框
			} else if (wallet === 'okx') {
				toggleChainModal();
			} else if (wallet === 'uxuy') {
				dispatch(setChain(CHAIN.SOLANA));
				await connectUxuyWallet();
				setIsOpen(false); // 连接成功后关闭模态框
			}
		} catch (error) {
			console.error('Wallet connection error:', error);
			showToast('Wallet connection error', 'error');
		}
	};

	/**
	 * 处理链点击
	 * @param chain 链
	 * @returns
	 */
	const handleChainClick = async (chain: Chain) => {
		console.log('handleChainClick', chain);
		try {
			dispatch(setChain(chain));
			await conectOkxWallet(chain);
			setShowChainModal(false); // 关闭链选择模态框
			setIsOpen(false); // 关闭主模态框
		} catch (error) {
			console.error('Chain connection error:', error);
			showToast('Chain connection error', 'error');
		}
	};

	/**
	 * 签名
	 * @returns
	 */
	const handleSignMessage = async () => {
		try {
			// if (loading) return;
			// 添加 loading 状态
			setLoading(true);

			switch (wallet.chain.name) {
				case CHAIN.TRON.name:
					await tronSignMessage(signActionId, addressNotVerify, signMessage);
					// 延迟关闭弹窗，等待签名完成
					setTimeout(() => {
						setIsApprovePop(false);
					}, 2000);
					break;
				case CHAIN.BASE.name: {
					// base 签名
					const signature = await personalSign(signMessage);
					await handleVerify(signActionId, signature);
					setIsApprovePop(false);
					break;
				}
				case CHAIN.SOLANA.name: {
					// solana 签名
					const okxSolanaProvider = new OKXSolanaProvider(wallet.provider);
					const signResult: any =
						await okxSolanaProvider.signMessage(signMessage);
					const signedMessageBase64 = btoa(
						Array.from(new Uint8Array(signResult?.signature))
							.map(byte => String.fromCharCode(byte))
							.join(''),
					);
					await handleVerify(signActionId, signedMessageBase64);
					setIsApprovePop(false);
					break;
				}
				case CHAIN.SUI.name: {
					// sui 签名
					const encodedMessage = new TextEncoder().encode(signMessage);
					const okxSuiProvider = new OKXSuiProvider(wallet.provider);
					const suiSignResult: any = await okxSuiProvider.signMessage({
						message: encodedMessage,
					});
					await handleVerify(signActionId, suiSignResult?.signature);
					setIsApprovePop(false);
					break;
				}
			}
		} catch (error) {
			console.error('Approval error:', error);
			showToast('Failed to approve signature', 'error');
		} finally {
			setLoading(false);
		}
	};

	/**
	 * 验证签名
	 * @param signActionId 签名ID
	 * @param signedData 签名数据
	 * @returns
	 */
	const handleVerify = async (signActionId: string, signedData: string) => {
		try {
			const verifyRes = await fetchAPI('/api/wallet/verify', {
				method: 'POST',
				body: {
					actionId: signActionId,
					signedData,
				},
			});

			if (verifyRes.success) {
				dispatch(setAddress(addressNotVerify));
				dispatch(setIsConnected(true));
				return true;
			}
			return false;
		} catch (error) {
			console.error('Verification error:', error);
			showToast('Failed to verify signature', 'error');
			return false;
		}
	};

	const handleShowConnect = () => {
		closeModal();
		dispatch(clearWallet());
		openModal('connect');
	};

	return (
		<ModalContext.Provider
			value={{
				isOpen,
				modalType,
				showChainModal,
				selectedChain,
				walletState,
				openModal,
				closeModal,
				toggleChainModal,
				setSelectedChain,
			}}
		>
			{children}
			{/* 主弹窗 */}
			{isOpen && modalType && (
				<Modal
					type={modalType}
					showChainModal={showChainModal}
					selectedChain={selectedChain}
					wallet={walletState!}
					onClose={closeModal}
					onWalletClick={handleWalletClick}
					onChainClick={handleChainClick}
					onShowConnect={handleShowConnect}
				/>
			)}
			{/* 签名弹窗 */}
			{isApprovePop && (
				<ApprovePop
					isOpen={true}
					handleApprove={handleSignMessage}
					loading={loading}
					title="Please approve with login"
					onClose={() => {
						setIsApprovePop(false);
					}}
				/>
			)}
		</ModalContext.Provider>
	);
};

export const useWalletModal = () => {
	const context = useContext(ModalContext);
	if (context === undefined) {
		throw new Error('useWalletModal must be used within a WalletModalProvider');
	}
	return context;
};
