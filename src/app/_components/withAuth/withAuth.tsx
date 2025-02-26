'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setAccount, setChain } from '@/store/slices/accountInfoSlice';
import { RootState } from '@/store/store';

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
	return function WithAuth(props: P) {
		const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
			null,
		);
		const router = useRouter();
		const dispatch = useDispatch();
		const account = useSelector(
			(state: RootState) => state.accountInfo,
		).account;

		useEffect(() => {
			// if (status === 'loading') return;

			if (account?.accountId) {
				// 使用完整的用户数据更新 Redux store
				// dispatch(setAccount(session.user));
				// localStorage.setItem('userInfo', JSON.stringify(session.user));
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
				router.push('/');
			}
		}, [account?.accountId, dispatch, router]);

		useEffect(() => {
			const chainInfo = localStorage.getItem('chainInfo');
			if (chainInfo) {
				dispatch(setChain(JSON.parse(chainInfo)));
			}
		}, [dispatch]);

		if (isAuthenticated === null) {
			return <div>Loading...</div>;
		}

		if (isAuthenticated === false) {
			return null;
		}

		return <Component {...props} />;
	};
}
