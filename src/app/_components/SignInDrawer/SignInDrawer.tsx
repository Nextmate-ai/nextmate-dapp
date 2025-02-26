import React, { useEffect, useState } from 'react';
import fetchAPI from '@/lib/api';
import moment from 'moment';
import { CircleCheck, X } from 'lucide-react';
import balanceSlice from '@/store/slices/balanceSlice';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useToastContext } from '../ToastModal/ToastContext';

interface SignInDrawerProps {
	onClose: () => void;
	userId: string;
}

const SignInDrawer: React.FC<SignInDrawerProps> = ({ onClose, userId }) => {
	const [weeklyDays, setWeeklyDays] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [totalAccumulatedDays, setTotalAccumulatedDays] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);
	const [alreadySignedIn, setAlreadySignedIn] = useState<boolean>(false);
	const balanceSlice = useSelector((state: RootState) => state.balance);
	const { showToast } = useToastContext();

	useEffect(() => {
		const fetchSignInStatus = async () => {
			try {
				const data = await fetchAPI('/api/signin', {
					method: 'GET',
					params: { userId },
				});
				console.log(data);
				setWeeklyDays(data.signInDaysInCurrentWeek || 0);
				setTotalAccumulatedDays(data.signInDaysIn30Days || 0);
				const todayString = moment().format('YYYY-MM-DD');

				setAlreadySignedIn(false);
				if (data.lastSignInTime && data.lastSignInTime !== '') {
					const weeklyUpdatedAt = moment(data.lastSignInTime).format(
						'YYYY-MM-DD',
					);
					if (todayString === weeklyUpdatedAt) {
						setAlreadySignedIn(true);
					}
				}
			} catch (error) {
				console.error('Error fetching sign-in status:', error);
				setError('Error fetching sign-in status');
			}
		};

		fetchSignInStatus();
	}, [userId]);

	const handleSignIn = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchAPI('/api/signin', {
				method: 'POST',
				body: { userId },
			});
			if (data.error) {
				showToast(data.error as string, 'error');
			} else {
				setWeeklyDays(data.signInDaysInCurrentWeek);
				setTotalAccumulatedDays(data.signInDaysIn30Days);

				// 更新签到状态
				const todayString = moment().format('YYYY-MM-DD');
				const weeklyUpdatedAt = moment(data.lastSignInTime).format(
					'YYYY-MM-DD',
				);
				// const accumulatedUpdatedAt = moment(data.lastSignInTime).format(
				// 	'YYYY-MM-DD',
				// );

				if (
					todayString === weeklyUpdatedAt
					// todayString === accumulatedUpdatedAt
				) {
					setAlreadySignedIn(true);
				} else {
					setAlreadySignedIn(false);
				}
			}
		} catch (error) {
			showToast(error as string, 'error');
		} finally {
			setLoading(false);
		}
	};

	const progressBarWidth = (totalAccumulatedDays / 30) * 100;

	return (
		<div className="fixed inset-0 z-[999] flex items-end justify-center bg-gray-500 bg-opacity-50">
			<div className="relative h-[600px] w-full rounded-t-lg bg-white bg-bg-purple bg-cover shadow-lg sm:max-w-[520px]">
				<button className="absolute right-4 top-4 text-white" onClick={onClose}>
					<X />
				</button>
				<div className="mt-6 flex flex-col items-center p-4">
					<p className="text-md my-4 text-2xl font-semibold text-white">
						Daily Checkin
					</p>
					<p className="my-2 w-full px-2 text-left text-white">Weekly</p>
					<div className="flex w-full flex-wrap justify-center gap-2">
						{Array.from({ length: 7 }, (_, index) => (
							<div
								key={index}
								className={`relative flex h-20 flex-1 flex-col items-center justify-center gap-4 rounded-lg bg-white shadow-lg`}
							>
								<p className="text-sm text-[#989898]">Day {index + 1} </p>
								<div className="flex gap-1">
									<img
										src={'/img/icon/diamond.png'}
										width={24}
										height={24}
										alt="coin"
									/>
								</div>
								{index < weeklyDays && (
									<>
										<div className="absolute h-full w-full rounded-lg bg-black opacity-50"></div>
										<CircleCheck className="absolute" color="white" />
									</>
								)}
							</div>
						))}
					</div>
					<div className="relative mt-8 flex w-full items-center gap-4">
						<div className="mt-8 w-full">
							<p className="mb-2 w-full px-2 text-left text-white">Monthly</p>
							<div className="grid grid-cols-10 gap-2">
								{Array.from({ length: 30 }, (_, index) => (
									<div
										key={index}
										className={`relative flex h-8 w-8 items-center justify-center rounded-full bg-white`}
									>
										{index < totalAccumulatedDays && (
											<img
												className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2"
												src="/img/icon/have-checked.png"
											/>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
					<button
						className={`relative mt-8 h-11 w-72 rounded-full text-black ${alreadySignedIn ? 'bg-custom-gray-003' : ''}`}
						onClick={handleSignIn}
						disabled={loading || alreadySignedIn}
					>
						<img
							className="absolute left-0 top-0"
							src="/img/bg-action-item.png"
						/>
						<span className="absolute left-1/2 top-1/2 z-10 w-48 -translate-x-1/2 -translate-y-1/2 uppercase text-black">
							{loading
								? 'Loading...'
								: alreadySignedIn
									? 'Already checked in'
									: 'Checkin'}
						</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default SignInDrawer;
