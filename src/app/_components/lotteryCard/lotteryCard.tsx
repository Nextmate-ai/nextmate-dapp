import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface CardProps {
	title: string;
	image: string;
	lotteryType: string;
	type: string;
	description?: string;
	rating: number;
	onTradeAgain: () => void;
	onClose: () => void;
}

const LotteryCard: React.FC<CardProps> = ({
	title,
	image,
	lotteryType,
	type,
	description,
	rating,
	onTradeAgain,
	onClose,
}) => {
	const [showDetails, setShowDetails] = useState(false);
	const descRef = useRef<HTMLDivElement>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	useEffect(() => {
		const descElement = descRef.current;
		if (descElement) {
			setIsOverflowing(descElement.scrollHeight > descElement.clientHeight);
		}
	}, [description]);

	const handleClick = () => {
		setShowDetails(!showDetails); // Toggle the details view
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50 p-4">
			<div className="relative max-h-[777px] w-full overflow-hidden rounded-lg bg-yellow-300 shadow-lg">
				<div className="flex max-h-[777px] flex-col items-center overflow-scroll p-4">
					<X
						className="absolute right-4 top-4 text-gray-500"
						onClick={onClose}
					/>
					<p className="mt-16 text-2xl font-extrabold">Congratulations</p>
					<p className="my-5 text-2xl font-thin">{type}</p>
					<img
						src={`/img/${image}`}
						className="mb-5 h-64 w-64 flex-shrink-0 flex-grow-0 rounded-full bg-slate-400"
					/>
					{/* <div className="mb-5 h-64 w-64 flex-shrink-0 flex-grow-0 rounded-full bg-slate-400"></div> */}
					<h1 className="text-3xl font-extrabold">{title}</h1>
					<div className="mt-2 flex justify-center">
						{Array.from({ length: 5 }, (_, i) => (
							<span
								key={i}
								className={`text-3xl ${i < rating ? 'text-purple-500' : 'text-gray-400'}`}
							>
								★
							</span>
						))}
					</div>
					{description && (
						<div
							className={`relative mt-2 w-full ${!showDetails && isOverflowing ? 'overflow-hidden' : ''}`}
							ref={descRef}
						>
							<p
								className={`text-gray-700 ${showDetails ? 'max-h-full' : 'line-clamp-3'}`}
							>
								{description}
							</p>
							{!showDetails && (
								<div
									className="absolute inset-x-0 bottom-0 h-12 cursor-pointer"
									style={{
										background:
											'linear-gradient(to top, rgb(253 224 71) 0%, rgb(253 224 71) 10%, transparent 100%)',
									}}
									onClick={handleClick}
								/>
							)}
						</div>
					)}
					<div className="mt-4 flex w-full flex-col justify-between gap-4">
						<button
							className="flex items-center justify-center rounded-full bg-purple-600 px-4 py-2 text-white"
							onClick={onTradeAgain}
						>
							<span className="mr-2">Trade Again</span>
							<img
								src={
									lotteryType === 'normal'
										? '/img/icon/diamond.png'
										: '/img/icon/coin.png'
								}
								width={30}
								height={30}
								className="mx-2"
							/>
							<span className="mr-2">500</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LotteryCard;
