'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import fetchAPI from '@/lib/api';
import moment from 'moment';
import useSWR from 'swr';
import { formatUnits } from 'viem';
import { useFetchUsdtRecord } from '@/hooks/useFetchUsdtRecord';

const fetcher = (url: string) => fetchAPI(url);

const dateFormat = 'MMM DD, YYYY HH:mm';

const UsdtHistory = () => {
	const router = useRouter();
	const [filterDate, setFilterDate] = useState<any[]>([]);

	const { data: usdtRecordData, reload: reloadUsdtRecord } =
		useFetchUsdtRecord();

	useEffect(() => {
		if (usdtRecordData.length > 0) {
			const filterData = usdtRecordData.filter(item => {
				return item.trx < 0;
			});
			console.log('filterData', filterData, usdtRecordData);
			setFilterDate(filterData);
		}
	}, [usdtRecordData]);

	const clickBack = () => {
		router.back();
	};

	return (
		<div className="h-full w-full bg-bg-orange bg-cover p-4 pb-7 text-white">
			<div className="ml-3 flex pt-2">
				<ChevronLeft onClick={clickBack} />
				<span className="ml-5">Sunpump History</span>
			</div>
			<div className="relative">
				<img
					src="/img/orange-history-border.png"
					className="absolute h-[calc(100vh-80px)] w-full"
				/>
				<div className="h-7"></div>
				<div className="no-scrollbar relative h-[calc(100vh-114px)] overflow-y-auto px-6">
					{filterDate.map((item, index) => (
						<div
							className="flex justify-between border-b border-white/10 py-4"
							key={item.id}
						>
							<div className="flex">
								<img className="h-12 w-12" src="/img/TRX.png" />
								<div className="ml-3">
									<p className="text-xl font-medium">{item.updateType}</p>
									<span className="text-sm text-white/80">
										{moment(item.createdAt).format(dateFormat)}
									</span>
								</div>
							</div>
							<div className="flex items-center">
								<p className="text-right text-xl font-medium text-[#FFE716]">
									{item.trx > 0 ? '+' : ''}
									{item.trx}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default withAuth(UsdtHistory);
