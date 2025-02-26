import { Plus } from 'lucide-react';
import React from 'react';

interface BalanceButtonProps {
	count: number;
	iconSrc: string;
	onIncrement: () => void; // 增加的操作
}

const BalanceButton: React.FC<BalanceButtonProps> = ({
	count,
	iconSrc,
	onIncrement,
}) => {
	return (
		<div className="flex h-10 w-[120px] items-center justify-between overflow-hidden rounded-full border bg-custom-gray-001 pl-1 pr-2 shadow-sm">
			<div className="flex items-center pl-2">
				<img src={iconSrc} alt="Icon" className="h-6 w-6" />
				<span className="mx-2 text-lg font-medium">{count}</span>
			</div>
			<Plus color="gray" className="rounded-full bg-gray-300" />
		</div>
	);
};

export default BalanceButton;
