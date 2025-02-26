'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import ConnectModalContent from './ConnectModalContent';
import DisconnectModalContent from './DisconnectModalContent';
import { ModalProps } from './types';

const Modal: React.FC<ModalProps> = props => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, []);

	if (!mounted) return null;

	const modalContent = (
		<div
			className="fixed bottom-0 left-0 z-[999] h-screen w-screen bg-black bg-opacity-60"
			onClick={e => {
				if (e.target === e.currentTarget) {
					props.onClose();
				}
			}}
		>
			{props.type === 'connect' ? (
				<ConnectModalContent {...props} />
			) : (
				<DisconnectModalContent {...props} />
			)}
		</div>
	);

	return createPortal(modalContent, document.body);
};

export default Modal;
