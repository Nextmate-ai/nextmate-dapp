import { X } from 'lucide-react';
import { DisconnectModalProps } from './types';
import { CHAIN } from '@/app/constants/chains';
import { WALLETS } from '@/app/constants/wallets';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const DisconnectModalContent: React.FC<DisconnectModalProps> = ({
	onClose,
	onShowConnect,
}) => {
	const wallet = useSelector((state: RootState) => state.wallet);
	const walletInfo = () => {
		switch (wallet?.chain?.name) {
			case CHAIN.TRON.name:
				return WALLETS.TRONLINK;
			case CHAIN.BASE.name:
				return WALLETS.OKX;
			case CHAIN.SOLANA.name:
				return WALLETS.OKX;
			default:
				return WALLETS.OKX;
		}
	};

	const handleDisconnect = () => {
		onClose();
		onShowConnect();
	};

	return (
		<div className="absolute bottom-0 h-[280px] w-full">
			<img
				className="absolute bottom-0 -z-10 h-[280px] w-full"
				src="/img/connect-wallet-bg.png"
			/>
			<X onClick={onClose} className="absolute right-2 top-4" color="white" />
			<p className="mt-14 text-center text-xl font-semibold text-white">
				Your Wallet
			</p>
			<div className="mt-8 px-6 font-jamjuree text-sm text-white">
				<div className="mb-4 flex bg-bg-disConnectWallet-0.1 px-4 py-3">
					<img className="mr-4 h-10 w-10" src={walletInfo().logo} />
					<div>
						<p>
							{wallet.address?.slice(0, 6)}...
							{wallet.address?.slice(-4)}
						</p>
						<span className="text-xs">{walletInfo().name}</span>
					</div>
				</div>
				<div
					className="flex bg-bg-disConnectWallet-0.1 px-4 py-3"
					onClick={handleDisconnect}
				>
					<img
						className="mr-4 h-10 w-10"
						src="/img/icon/wallet-exchnage.png"
						alt="exchange"
					/>
					<span className="self-center">Connect a different wallet</span>
				</div>
			</div>
		</div>
	);
};

export default DisconnectModalContent;
