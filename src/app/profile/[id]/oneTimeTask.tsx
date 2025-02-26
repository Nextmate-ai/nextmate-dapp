import { Task } from '@/hooks/useTaskList';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';
import { CHAIN } from '@/app/constants/chains';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useTaskList } from '@/hooks/useTaskList';
import { RootState } from '@/store/store';
import { postEvent } from '@telegram-apps/sdk';
import { useSelector } from 'react-redux';
import fetchAPI from '@/lib/api';
import { useEffect } from 'react';
import { useState } from 'react';

const OneTimeTask = () => {
	const { loading, conectOkxWallet, connectTronWallet } = useConnectWallet();
	const { tasks, isLoading, reload: reloadTaskList } = useTaskList();
	const { showToast } = useToastContext();
	const wallet = useSelector((state: RootState) => state.wallet);
	const [filterTasks, setFilterTasks] = useState<Task[]>([]);

	useEffect(() => {
		setFilterTasks(
			tasks.filter(item => item.band !== 'bitget' && item.band !== 'osl'),
		);
		console.log(
			'filterTasks',
			tasks.filter(item => item.band === 'bitget'),
		);
	}, [tasks]);

	/**
	 * 任务事件
	 * @param item
	 * @returns
	 */
	const handleTaskClick = async (item: any) => {
		console.log('item', item);
		if (item.status === 'canClaim') {
			console.log('item.isClaimed', item.isClicked);
			claimTask(item, 'claimed');
			return;
		} else if (item.status === 'init') {
			if (item.taskLink.includes('http')) {
				if (item.taskLink.includes('t.me')) {
					const url = item.taskLink.slice(12);
					postEvent('web_app_open_tg_link', { path_full: url });
				} else {
					postEvent('web_app_open_link', {
						url: item.taskLink,
						try_instant_view: true,
					});
				}
			} else if (item.taskLink === 'connect-wallet') {
				if (wallet.provider) {
					conectOkxWallet(CHAIN.BASE);
				}
			}
			claimTask(item, 'canClaim');
		}
	};

	/**
	 * 领取任务奖励 gold coin
	 * @param item
	 * @returns
	 */
	const claimTask = async (item: Task, status: string) => {
		const res = await fetchAPI('/api/task/claim', {
			method: 'POST',
			body: { taskId: item.id, status },
		});
		if (res.success) {
			reloadTaskList();
		}
	};

	return (
		<>
			{!isLoading && (
				<div className="mt-1 flex w-full flex-col">
					{filterTasks.map((item, index) => (
						<div
							key={item.id}
							className={`mb-4 mt-2 flex h-12 items-center justify-between bg-[#6e67f6]/10 p-3 shadow-[0_0_10px_#6E67F6] ${
								item.status === 'claimed' ? 'opacity-50' : ''
							}`}
							onClick={() => handleTaskClick(item)}
						>
							<div className="flex items-center justify-center gap-3">
								<img src={item.logo} alt="logo" className="w-4" />
								<div
									className="w-40 font-jamjuree text-xs font-medium tracking-widest text-white"
									dangerouslySetInnerHTML={{ __html: item.title }}
								></div>
							</div>
							<div className="flex items-center justify-center">
								<span className="mr-[4px] text-right font-jamjuree text-sm text-white">
									{item.amount}
								</span>
								<img
									src={`/img/icon/${item.awardType}.svg`}
									alt=""
									className="mr-2 w-4"
								/>
								{item.status === 'claimed' ? (
									<img
										src="/img/icon/check-success.svg"
										alt="check"
										className="w-4"
									/>
								) : (
									<div
										className={`rectangle font-chakra text-white ${
											item.status === 'canClaim'
												? 'bg-[#F2BC1A]'
												: 'bg-[#6E67F6]'
										}`}
										onClick={() => handleTaskClick(item)}
									>
										{item.status === 'canClaim' ? 'CLAIM' : 'GO'}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default OneTimeTask;
