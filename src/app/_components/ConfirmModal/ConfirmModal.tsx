import React from 'react';

interface ModalProps {
	title: string;
	imageUrl?: string;
	confirmText: string;
	cancelText: string;
	confirmIcon?: React.ReactNode;
	onConfirm: () => void;
	onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({
	title,
	imageUrl,
	confirmText,
	cancelText,
	confirmIcon,
	onConfirm,
	onCancel,
}) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="w-80 rounded-lg bg-white p-6 shadow-lg">
				<h2 className="mb-4 text-center text-xl font-bold">{title}</h2>
				{imageUrl && (
					<div className="mb-4 flex justify-center">
						<img
							src={imageUrl}
							alt="Modal"
							className="h-32 w-32 rounded-lg object-cover"
						/>
					</div>
				)}
				<div className="mt-4 flex items-center justify-around">
					<button
						onClick={onConfirm}
						className="mr-2 flex h-10 w-1/2 items-center justify-center rounded-lg bg-gray-200 px-4"
					>
						{confirmIcon && <span className="mr-2">{confirmIcon}</span>}
						{confirmText}
					</button>
					<button
						onClick={onCancel}
						className="w-1/2 rounded-lg bg-gray-200 px-4 py-2"
					>
						{cancelText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
