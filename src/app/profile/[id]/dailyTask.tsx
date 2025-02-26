import { CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import SignInDrawer from '@/app/_components/SignInDrawer/SignInDrawer';

const DailyTask = () => {
	const [showSignInDrawer, setShowSignInDrawer] = useState(false);
	const account = useSelector((state: RootState) => state.accountInfo.account);
	const handleOpenSignInDrawer = (p0: boolean) => {
		setShowSignInDrawer(true);
	};

	const handleCloseSignInDrawer = () => {
		setShowSignInDrawer(false);
	};
	return (
		<>
			{/* 签到 */}
			<div
				className="mb-4 mt-3 flex h-12 items-center justify-between bg-[#6e67f6]/10 p-3 shadow-[0_0_10px_#6E67F6]"
				onClick={() => {
					handleOpenSignInDrawer(true);
				}}
			>
				<div className="flex items-center justify-center gap-3">
					<CalendarDays className="w-4 text-white" />
					<div className="font-jamjuree text-xs font-medium tracking-widest text-white">
						Daily checkin
					</div>
				</div>
				<div className="flex items-center justify-center">
					<span className="mr-[4px] text-right font-jamjuree text-sm text-white">
						100
					</span>
					<img src="/img/icon/diamond.svg" alt="" className="mr-2 w-4" />
					<div className="rectangle bg-[#6E67F6] text-white">GO</div>
				</div>
			</div>

			{/* 邀请 */}
			{/* <Link
								href="/invite/v1"
								onClick={() => showRouterLoading('/invite/v1')}
								className="mt-2 flex h-12 items-center justify-between bg-[#6e67f6]/10 p-3 shadow-[0_0_10px_#6E67F6]"
							>
								<div className="flex items-center justify-center gap-3">
									<UserRoundPlus className="w-4 text-white" />
									<div className="font-jamjuree text-xs font-medium tracking-widest text-white">
										Invite to earn
									</div>
								</div>
								<div className="flex items-center justify-center">
									<span className="mr-[4px] text-right font-jamjuree text-sm text-white">
										200
									</span>
									<img src="/img/icon/coin.svg" alt="" className="mr-2 w-4" />
									<div className="rectangle bg-[#6E67F6] text-white">GO</div>
								</div>
							</Link> */}

			{account && showSignInDrawer && (
				<SignInDrawer onClose={handleCloseSignInDrawer} userId={account?.id!} />
			)}
		</>
	);
};

export default DailyTask;
