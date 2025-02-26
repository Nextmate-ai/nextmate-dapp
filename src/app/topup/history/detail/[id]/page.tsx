'use client';
import { CHAIN } from '@/app/constants/chains';
import { ChevronLeft } from 'lucide-react';
import moment from 'moment';
import { useRouter, useSearchParams } from 'next/navigation';

const dateFormat = 'MMM DD, YYYY HH:mm';

const Detail = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const dataFromUl = searchParams.get('data');
	let data = {} as any;
	if (dataFromUl) {
		data = JSON.parse(dataFromUl);
	}

	const clickBack = () => {
		router.back();
	};

	return (
		<div className="h-full w-full bg-bg-purple bg-cover p-4 pb-7 text-white">
			<div className="ml-3 flex pt-2">
				<ChevronLeft onClick={clickBack} />
				<span className="ml-5">Top Up Details</span>
			</div>
			<div className="relative mt-5 flex h-[120px] items-center justify-center">
				<img
					className="absolute h-full w-full"
					src="/img/topup-detail-bg-money.png"
				/>
				<div className="relative flex items-center">
					<span className="mr-4 text-[56px] font-medium text-[#FFE716]">
						+ {data.rewardGold}
					</span>
					<img className="h-12 w-12" src="/img/icon/coin.svg" />
				</div>
			</div>
			<div className="mt-6">
				<div className="flex justify-between border-b border-white/10 px-3 py-4">
					<span>Crypto Currency</span>
					<span>
						-{data.amount} {data.tokenSymbol}
					</span>
				</div>
				<div className="flex justify-between border-b border-white/10 px-3 py-4">
					<span>Network</span>
					<span>{data.chainType.toUpperCase()}</span>
				</div>
				<div className="flex justify-between border-b border-white/10 px-3 py-4">
					<span>Address</span>
					<span className="max-w-48 break-words text-right">
						{data.fromAddress}
					</span>
				</div>
				<div className="flex justify-between border-b border-white/10 px-3 py-4">
					<span>Txid</span>
					<a
						className="max-w-48 break-words text-right underline"
						href={`${CHAIN[data.chainType.toUpperCase()]?.hashPrefix}${data.txHash}`}
					>
						{data.txHash}
					</a>
				</div>
				<div className="flex justify-between border-b border-white/10 px-3 py-4">
					<span>Time</span>
					<span>{moment(data.timestamp).format(dateFormat)}</span>
				</div>
			</div>
		</div>
	);
};

export default Detail;
