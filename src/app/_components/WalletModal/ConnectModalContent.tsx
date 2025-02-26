import { X } from 'lucide-react';
import { ConnectModalProps } from './types';
import { CHAIN } from '@/app/constants/chains';

const WALLET_OPTIONS = [
	{
		id: 'tronlink',
		name: 'Tronlink',
		icon: '/img/wallet/wallet-tronlink.png',
	},
	{
		id: 'okx',
		name: 'OKX Wallet',
		icon: '/img/wallet/wallet-okx.png',
	},
];

const CHAIN_OPTIONS = [
	{
		chain: CHAIN.SUI,
		name: 'Sui',
		icon: '/img/chain/sui.png',
	},
	{
		chain: CHAIN.BASE,
		name: 'Base',
		icon: '/img/chain/base.png',
	},
	{
		chain: CHAIN.SOLANA,
		name: 'Solana',
		icon: '/img/chain/solana.png',
	},
];

const ConnectModalContent: React.FC<ConnectModalProps> = ({
	onClose,
	onWalletClick,
	onChainClick,
	showChainModal,
	selectedChain,
}) => {
	return (
		<div className="absolute bottom-0 min-h-[280px] w-full">
			<img
				className="absolute bottom-0 -z-10 h-full w-full"
				src="/img/connect-wallet-bg.png"
			/>
			<X onClick={onClose} className="absolute right-2 top-4" color="white" />
			<p className="mt-14 text-center text-xl font-semibold text-white">
				Select a Wallet to Connect
			</p>

			<div className="mt-8 flex justify-center gap-10">
				{WALLET_OPTIONS.map(wallet => (
					<WalletOption
						key={wallet.id}
						wallet={wallet}
						onClick={() => onWalletClick(wallet.id)}
					/>
				))}
			</div>

			{showChainModal && (
				<div className="flex w-full flex-col gap-4 p-8">
					{CHAIN_OPTIONS.map(chainOption => (
						<ChainOption
							key={chainOption.name}
							chainOption={chainOption}
							isSelected={selectedChain === chainOption.chain.name}
							onClick={() => onChainClick(chainOption.chain)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

// 钱包
const WalletOption: React.FC<{
	wallet: (typeof WALLET_OPTIONS)[number];
	onClick: () => void;
}> = ({ wallet, onClick }) => (
	<div className="flex flex-col items-center" onClick={onClick}>
		<img className="h-16 w-16" src={wallet.icon} alt={wallet.name} />
		<span className="mt-2 font-semibold text-white">{wallet.name}</span>
	</div>
);

// 链
const ChainOption: React.FC<{
	chainOption: (typeof CHAIN_OPTIONS)[number];
	isSelected: boolean;
	onClick: () => void;
}> = ({ chainOption, isSelected, onClick }) => (
	<div
		className={`flex h-14 items-center justify-start gap-8 rounded-xl px-6 py-3 ${
			isSelected ? 'bg-[#6e67f6]/30' : 'bg-[#6e67f6]/10'
		}`}
		onClick={onClick}
	>
		<div className="flex w-10 items-center justify-center">
			<img
				className="h-10 rounded-[20px]"
				src={chainOption.icon}
				alt={chainOption.name}
			/>
		</div>
		<div className="inline-flex flex-col items-start justify-center gap-0.5">
			<div className="font-['Bai Jamjuree'] text-center text-base font-medium text-white">
				{chainOption.name}
			</div>
		</div>
	</div>
);

export default ConnectModalContent;
