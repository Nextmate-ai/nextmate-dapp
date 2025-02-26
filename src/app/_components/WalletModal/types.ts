import { Chain } from '@/app/constants/chains';
import { WalletState } from '@/store/slices/walletSlice';

export interface WalletOption {
	id: string;
	name: string;
	icon: string;
}

export interface ChainOption {
	chain: Chain;
	name: string;
	icon: string;
}

export type ModalType = 'connect' | 'disconnect';

export interface BaseModalProps {
	onClose: () => void;
}

export interface ConnectModalProps extends BaseModalProps {
	type: 'connect';
	onWalletClick: (wallet: string) => void;
	onChainClick: (chain: Chain) => void;
	showChainModal: boolean;
	selectedChain?: string;
}

export interface DisconnectModalProps extends BaseModalProps {
	type: 'disconnect';
	wallet: WalletState;
	onShowConnect: () => void;
}

export type ModalProps = ConnectModalProps | DisconnectModalProps;
