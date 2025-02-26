import { LoaderCircle, X } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import { parseUnits } from 'viem';
import { useToastContext } from '../ToastModal/ToastContext';
import { SUNDOG_ADDR } from '@/app/contracts/address';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { CHAIN } from '@/app/constants/chains';

interface StakeAmountProps {
	isOpen: boolean;
	loading: boolean;
	balance: bigint; // 主流币余额
	tokenAddress: string; // vote代币地址
	tokenBalance: bigint; // vote代币余额
	resetAmount: boolean;
	handleVote: (amount: string) => void;
	amountChange: (amount: string) => void;
	onClose: () => void;
}

const StakeAmountPop: React.FC<StakeAmountProps> = ({
	isOpen,
	balance,
	loading,
	tokenAddress,
	tokenBalance,
	resetAmount,
	handleVote,
	amountChange,
	onClose,
}) => {
	const animation = useSpring({
		opacity: isOpen ? 1 : 0,
		transform: isOpen ? 'scale(1)' : 'scale(0.9)',
		config: { tension: 500, friction: 20 },
	});
	const [stakeAmount, setStakeAmount] = useState<string>('');
	const [isOverBalance, setIsOverBalance] = useState<boolean>(false);
	const wallet = useSelector((state: RootState) => state.wallet);
	const { showToast } = useToastContext();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const numberRegex = /^(?:[0-9]\d*)(?:\.\d*)?$/;

		if (value === '' || numberRegex.test(value)) {
			setStakeAmount(value);
			amountChange(value);
		}
	};

	useEffect(() => {
		setStakeAmount('');
		onClose();
	}, [resetAmount]);

	useEffect(() => {
		if (wallet.chain?.name !== CHAIN.TRON.name) {
			return;
		}
		const amount = parseUnits(stakeAmount, 18);
		if (amount > tokenBalance) {
			setIsOverBalance(true);
		} else {
			setIsOverBalance(false);
		}
	}, [stakeAmount, tokenBalance]);

	// vote token类型
	const voteTokenType = () => {
		switch (wallet.chain?.name) {
			case CHAIN.SOLANA.name:
				return 'SOL';
			case CHAIN.SUI.name:
				return 'HIPPO';
			default:
				return 'SUNDOG';
		}
	};

	const handleConfirm = () => {
		if (isOverBalance) {
			return;
		}
		// const base = parseUnits('2', 6);
		// if (balance < base) {
		// 	showToast('Make sure your balance and gas fees are sufficient.', 'info');
		// 	return;
		// }
		handleVote(stakeAmount);
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
						onClick={e => {
							e.stopPropagation();
							onClose();
						}}
					/>
					<div className="absolute left-1/2 top-5 z-0 w-60 -translate-x-1/2 text-center font-jamjuree text-lg font-semibold text-white">
						Amount
					</div>
					{/* amount */}
					<div className="relative mb-8 mt-[78px] flex w-72 items-center justify-center gap-6">
						<div className="relative flex h-12 w-[220px] items-center justify-center bg-bg-amount bg-[length:100%_100%] bg-no-repeat">
							{/* <div className="absolute left-4 top-1/2 h-full -translate-y-[30%] text-center text-lg font-medium text-white">
								$
							</div> */}
							<input
								type="text"
								value={stakeAmount}
								onChange={handleInputChange}
								className="absolute left-8 top-1/2 h-full w-[150px] -translate-y-1/2 border-transparent bg-transparent text-lg font-medium uppercase tracking-wide text-white focus:border-transparent focus:outline-none"
							/>
						</div>
						<div className="text-center font-chakra text-lg font-medium uppercase tracking-wide text-white">
							{voteTokenType()}
						</div>
					</div>

					{/* vote */}

					<button
						className="relative mb-8 w-72"
						onClick={() => handleConfirm()}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-full"
							viewBox="0 0 321 48"
							fill={isOverBalance ? '#efefef' : '#FFFFFF'}
						>
							<path
								d="M0.5 2.93617L20.9255 0H54.9681H284.755H303.479H320.5V4.21277V42.5106V45.2553L303.479 48H269.436H53.266H18.3723H0.5V42.383V6.12766V2.93617Z"
								fill={isOverBalance ? '#efefef' : '#FFFFFF'}
							/>
						</svg>
						<div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center font-chakra text-base font-semibold uppercase tracking-wide text-black">
							{isOverBalance ? 'Insufficient balance' : 'VOTE'}
						</div>
						{loading && (
							<LoaderCircle
								className="absolute right-[30%] top-[25%] w-4 animate-spin"
								color="black"
							/>
						)}
					</button>
				</div>
			</div>
		</animated.div>
	);
};

export default StakeAmountPop;
