import React from 'react';

interface Equipment {
	id: string;
	name: string;
	description: string;
	type: string;
	image: string;
	attributes: {
		[key: string]: any;
	};
}

interface EquipmentCardProps {
	equipment: Equipment;
	count: number;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, count }) => {
	return (
		<div className="rounded-lg bg-white p-4 shadow-md">
			<img
				src={equipment.image}
				alt={equipment.name}
				className="mb-4 h-48 w-full rounded-lg object-cover"
			/>
			<h3 className="mb-2 text-lg font-bold">{equipment.name}</h3>
			<p className="mb-2 text-sm text-gray-700">{equipment.description}</p>
			<p className="text-xs text-gray-500">Count: {count}</p>
		</div>
	);
};

export default EquipmentCard;
