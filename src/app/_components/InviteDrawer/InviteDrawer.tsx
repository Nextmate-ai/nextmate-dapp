import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BorderBeam } from '../magicui/border-beam';
import { useSelector } from 'react-redux';
import { setAccount } from '@/store/slices/accountInfoSlice';
import { fetchBalance } from '@/lib/balanceApi';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import fetchAPI from '@/lib/api';
import { useToastContext } from '../ToastModal/ToastContext';

interface InviteDrawerProps {
	isOpen: boolean;
	code: string;
	onClose: () => void;
	inviterDisplay: string | undefined;
	userId: string;
}

const InviteDrawer: React.FC<InviteDrawerProps> = ({
	isOpen,
	code,
	onClose,
	inviterDisplay,
	userId,
}) => {
	const [inviteCode, setInviteCode] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	const dispatch = useAppDispatch();
	const balanceStatus = useSelector((state: RootState) => state.balance.status);
	const { showToast } = useToastContext();

	useEffect(() => {
		console.log(inviterDisplay);
		if (inviterDisplay) {
			setIsVerified(true);
		}
	}, [inviterDisplay]);

	const handleSubmit = async () => {
		if (isLoading || !inviteCode.trim()) return;

		setIsLoading(true);
		setError('');

		try {
			const data = await fetchAPI('/api/verifyInvitation', {
				method: 'POST',
				body: JSON.stringify({ inviteCode, userId }),
			});

			if (data.success) {
				setIsVerified(true);
				dispatch(setAccount(data.user));
				await dispatch(fetchBalance(userId));
				showToast('Claim invite gift Successful', 'success');
			} else {
				setError(data.message || 'Invalid invitation code');
				showToast(data.message, 'error');
			}
		} catch (error) {
			showToast('An error occurred while verifying the code', 'error');
		} finally {
			setIsLoading(false);
		}
	};

	const handleCopyCode = async (value: string) => {
		try {
			if (typeof window !== 'undefined') {
				await navigator.clipboard.writeText(value);
				showToast('Copy Code Successful', 'success');
			}
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	return (
		<>
			{isOpen && (
				<div className="fixed inset-0 z-[999] flex items-end justify-center transition-opacity duration-300">
					<div
						className="fixed inset-0 bg-black bg-opacity-50"
						onClick={onClose}
					></div>
					<div className="flex h-[660px] w-full transform flex-col gap-4 rounded-t-3xl bg-white p-4 transition-transform duration-300 sm:w-3/4 lg:w-1/2">
						<button className="absolute right-8 top-8" onClick={onClose}>
							<X className="h-6 w-6 text-gray-600" />
						</button>
						<h2 className="mb-4 mt-20 px-12 text-center text-2xl font-light">
							Earn Lingua3 Token by Inviting Friends!
						</h2>
						{!isVerified ? (
							<div className="mb-4">
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Get Invited
								</label>
								<div className="flex w-full items-center justify-center rounded-full border bg-custom-gray-001 px-2 py-1">
									<input
										type="text"
										placeholder="Enter Verification Code"
										className="w-full max-w-md border-none bg-custom-gray-001 px-4 py-2 focus:outline-none"
										value={inviteCode}
										onChange={e => setInviteCode(e.target.value)}
										disabled={isLoading}
									/>
									<button
										className={`rounded-full bg-custom-purple-005 px-6 py-2 text-white shadow-lg ${isLoading || !inviteCode.trim() ? 'cursor-not-allowed opacity-50' : ''}`}
										onClick={handleSubmit}
										disabled={isLoading || !inviteCode.trim()}
									>
										{isLoading ? 'Verifying...' : 'Confirm'}
									</button>
								</div>
								{error && <p className="mt-2 text-red-500">{error}</p>}
							</div>
						) : (
							<div className="mb-4 text-center">
								<p className="text-lg font-medium">
									You were already been invited{' '}
								</p>
							</div>
						)}
						<div
							className="relative rounded-xl p-4 text-center"
							style={{
								border: '2px solid transparent',
								borderImage:
									'linear-gradient(241.97deg, rgba(110, 103, 246, 0.5) 2.16%, rgba(252, 210, 91, 0.5) 97.93%), linear-gradient(150.8deg, rgba(255, 0, 0, 0.1) 12.12%, rgba(0, 193, 51, 0.1) 87.07%)',
								borderImageSlice: 1,
							}}
						>
							<BorderBeam size={250} duration={12} delay={9} />
							<p className="mb-2 text-lg font-light">
								For every friend you invite, you get
							</p>
							<div className="mb-2 flex justify-center gap-4 text-6xl font-normal">
								20
								<img
									src={'/img/icon/diamond.png'}
									className="h-[53px] w-[53px]"
									alt="coin"
								/>
							</div>
							<p className="mb-4 text-gray-600">Copy Code to Invite</p>
							<button
								className="relative z-50 rounded-full bg-indigo-500 px-6 py-2 text-white"
								onClick={async () => {
									await handleCopyCode(code);
								}}
							>
								Copy Code to Invite
							</button>
							<p className="mt-2 text-sm text-gray-500">
								Your Invitation code: {code}
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default InviteDrawer;
