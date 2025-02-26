'use client';
import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { usePathname } from 'next/navigation';
import './RouterLoading.css';

interface RouterLoadingContextType {
	showRouterLoading: (path: string) => void;
}

const RouterLoadingContext = createContext<RouterLoadingContextType>({
	showRouterLoading: () => () => {},
});

export const RouterLoadingProvider = ({ children }) => {
	const [showLoading, setShowLoading] = useState(false);
	const pathname = usePathname();
	const prevPathRef = useRef(pathname);

	useEffect(() => {
		// 只有在路由发生变化时才显示 loading
		if (prevPathRef.current !== pathname) {
			setShowLoading(true);

			// 使用 requestAnimationFrame 确保在下一帧再隐藏 loading
			// 这样可以确保 loading 动画能够显示出来
			requestAnimationFrame(() => {
				setShowLoading(false);
				prevPathRef.current = pathname;
			});
		}
	}, [pathname]);

	const showRouterLoading = path => {
		// 只在路由不同时才显示 loading
		if (pathname !== path) {
			setShowLoading(true);
		}
	};

	return (
		<RouterLoadingContext.Provider value={{ showRouterLoading }}>
			{children}
			{showLoading && (
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<div className="three-body">
						<div className="three-body__dot"></div>
						<div className="three-body__dot"></div>
						<div className="three-body__dot"></div>
					</div>
				</div>
			)}
		</RouterLoadingContext.Provider>
	);
};

export const useRouterLoadingContext = () => {
	const context = useContext(RouterLoadingContext);
	return context;
};
