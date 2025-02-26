// sundog提现
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomConnectButton from '../CustomConnectButton/CustomConnectButton';
import { enqueueSnackbar } from 'notistack';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import isMobile from '@/lib/isMobile';
import fetchAPI from '@/lib/api';
import { useUserBalance } from '@/hooks/useBalance';
import { RootState } from '@/store/store';
import WithdrawResultPop from '../WithdrawResultPop/WithdrawResultPop';
import { useToastContext } from '../ToastModal/ToastContext';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import ConfirmPopup from '../ConfirmPopup/CofirmPopup';
import Dialog from '../Dialog/Dialog';
import TronWeb from 'tronweb';
import { parseUnits } from 'viem';
import { SUNDOG_ADDR, TRON_VAULT_CONTRACT } from '@/app/contracts/address';
import useTronlinkMethod from '@/hooks/useTronlinkMethod';
import { useFetchWithdraw } from '@/hooks/useFetchWithdraw';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WaitConfirmDrawer from '../WaitConfirmDrawer/WaitConfirmDrawer';
import { useFetchUsdtRecord } from '@/hooks/useFetchUsdtRecord';
import { useFetchSignData } from '@/hooks/useFetchSignData';

interface WithdrawDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}
const TOKENNAME = 'sundog';

const WithdrawDrawer: React.FC<WithdrawDrawerProps> = ({ isOpen, onClose }) => {
	const [visible, setVisible] = useState(isOpen);
	const dispatch = useDispatch();
	const [showLoading, setShowLoading] = useState(false);
	const [hashcode, setHashcode] = useState<string>('');
	const [isWithdrawResultPop, setIsWithdrawResultPop] = useState(false);
	const [isConfirmPopup, setIsConfirmPopup] = useState(false);
	const [isDialog, setIsDialog] = useState(false);
	const [isWaitClaim, setIsWaitClaim] = useState(false);
	const [loadingConfirm, setLoadingConfirm] = useState(false);
	const [isWaitConfirmOpen, setIsWaitConfirmOpen] = useState(false);
	const [feeContent, setFeeContent] = useState('');

	const wallet = useSelector((state: RootState) => state.wallet);
	const account = useSelector((state: RootState) => state.accountInfo).account;
	const { data: balance, reload: reloadBalance } = useUserBalance();
	const { fetchClaimData } = useFetchSignData();
	const { claimId, fetchClaimTransaction, claimReward } = useTronlinkMethod();
	const {
		data: withdrawRecord,
		loadingClaim,
		pollWithdrawStatus,
	} = useFetchWithdraw(claimId);
	const { data: usdtRecordData, reload: reloadUsdtRecord } =
		useFetchUsdtRecord();

	const { showToast } = useToastContext();
	const pathname = usePathname();

	const clickRouter = () => {
		setShowLoading(true);
	};

	useEffect(() => {
		setShowLoading(false);
	}, [pathname]);

	useEffect(() => {
		if (isOpen) {
			setVisible(true);
		} else {
			const timer = setTimeout(() => setVisible(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	const tronWeb = new TronWeb({
		fullHost: 'https://api.trongrid.io',
	});

	// 领取奖励成功弹窗
	useEffect(() => {
		if (isWaitClaim && !loadingClaim) {
			setIsWaitConfirmOpen(false);
			if (withdrawRecord?.claimed) {
				setIsDialog(true);
				reloadBalance();
			}
			setIsWaitClaim(false);
		}
	}, [isWaitClaim, loadingClaim]);

	// 提现
	const handleWithdraw = async () => {
		if (!wallet.address) {
			showToast('Please connect your wallet', 'info');
			return;
		}
		if (loadingClaim) {
			return;
		}
		// 防止重复点击
		setLoadingConfirm(true);

		const claimData = await fetchClaimData(SUNDOG_ADDR);
		if (!claimData) {
			setLoadingConfirm(false);
			return;
		}
		if (claimData?.tokenAmount && claimData?.tokenDecimals) {
			setFeeContent(
				`${Number(claimData?.tokenAmount) / Math.pow(10, claimData?.tokenDecimals)} ${TOKENNAME}`,
			);
		}
		await fetchClaimTransaction(
			claimData?.claimId,
			claimData?.tokenAmount,
			claimData?.tokenAddress,
			claimData?.expireTimestamp,
			claimData?.signature,
		);
		setLoadingConfirm(false);
		setIsConfirmPopup(true);
	};

	const handleConfirm = async () => {
		if (loadingClaim) {
			return;
		}
		if (!claimId) {
			return;
		}
		claimReward();
		pollWithdrawStatus(claimId);
		setIsConfirmPopup(false);
		setIsWaitClaim(true);
		setTimeout(() => {
			setIsWaitConfirmOpen(true);
		}, 2000);
	};

	return (
		<>
			{visible && (
				<div
					className={`fixed inset-0 z-50 flex items-end justify-center bg-black/90 transition-opacity duration-300 ${
						isOpen ? 'opacity-100' : 'opacity-0'
					}`}
				>
					<div
						className={`flex h-screen w-full transform flex-col items-center justify-start bg-white bg-bg-red bg-cover px-3 transition-transform duration-300 sm:max-w-[520px] ${
							isOpen ? 'translate-y-0' : 'translate-y-full'
						}`}
					>
						{/* top bar */}
						<div className="mt-4 flex w-full justify-between">
							<div className="relative h-6 w-52">
								<div className="absolute left-[52px] top-0 font-jamjuree text-xl font-semibold text-white">
									Winning History
								</div>
								{/* back */}
								<ChevronLeft className="h-6 w-6 text-white" onClick={onClose} />
							</div>
						</div>

						<div className="relative mb-5 mt-8 flex h-[120px] w-full items-center justify-center bg-red-balance-panel bg-[length:100%_100%] bg-no-repeat">
							<Link
								href={'/withdraw/sundog'}
								onClick={clickRouter}
								className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-2xl"
							>
								<img
									src="/img/icon/token-history.svg"
									alt="history"
									className="w-5"
								/>
							</Link>
							<div className="flex items-center justify-center gap-4">
								<img
									className="h-12 w-12"
									src="/img/SUNDOG-token.png"
									alt="sundog"
								/>
								<div className="font-chakra text-6xl font-bold uppercase tracking-widest text-white">
									{balance?.sundog}
								</div>
							</div>
						</div>

						<div className="w-full">
							<CustomConnectButton
								bgColor="#E0423B"
								text="Connect Wallet"
								textColor="#FFF"
								isShowIcon={true}
							/>
						</div>

						<div className="absolute bottom-6 flex w-full flex-col px-4">
							{/* withdraw */}
							<div
								className="relative mt-3 w-full"
								onClick={() => handleWithdraw()}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-full"
									viewBox="0 0 406 60"
									fill="none"
								>
									<path
										d="M0 3.67021L25.9149 0H69.1064H360.649H384.404H406V5.26596V53.1383V56.5691L384.404 60H341.213H66.9468H22.6755H0V52.9787V7.65957V3.67021Z"
										fill="#E0423B"
									/>
								</svg>
								<div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
									<div className="text-center font-chakra text-base font-semibold uppercase tracking-wide text-white">
										Withdraw
									</div>
								</div>
								{loadingClaim && (
									<LoaderCircle
										className="absolute right-[30%] top-[25%] w-4 animate-spin"
										color="white"
									/>
								)}
							</div>
							{/* <WithdrawResultPop
								isOpen={isWithdrawResultPop}
								hashcode={hashcode}
								onClose={() => setIsWithdrawResultPop(false)}
							/> */}
						</div>
					</div>

					<ConfirmPopup
						isOpen={isConfirmPopup}
						title="Withdraw"
						loading={loadingConfirm}
						content="Please confirm the transaction"
						feeContent={feeContent}
						handleConfirm={() => {
							handleConfirm();
						}}
						onClose={() => {
							setIsConfirmPopup(false);
						}}
					/>

					<WaitConfirmDrawer
						title="Withdrawal Processing"
						image="/img/collect-money.gif"
						content="On-Chain Confirming (2 min)"
						isOpen={isWaitConfirmOpen}
						json={null}
						scale={1}
						onClose={() => setIsWaitConfirmOpen(false)}
					/>

					<Dialog
						isOpen={isDialog}
						content="Claimed"
						onClose={() => {
							setIsDialog(false);
						}}
					/>
				</div>
			)}
		</>
	);
};

export default WithdrawDrawer;
