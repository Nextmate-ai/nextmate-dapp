import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import fetchAPI from '@/lib/api';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import useOkxMethods from '@/hooks/useOkxMethod';
import { encodeFunctionData, parseUnits } from 'viem';
import { ERC20_CONTRACT, USDC_CONTRACT } from '@/app/contracts/address';
import { CHAIN } from '@/app/constants/chains';
import { useToastContext } from '../ToastModal/ToastContext';
import { publicClient } from '@/app/constants/client';

interface AddTokenDrawerProps {
	isOpen: boolean;
	walletAddress?: string;
	walletType?: string;
	onClose: () => void;
	onOpenConfirm: () => void;
}

interface DiamondOption {
	amount: number;
	isSelected: boolean;
	isDisabled: boolean;
}

const AddTokenDrawer: React.FC<AddTokenDrawerProps> = ({
	isOpen,
	onClose,
	walletAddress,
	walletType,
	onOpenConfirm,
}) => {
	const [visible, setVisible] = useState(isOpen);
	const [actionId, setActionId] = useState('');
	const [mainTokenBalance, setMainTokenBalance] = useState(0); // 主链币余额
	const [trc20TokenBalance, setTrc20TokenBalance] = useState(0); // trc20 充值token余额
	const [diamondOptions, setDiamondOptions] = useState<DiamondOption[]>([
		{ amount: 100, isSelected: true, isDisabled: false },
		{ amount: 500, isSelected: false, isDisabled: false },
		{ amount: 2000, isSelected: false, isDisabled: false },
		{ amount: 10000, isSelected: false, isDisabled: false },
	]);
	const account = useSelector((state: RootState) => state.accountInfo.account);
	const wallet = useSelector((state: RootState) => state.wallet);
	const { sendTransaction, getBalance } = useOkxMethods();
	const handleSelect = (selectedAmount: number) => {
		setDiamondOptions(prevOptions =>
			prevOptions.map(option => ({
				...option,
				isSelected: option.amount === selectedAmount && !option.isDisabled,
			})),
		);
	};
	const { showToast } = useToastContext();

	useEffect(() => {
		setVisible(isOpen);
		// fetchActionId();
	}, [isOpen]);

	// 获取 actionId
	const fetchActionId = async () => {
		try {
			const actionIdRes = await fetchAPI('/api/txn/tronlink', {
				method: 'POST',
			});
			setActionId(actionIdRes.data.txnId);
			console.log(10, actionIdRes.data.txnId);
		} catch (error) {
			console.error('fetchActionId error', error);
			setActionId('');
		}
		return actionId;
	};

	useEffect(() => {
		if (wallet.address && walletType === CHAIN.BASE.name) {
			fetchMainTokenBalance();
			fetchTrc20TokenBalance();
		}
	}, [wallet.address, walletType]);

	/**
	 * 获取主链币余额
	 */
	const fetchMainTokenBalance = async () => {
		const balance = await getBalance(wallet.address);
		setMainTokenBalance(balance);
		console.log(100, balance);
	};

	/**
	 * 获取 trc20 token 余额
	 */
	const fetchTrc20TokenBalance = async () => {
		const data: any = await publicClient.readContract({
			address: USDC_CONTRACT.address as `0x${string}`,
			abi: ERC20_CONTRACT.abi,
			functionName: 'balanceOf',
			args: [wallet.address],
		});
		setTrc20TokenBalance(data);
		console.log(200, data);
	};

	/**
	 * 点击添加TopUp
	 */
	const clickAdd = async () => {
		const curDiamond = diamondOptions.filter(option => option.isSelected)?.[0];
		// const actionId = uuidv4();
		console.log(48, walletAddress);

		// if (!actionId) {
		// 	showToast('ActionId is empty, Please try again', 'info');
		// 	return;
		// }

		if (walletAddress) {
			if (walletType === CHAIN.TRON.name) {
				showToast('Coming soon...', 'info');
				// const params = {
				// 	url: `${window.location.origin}`,
				// 	callbackUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/txn/callback/tronlink`,
				// 	dappIcon: 'https://nextmate.xyz/favicon.ico',
				// 	dappName: 'Nextmate',
				// 	protocol: 'TronLink',
				// 	version: '1.0',
				// 	chainId: '0x2b6653dc',
				// 	// 备注信息
				// 	memo: actionId,
				// 	from: walletAddress,
				// 	// 公司地址
				// 	to: 'TTpDgEhk3fhf6sP9itN1Hyit3gUk8UA2zJ',
				// 	loginAddress: walletAddress,
				// 	symbol: 'USDT',
				// 	// usdt
				// 	contract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
				// 	// usdt 比例是 100, 必须是 string
				// 	amount: `${(curDiamond.amount / 100) * Math.pow(10, 6)}`,
				// 	action: 'transfer',
				// 	actionId,
				// };

				// // 放在 await 后不调用
				// window.open(
				// 	`tronlinkoutside://pull.activity?param=${encodeURIComponent(JSON.stringify(params))}`,
				// );

				// // 把 actionID 发给后端
				// const res = await fetchAPI('/api/txn/tronlink', {
				// 	method: 'POST',
				// 	body: { actionId },
				// });
				// console.log(72, res);
				// if (!res.success) {
				// 	showToast(res.msg, 'error');
				// 	fetchActionId();
				// 	return;
				// } else {
				// 	fetchActionId();
				// 	onClose();
				// 	setTimeout(() => {
				// 		onOpenConfirm();
				// 	}, 3000);
				// }
			} else if (walletType === CHAIN.BASE.name) {
				// enqueueSnackbar('Coming soon...', { variant: 'info' });
				const recipientAddress = '0x1e55947ec8d993777b03b83dc4f53c3befbde2f7'; // 接收地址

				const amount = parseUnits(String(curDiamond.amount / 100), 6);

				if (mainTokenBalance <= 0) {
					showToast('Eth Insufficient Balance', 'error');
					return;
				}

				if (trc20TokenBalance < amount) {
					showToast('USDC Insufficient Balance', 'error');
					return;
				}

				const transData = encodeFunctionData({
					abi: USDC_CONTRACT.abi,
					functionName: 'transfer',
					args: [recipientAddress, amount],
				});

				setTimeout(() => {
					onOpenConfirm();
					setVisible(false);
				}, 3000);

				try {
					const res = await sendTransaction({
						to: USDC_CONTRACT.address,
						from: wallet.address,
						value: '0x0',
						data: transData,
					});
					console.log(190, res);
				} catch (error) {
					showToast('error', error.message);
				}
			} else {
				showToast('Coming soon...', 'info');
			}
		} else {
			showToast('Please connect wallet first', 'info');
		}
	};

	return (
		<>
			{visible && (
				<div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-80 sm:max-w-[520px]">
					<div className="w-full px-6">
						<div className="relative w-full bg-bg-popup bg-[length:100%_100%] bg-no-repeat p-4 text-white">
							<span className="absolute left-[50%] top-6 translate-x-[-50%] text-base">
								Add Token
							</span>
							<X onClick={onClose} className="absolute right-4 top-6" />

							<p className="mt-16 w-full text-xs font-bold uppercase tracking-widest text-white">
								Choose an amount
							</p>
							{/* 选择额度 */}
							<div className="mb-3 mt-4 flex h-8 w-full flex-wrap items-start justify-start gap-3">
								<div className="flex items-center justify-center gap-1">
									{diamondOptions.map(option => (
										<div
											className={`flex h-8 items-center justify-center gap-1 rounded-sm px-3 py-2 ${option.isSelected ? 'bg-white/30' : 'bg-white/20'}`}
											key={option.amount}
											onClick={() => handleSelect(option.amount)}
										>
											<div
												className={`text-xs font-bold uppercase tracking-widest ${option.isSelected ? 'text-[#949494]' : 'text-white'} `}
											>
												{option.amount}
											</div>
											<img
												src="/img/icon/coin.svg"
												alt="coin"
												className="w-3"
											/>
										</div>
									))}
								</div>
							</div>
							<p className="w-full text-center font-chakra text-xs font-normal uppercase tracking-widest text-white/90">
								1 USDT/USDC = 100 Gold Coins
							</p>
							{/* add btn */}
							<div className="my-4 flex w-full justify-center">
								<button
									className="bg-bg-top-up relative mx-auto h-12 w-44 text-base font-semibold text-black"
									onClick={clickAdd}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-full w-full"
										viewBox="0 0 181 48"
										fill="none"
									>
										<path
											d="M1 6.12766V3.32446L12.0522 0.5H31.1383H160.394H170.926H180V4.21277V42.5106V44.8785L170.855 47.5H151.777H30.1809H10.5532H1V42.383V6.12766Z"
											fill="white"
											stroke="white"
										/>
									</svg>
									<span className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
										Add
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default AddTokenDrawer;
