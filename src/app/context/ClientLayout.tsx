'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import fetchAPI from '@/lib/api';
import { postEvent } from '@telegram-apps/sdk';

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();

	useEffect(() => {
		try {
			postEvent('web_app_expand');
		} catch (error) {
			console.log(error);
		}

		const startRest = async () => {
			fetchAPI('/api/energy/start', {
				method: 'POST',
			});
		};

		const stopRest = async () => {
			fetchAPI('/api/energy/stop', {
				method: 'POST',
			});
		};

		// 初始加载时结算能量并根据路径进行处理
		const handleInitialLoad = async () => {
			if (pathname.startsWith('/communicate')) {
				stopRest();
			} else {
				startRest();
			}
		};

		handleInitialLoad();
	}, [pathname]);

	return <div className="mx-auto h-full w-full">{children}</div>;
};

export default ClientLayout;
