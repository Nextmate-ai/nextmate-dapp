'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { ChevronLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import fetchAPI from '@/lib/api';
import moment from 'moment';
import useSWR from 'swr';
import Link from 'next/link';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';

const fetcher = (url: string) => fetchAPI(url);

const dateFormat = 'MMM DD, YYYY HH:mm';

const TopUpHistory = () => {
	const router = useRouter();
	const { showRouterLoading } = useRouterLoadingContext();
	const { data, error } = useSWR('/api/balance/top-up/logs', fetcher);
	const topUpHistory = data?.data || [];

	const clickBack = () => {
		router.back();
	};

	return (
		<div className="h-full w-full bg-bg-purple bg-cover p-4 pb-7 text-white">
			<div className="ml-3 flex pt-2">
				<ChevronLeft onClick={clickBack} />
				<span className="ml-5">Top Up History</span>
			</div>
			<div className="relative">
				<img
					src="/img/history-border.png"
					className="absolute h-[calc(100vh-80px)] w-full"
				/>
				<div className="h-7"></div>
				<div className="no-scrollbar relative h-[calc(100vh-104px)] overflow-y-auto px-6">
					{topUpHistory.map((item, index) => (
						<Link
							href={`/topup/history/detail/${item.txnHash}?data=${JSON.stringify(item)}`}
							className="flex justify-between border-b border-white/10 py-4"
							key={item.txHash}
							onClick={() =>
								showRouterLoading(
									`/topup/history/detail/${item.txnHash}?data=${JSON.stringify(item)}`,
								)
							}
						>
							<div className="flex">
								<img className="h-12 w-12" src="/img/icon/coin.png" />
								<div className="ml-3">
									<p className="text-xl font-medium">Gold Coin</p>
									<span className="text-sm text-[#ACA8FF]">
										{moment(item.timestamp).format(dateFormat)}
									</span>
								</div>
							</div>
							<div className="flex items-center">
								<div>
									<p className="text-right text-xl font-medium text-[#FFE716]">
										+{item.rewardGold}
									</p>
									<span className="text-sm">
										- {item.amount} {item.tokenSymbol}
									</span>
								</div>
								<img
									className="ml-3 h-3 w-3 text-right"
									src="/img/icon/arrow-right-solid.png"
								/>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default withAuth(TopUpHistory);
