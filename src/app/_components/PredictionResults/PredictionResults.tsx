import React from 'react';
import Lottie from 'react-lottie-player';
import dropGoldJson from '@/assets/animation/drop-gold.json';
import sadJson from '@/assets/animation/sad.json';

interface PredictionResultsProps {
	result: boolean;
	uAmount?: number;
	claimType: string;
	glodAmount?: number;
	clickModel: () => void;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({
	result,
	uAmount,
	claimType = 'USDT',
	glodAmount,
	clickModel,
}) => {
	const title = result ? 'Congrats!' : 'Better Luck Next Time!';
	const content = result
		? 'You guessed right and won'
		: 'You guessed wrong but still earned';

	return (
		<div
			onClick={clickModel}
			className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center bg-black bg-opacity-80"
		>
			<p className="text-[32px] font-medium text-white">{title}</p>
			<p className="mb-7 mt-3 w-full text-center text-2xl font-medium text-white">
				{content}
			</p>
			{+uAmount > 0 && (
				<p className="text-center text-[40px] font-semibold text-custom-yellow-010">
					{uAmount} {claimType}
				</p>
			)}
			<div className="mb-3 flex items-center">
				<span className="mr-2 text-center text-[40px] font-semibold text-custom-yellow-010">
					{glodAmount}
				</span>
				<img className="h-10 w-10" src="/img/icon/coin.png" alt="gold" />
			</div>
			{result ? (
				<Lottie
					animationData={dropGoldJson}
					play
					loop
					style={{ width: 300, height: 200 }}
				/>
			) : (
				<Lottie
					animationData={sadJson}
					play
					loop
					style={{ width: 300, height: 200 }}
				/>
			)}
		</div>
	);
};

export default PredictionResults;
