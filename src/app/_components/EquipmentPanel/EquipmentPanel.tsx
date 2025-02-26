import React, { useEffect, useMemo, useState } from 'react';
import { Clock, SearchCheck, X, ChevronLeft } from 'lucide-react';
import { useRoleList } from '@/hooks/useRoleList';
import clsx from 'clsx';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import fetchAPI from '@/lib/api';
import { useCharacterEquipment } from '@/hooks/useUserEquipment';
import EquipmentSwiper from '../EquipmentSwiper/EquipmentSwiper';

interface EquipmentPanelProps {
	isOpen: boolean;
	onClose: () => void;
	userCharacterId: string;
	refreshCharacters: () => void;
}

function parseOutfitBenefits(text) {
	const pattern =
		/(Increases|Decreases) (\w+)(?: value| gain speed) by (\d+(?:\.\d+)?)%/;
	const match = text.match(pattern);

	if (match) {
		return {
			action: match[1].toLowerCase(),
			type: match[2],
			number: match[3] + '%',
		};
	}

	return null; // 如果没有匹配
}

const EquipmentPanel: React.FC<EquipmentPanelProps> = ({
	isOpen,
	onClose,
	userCharacterId,
	refreshCharacters,
}) => {
	const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
	const [selectedItem, setSelectedItem] = useState<string | null>(null);
	const [isModalOpen, setModalOpen] = useState<boolean>(false);
	const [isEquipmented, setIsEquipmented] = useState<boolean>(false);
	const [tab, setTab] = useState<'Outfit' | 'Item' | null>('Outfit');
	const { getCharacter, error, isLoading } = useRoleList();

	const character = useMemo(
		() => getCharacter(userCharacterId),
		[getCharacter, userCharacterId],
	);

	const state = useSelector((state: RootState) => state);

	useEffect(() => {
		if (character?.equipmentName) {
			setSelectedOutfit(character.equipmentName);
			setIsEquipmented(true);
		} else {
			setSelectedOutfit('');
			setIsEquipmented(false);
		}
	}, [character?.equipmentName]);

	// 换装备后更新数值 todo
	const handleUpdateEffect = async (benefit: string, userId: string) => {
		try {
			const res = parseOutfitBenefits(benefit);
			// 上传intimate
			// const data = await fetchAPI('/api/lottery', {
			//   method: 'POST',
			//   body: { type, numDraws, userId },
			// });
		} catch (error) {
			console.error('Failed to draw lottery:', error);
		}
	};

	const saveEquipment = async () => {
		try {
			await fetchAPI('/api/roles/userCharacters', {
				method: 'POST',
				body: { userCharacterId, equipmentName: selectedOutfit },
			});
			setIsEquipmented(true);
			onClose();
			refreshCharacters();
		} catch (error) {
			console.error('Failed to save equipment:', error);
		}
	};

	const clickEquipment = (index: number) => {
		const outfit = equipments[index];

		if (selectedOutfit && outfit.name === selectedOutfit) {
			setSelectedOutfit('');
			setIsEquipmented(false);
		} else {
			setSelectedOutfit(outfit.name);
			setIsEquipmented(true);
		}
	};

	const handleBack = () => {
		if (isEquipmented) {
			if (character?.equipmentName) {
				setSelectedOutfit(character.equipmentName);
				setIsEquipmented(true);
			} else {
				setSelectedOutfit('');
				setIsEquipmented(false);
			}

			onClose();
		} else {
			setSelectedOutfit('');
			setIsEquipmented(false);
			onClose();
		}
	};

	const characterEquipment = useCharacterEquipment(character?.id);
	const equipments = characterEquipment.data?.data?.equipments;

	return (
		<>
			<div
				className={`no-scrollbar fixed bottom-0 left-0 right-0 top-0 transform bg-bg-purple bg-cover ${isOpen ? 'translate-y-0' : 'translate-y-full'} z-50 mx-auto h-screen max-w-lg overflow-y-scroll bg-white shadow-lg transition-transform duration-300`}
			>
				<div className="relative flex h-full w-full flex-col items-center justify-center">
					{/* top bar */}
					<div className="inline-flex w-full items-center justify-between px-3 py-4">
						<div className="relative h-6 w-32">
							<div className="absolute left-[52px] top-0 font-jamjuree text-xl font-semibold text-white">
								OUTFIT
							</div>
							{/* back */}
							<ChevronLeft
								color="white"
								className="absolute left-0 top-[1px] h-6 w-6"
								onClick={handleBack}
							/>
						</div>
						{/* save */}
						<div className="relative h-10 w-36">
							<img
								src="/img/save-btn.png"
								alt="save"
								className="w-full"
								onClick={saveEquipment}
							/>
						</div>
					</div>

					<div className="relative mt-2 flex min-h-[54vh] w-full flex-1 px-3">
						{/* 主要内容区域 */}
						<div className="relative flex w-full items-stretch">
							<img
								className="absolute h-full w-full"
								src={'/img/bg-equipment.png'}
							/>
							{/* character */}
							<div className="absolute inset-0 flex items-end justify-center p-2">
								{character?.name && (
									<img
										src={`/img/${selectedOutfit ? `${character.name.toLowerCase()}_${selectedOutfit}` : `${character.name.toLowerCase()}-pure`}.png`}
										className="min-h-[80vh] w-auto object-cover"
										alt={`${character.name} ${selectedOutfit || 'pure'}`}
									/>
								)}
							</div>
							{/* name */}
							<div className="absolute left-4 top-[38vh] z-10">
								{character?.name && (
									<div className="flex flex-col items-start justify-center">
										<div className="text-gradient bg-text-gradient font-jamjuree text-3xl font-semibold uppercase tracking-widest text-white">
											{/* 上线后才反馈要改名字，牵扯的地方多就做个特殊判断了 */}
											{character?.name === 'Dragon'
												? 'DGTRON'
												: character?.name}
										</div>
										<div className="mt-3 flex h-3 items-center justify-start gap-2">
											<div className="h-3 w-3 rounded-sm bg-white/80" />
											<div className="h-3 w-3 rounded-sm bg-white/80" />
											<div className="h-3 w-3 rounded-sm bg-white/80" />
											<div className="h-3 w-3 rounded-sm bg-white/80" />
											<div className="h-3 w-3 rounded-sm bg-white/80" />
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
					{/* 底部遮罩 */}
					<div className="absolute bottom-0 h-1/2 w-full bg-gradient-to-b" />
					{/* 装备swiper */}
					<div className="absolute bottom-6 z-10 h-64 w-full">
						<EquipmentSwiper
							equipments={equipments}
							selectedOutfit={selectedOutfit}
							clickEquipment={clickEquipment}
						></EquipmentSwiper>
					</div>

					{/* <div className="mb-2 mt-12 flex">
					<div
						className={clsx(
							tab === 'Outfit' && 'font-bold',
							'flex w-16 items-center justify-center rounded-l-2xl bg-slate-600 text-white',
						)}
						onClick={() => {
							setTab('Outfit');
						}}
					>
						Outfit
					</div>
					<div
						className={clsx(
							tab === 'Item' && 'font-bold',
							'flex w-16 items-center justify-center rounded-r-2xl bg-slate-600 text-white',
						)}
						onClick={() => {
							setTab('Item');
						}}
					>
						Item
					</div>
				</div> */}

					{/* {tab === 'Outfit' ? (
					<div className="grid w-full grid-cols-3">
						{equipments
							?.filter(item => item.type === 'outfit')
							.map((outfit, i) => {
								return (
									<div
										key={i}
										className={clsx('relative h-[130px] w-auto rounded-xl')}
										onClick={() => {
											if (selectedOutfit && outfit.name === selectedOutfit) {
												setSelectedOutfit('');
											} else {
												setSelectedOutfit(outfit.name);
											}
										}}
									>
										<div
											className="absolute left-0 top-0 flex h-[18px] w-8 items-center justify-center overflow-hidden rounded-tl-xl text-white"
											style={{
												background:
													'linear-gradient(132.12deg, #FCD25B -18.99%, rgba(110, 103, 246, 0.6) -11.42%, rgba(255, 0, 0, 0.5) 111%)',
											}}
										>
											{'R'}
										</div>
										<img
											src={`/img/${outfit.name}.png`}
											className="h-[130px] w-full object-contain"
											alt="equipment"
										/>
										<div
											className={clsx(
												outfit.name !== selectedOutfit && 'hidden',
												'absolute bottom-10 left-0 z-20 flex h-12 w-full items-center justify-center bg-black/20 text-white',
											)}
										>
											isEquipmented
										</div>
									</div>
								);
							})}
					</div>
				) : (
					<div className="grid w-full grid-cols-3">
						{equipments
							?.filter(item => item.type === 'item')
							.map((item, i) => (
								<div
									key={i}
									className="relative h-[130px] w-auto rounded-xl"
									onClick={() => {
										setSelectedItem(item.name);
										setModalOpen(true);
									}}
								>
									<div
										className="absolute left-0 top-0 flex h-[18px] w-8 items-center justify-center overflow-hidden rounded-tl-xl text-white"
										style={{
											background:
												'linear-gradient(132.12deg, #FCD25B -18.99%, rgba(110, 103, 246, 0.6) -11.42%, rgba(255, 0, 0, 0.5) 111%)',
										}}
									>
										{'R'}
									</div>
									<img
										src={item.name}
										className="h-[130px] w-full object-contain"
										alt="equipment"
									/>
								</div>
							))}
					</div>
				)} */}
					{isModalOpen && (
						<div className="absolute left-[22%] top-[33%] flex h-20 w-60 justify-between gap-2 rounded-3xl border border-black/40 bg-white px-10">
							<button onClick={() => setModalOpen(false)}>Cancel</button>
							<button
								onClick={() => {
									setModalOpen(false);
									// save the energy/
								}}
							>
								Confirm
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default EquipmentPanel;
