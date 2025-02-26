'use client';

import ConfirmModal from '@/app/_components/ConfirmModal/ConfirmModal';
import { GiftButton } from '@/app/_components/GiftButton/GiftButton';
import MainMenu from '@/app/_components/MainMenu/MainMenu';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { useRoleList } from '@/hooks/useRoleList';
import fetchAPI from '@/lib/api';
import { fetchBalance } from '@/lib/balanceApi';
import { setCharacters } from '@/store/slices/characterSlice';
import { AppDispatch, RootState } from '@/store/store';
import { CharacterRoleType } from '@/types/character.type';
import { useParams, useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OperateBar from '@/app/_components/OperateBar';
import QuizDrawer from '@/app/_components/QuizDrawer/QuizDrawer';
import EquipmentPanel from '@/app/_components/EquipmentPanel/EquipmentPanel';

const ChatRole: React.FC = () => {
	const [isActive, setIsActive] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isDrawerOpen, setDrawerOpen] = useState(false);
	const [isPanelOpen, setPanelOpen] = useState(false);
	const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
		null,
	);
	const params = useParams();
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const id = params.id as string;
	const account = useSelector((state: RootState) => state.accountInfo.account);
	const balance = useSelector((state: RootState) => state.balance);
	const { characters, error, isLoading, refreshCharacters } = useRoleList();
	const [roleData, setRoleData] = useState<CharacterRoleType>();

	const openModal = () => {
		setIsModalOpen(true);
	};

	const handleConfirm = () => {
		console.log('Confirmed');
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		console.log('Cancelled');
		setIsModalOpen(false);
	};

	const handleOpenDrawer = () => {
		setDrawerOpen(true);
	};

	const handleOpenOutfitPanel = () => {
		setPanelOpen(true);
	};

	useEffect(() => {
		if (account && account.id) {
			dispatch(fetchBalance(account?.id));
		}
	}, [dispatch, account]);

	useEffect(() => {
		if (error) {
			enqueueSnackbar('Get Role data fail', { variant: 'error' });
			router.push('/roles/v1');
		} else if (!isLoading) {
			setRoleData(characters[parseInt(id)]);
		}
	}, [isLoading, error, characters, id]);

	return (
		<div className="">
			{/* <div className="flex flex-col px-4 pb-24"> */}
			{isModalOpen && (
				<ConfirmModal
					title="Unlock New Scene"
					confirmText="10"
					cancelText="Skip"
					confirmIcon={
						<svg
							width="30"
							height="30"
							viewBox="0 0 30 30"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15ZM14.3853 9.96782C14.6259 8.9652 16.0427 8.93866 16.3207 9.93157L16.8123 11.6875L19.5912 11.2425C20.5483 11.0893 21.1419 12.2509 20.4568 12.9367L18.5435 14.852L20.1439 16.7913C20.8031 17.59 19.9625 18.741 19.001 18.3562L17.0835 17.5886L16.3141 20.4739C16.0458 21.4798 14.6106 21.4573 14.374 20.4435L13.7253 17.6635L11.5979 18.452C10.6271 18.8118 9.81642 17.6401 10.4954 16.8585L12.2439 14.8458L10.2281 12.9342C9.51902 12.2617 10.0962 11.0761 11.0629 11.2194L13.9811 11.652L14.3853 9.96782Z"
								fill="#FFA943"
							/>
						</svg>
					}
					onConfirm={handleConfirm}
					onCancel={handleCancel}
				/>
			)}
			<div className="my-4 text-center text-xl font-semibold">Chats</div>
			{roleData && (
				<>
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="relative h-12 w-12">
									<img
										src={roleData?.avatar}
										className="h-full w-full"
										alt="avatar"
									/>
									{/* <div
										className={`absolute h-3 w-3 rounded-full ${
											isActive ? 'bg-green-600' : 'bg-red-600'
										} bottom-0 right-0`}
									></div> */}
								</div>
								<div className="text-xl font-semibold">{roleData.name}</div>
							</div>
							<div className="flex gap-2">
								<OperateBar
									showChat={false}
									onOutfitClick={handleOpenOutfitPanel}
									onQuizClick={handleOpenDrawer}
								/>
								<div
									className="flex h-10 w-20 items-center gap-2 rounded-3xl bg-gray-200 px-2"
									onClick={openModal}
								>
									<svg
										width="30"
										height="30"
										viewBox="0 0 30 30"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15ZM14.3853 9.96782C14.6259 8.9652 16.0427 8.93866 16.3207 9.93157L16.8123 11.6875L19.5912 11.2425C20.5483 11.0893 21.1419 12.2509 20.4568 12.9367L18.5435 14.852L20.1439 16.7913C20.8031 17.59 19.9625 18.741 19.001 18.3562L17.0835 17.5886L16.3141 20.4739C16.0458 21.4798 14.6106 21.4573 14.374 20.4435L13.7253 17.6635L11.5979 18.452C10.6271 18.8118 9.81642 17.6401 10.4954 16.8585L12.2439 14.8458L10.2281 12.9342C9.51902 12.2617 10.0962 11.0761 11.0629 11.2194L13.9811 11.652L14.3853 9.96782Z"
											fill="#FFA943"
										/>
									</svg>
									{balance.gold}
								</div>
							</div>
						</div>
						<div className="relative h-full w-full">
							<img src={`/img/${roleData.backgroundImage}.png`} />
							<div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-opacity-50 bg-gradient-to-t from-gray-800 via-gray-800 p-4 text-white">
								<div className="text-sm font-thin">
									{roleData.backgroundStory}
								</div>
							</div>
						</div>
						<QuizDrawer
							isOpen={isDrawerOpen}
							onClose={() => setDrawerOpen(false)}
							userCharacterId={roleData.id || ''}
						/>
						<EquipmentPanel
							isOpen={isPanelOpen}
							onClose={() => setPanelOpen(false)}
							userCharacterId={roleData.id || ''}
							refreshCharacters={() => {
								refreshCharacters();
							}}
						/>
					</div>
				</>
			)}

			<GiftButton />
			<MainMenu />
		</div>
	);
};

export default withAuth(ChatRole);
