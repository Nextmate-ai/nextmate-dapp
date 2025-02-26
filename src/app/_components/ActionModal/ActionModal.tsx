import fetchAPI from '@/lib/api';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

interface ActionButton {
	text: string;
	icon?: React.ReactNode;
	price?: number;
	onClick: () => void;
}
interface ActionModalProps {
	actions: ActionButton[];
	onCancel: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ actions, onCancel }) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="w-80 rounded-lg bg-white p-6 shadow-lg">
				{actions.map((action, index) => (
					<button
						key={index}
						onClick={action.onClick}
						className="mb-2 flex h-12 w-full items-center justify-between rounded-full bg-custom-purple-004 px-4 py-2 text-white"
					>
						<span className="flex items-center">{action.text}</span>
						{action.price !== undefined && (
							<div className="flex items-center">
								{action.icon && <span className="mr-2">{action.icon}</span>}
								{action.price}
							</div>
						)}
					</button>
				))}
				<button
					onClick={onCancel}
					className="mt-2 h-12 w-full rounded-full bg-gray-200 px-4 py-2 text-black"
				>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default ActionModal;
