import { UserRound, LoaderPinwheel } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';
import MessageBox from '../MessageBox/MessageBox';
import { useVoteOpenStatus } from '@/hooks/useVoteOpenStatus';

const VoteRules = () => {
	return (
		<div className="flex w-full flex-col px-8">
			<div className="font-jamjuree text-sm font-medium text-white">
				During the Vote-to-Earn contest, this section opens three times daily.
				Please return during the following times:
			</div>
			<div className="mt-4 font-jamjuree text-xs font-normal text-white/80">
				Daily Open Time (UTC)
			</div>
			<div className="font-jamjuree text-sm font-medium text-white">
				6-10 AM, 2-6 PM, 10 PM-2 AM{' '}
			</div>
			<div className="mt-2 font-jamjuree text-xs font-normal text-white/80">
				Duration
			</div>
			<div className="mb-8 font-jamjuree text-sm font-medium text-white">
				November 15th - November 29th
			</div>
		</div>
	);
};

const MainMenu: React.FC = () => {
	const router = useRouter();
	const { showToast } = useToastContext();
	const { showRouterLoading } = useRouterLoadingContext();
	const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
	const { data: voteOpenStatus, reload } = useVoteOpenStatus();
	const handleToVote = async (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		const result: any = await reload();
		console.log('voteOpenStatus', voteOpenStatus, result);
		if (!result?.data) {
			e.preventDefault(); // 阻止默认跳转行为
			setIsMessageBoxOpen(true);
			return;
		}
		showRouterLoading('/vote');
		router.push('/vote');
	};

	return (
		<>
			<div className="flex h-20 w-full items-end justify-between px-6 pb-4 pt-3">
				{/* vote */}
				<Link
					href="/vote"
					onClick={e => handleToVote(e)}
					className="relative flex w-16 flex-col items-center justify-center gap-2 rounded-xl"
				>
					<img src="/img/icon/vote.svg" alt="vote" className="w-5" />
					{/* {voteOpenStatus && (
						<div className="absolute -top-[9px] right-[6px] h-5 w-5 rounded-full bg-custom-purple-005">
							<img src="/img/icon/vote-ring.gif" alt="ring" />
						</div>
					)} */}
					<div className="font-chakra text-xs font-bold uppercase tracking-widest text-white">
						Predict
					</div>
				</Link>
				{/* chat */}
				<Link
					href="/roles/v1"
					onClick={() => showRouterLoading('/roles/v1')}
					className="flex w-16 flex-col items-center justify-center gap-2 rounded-xl"
				>
					<img src="/img/icon/chat.svg" alt="vote" className="w-5" />
					<div className="font-chakra text-xs font-bold uppercase tracking-widest text-white">
						AI Agent
					</div>
				</Link>
				{/* spin */}
				<Link
					href="/roulette/hippo"
					onClick={() => showRouterLoading('/roulette/hippo')}
					className="flex w-16 flex-col items-center justify-center gap-2 rounded-xl"
				>
					<LoaderPinwheel className="w-5 text-white" />
					<div className="font-chakra text-xs font-bold uppercase tracking-widest text-white">
						Spin
					</div>
				</Link>
				{/* profile */}
				<Link
					href="/profile/v1"
					onClick={() => showRouterLoading('/profile/v1')}
					className="flex w-16 flex-col items-center justify-center gap-2 rounded-xl"
				>
					<UserRound className="w-5 text-white" />
					<div className="font-chakra text-xs font-bold uppercase tracking-widest text-white">
						Quest
					</div>
				</Link>
			</div>

			<MessageBox
				isOpen={isMessageBoxOpen}
				onClose={() => setIsMessageBoxOpen(false)}
				title="Event Open Soon"
				content={<VoteRules />}
				confirmText="Confirm"
				onConfirm={() => {
					setIsMessageBoxOpen(false);
				}}
			/>
		</>
	);
};

export default MainMenu;
