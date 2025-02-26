import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

interface RouletteResultProps {
	isOpen: boolean;
	history: any;
	type: string;
	onClose: () => void;
}

const RouletteResultDrawer: React.FC<RouletteResultProps> = ({
	isOpen,
	onClose,
	history,
	type,
}) => {
	// 时间戳转换函数
	const convertTimestamp = (ts: number): string => {
		const date = new Date(ts * 1000); // 转换为毫秒
		return date.toISOString().slice(0, 19).replace('T', ' '); // 格式化日期
	};

	const getBackground = (type: string) => {
		switch (type) {
			case 'sunpump':
				return 'bg-bg-orange';
			case 'sundog':
				return 'bg-bg-red';
			case 'moe':
				return 'bg-bg-gray';
			case 'hippo':
				return 'bg-bg-blue';
			default:
				return 'bg-bg-purple';
		}
	};

	const getHistoryBorder = (type: string) => {
		switch (type) {
			case 'sunpump':
				return '/img/orange-history-border.png';
			case 'sundog':
				return '/img/red-history-border.png';
			case 'moe':
				return '/img/gray-history-border.png';
			case 'hippo':
				return '/img/blue-history-border.png';
			default:
				return '/img/bg-spin.png';
		}
	};

	const getPrizeImage = (type: string) => {
		switch (type) {
			case 'DIAMOND':
				return `/img/icon/diamond.svg`;
			case 'TRON_USDT':
				return `/img/USDT.png`;
			case 'TRX':
				return `/img/TRX.png`;
			case 'GOLD':
				return `/img/icon/coin.svg`;
			case 'SUNDOG':
				return `/img/SUNDOG-token.png`;
			case 'MOE':
				return `/img/Moe-token.png`;
			case 'HIPPO':
				return `/img/Hippo-token.png`;
			case 'EQUIPMENT':
				return `/img/equipment.png`;
			default:
				return '/img/icon/coin.svg';
		}
	};

	const getPrizeName = (item: any) => {
		switch (item?.type) {
			case 'DIAMOND':
				return `GEMS`;
			case 'TRON_USDT':
				return `USDT`;
			case 'TRX':
				return `TRX`;
			case 'GOLD':
				return `GOLD COINS`;
			case 'SUNDOG':
				return 'SUNDOG';
			case 'MOE':
				return 'MOE';
			case 'HIPPO':
				return 'HIPPO';
			case 'EQUIPMENT':
				return item.name;
			default:
				return 'GOLD COINS';
		}
	};

	return (
		<>
			{isOpen && (
				<div
					className={`fixed inset-0 z-50 h-screen max-h-screen w-full translate-y-0 transform flex-col bg-cover transition-transform duration-300 ${getBackground(
						type,
					)}`}
				>
					<div className="flex h-full w-full flex-col items-center justify-start px-3 pb-4">
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
						{/* history */}
						<div className="relative flex w-full flex-1 items-stretch shadow-md">
							<img className="absolute h-full" src={getHistoryBorder(type)} />

							<div className="z-10 mt-8 max-h-[calc(100vh-90px)] flex-1 overflow-y-auto px-3">
								{history.map((item: any, index: number) => (
									<div
										key={index}
										className="flex w-full items-center justify-between border-b border-solid border-white/10 p-3"
									>
										<div className="flex items-start justify-start gap-3">
											<img
												className="h-12 w-12"
												src={getPrizeImage(item.type)}
												alt={item.type}
											/>
											<div className="inline-flex flex-col items-start justify-start gap-1">
												<div className="w-36 font-jamjuree text-xl font-medium text-white">
													{getPrizeName(item)}
												</div>
												{item.timestamp && (
													<div className="self-stretch font-jamjuree text-sm font-normal text-[#aca8ff]">
														{convertTimestamp(item.timestamp)}
													</div>
												)}
											</div>
										</div>
										<div className="font-jamjuree text-xl font-medium text-white">
											+{item.amount}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default RouletteResultDrawer;
