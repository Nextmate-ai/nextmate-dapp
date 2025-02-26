'use client';

import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useCallback,
	useEffect,
	useRef,
} from 'react';
import ToastModal from './ToastModal';
import { usePathname } from 'next/navigation';

interface ToastContextType {
	showToast: (
		content: string,
		type?: 'success' | 'error' | 'info',
		pos?: 'top' | 'bottom' | 'center',
		autoClose?: boolean,
	) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [content, setContent] = useState('');
	const [type, setType] = useState<'success' | 'error' | 'info'>('success');
	const [position, setPosition] = useState<'top' | 'bottom' | 'center'>(
		'bottom',
	);
	const pathname = usePathname();
	const prevPathRef = useRef(pathname);

	const showToast = useCallback(
		(
			message: string,
			toastType: 'success' | 'error' | 'info' = 'success',
			pos: 'top' | 'bottom' | 'center' = 'bottom',
			autoClose: boolean = true,
		) => {
			setContent(message);
			setType(toastType);
			setPosition(pos);
			setIsOpen(true);
			if (autoClose && message.length < 35) {
				// 报错信息小于35字符自动关闭
				setTimeout(() => {
					setIsOpen(false);
				}, 1500);
			}
		},
		[],
	);

	useEffect(() => {
		if (prevPathRef.current !== pathname) {
			setIsOpen(false);
			prevPathRef.current = pathname;
		}
	}, [pathname]);

	const closeToast = useCallback(() => setIsOpen(false), []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<ToastModal
				isOpen={isOpen}
				content={content}
				type={type}
				position={position}
				onClose={closeToast}
			/>
		</ToastContext.Provider>
	);
};

export const useToastContext = () => {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
};
