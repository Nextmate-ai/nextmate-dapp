'use client';

import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const RouletteTab = () => {
	const { showRouterLoading } = useRouterLoadingContext();
	const pathname = usePathname();

	const getTextStyle = (path: string) => {
		return pathname === `/roulette/${path}`
			? 'font-jamjuree text-xs font-semibold text-white underline underline-offset-4'
			: 'font-jamjuree text-xs font-semibold text-white/80';
	};
	return (
		<div className="mt-7 flex h-8 w-full items-center justify-start overflow-x-auto px-2">
			<div className="flex flex-nowrap gap-4">
				<Link
					href={`/roulette/general`}
					onClick={() => showRouterLoading('/roulette/general')}
					className="inline-flex flex-col items-center justify-center gap-1.5 whitespace-nowrap py-1.5"
				>
					<div className={getTextStyle('general')}>General Spin</div>
				</Link>
				<Link
					href={`/roulette/moe`}
					onClick={() => showRouterLoading('/roulette/moe')}
					className="inline-flex flex-col items-center justify-center gap-1.5 whitespace-nowrap py-1.5"
				>
					<div className={getTextStyle('moe')}>Moe Spin</div>
				</Link>
				<Link
					href={`/roulette/hippo`}
					onClick={() => showRouterLoading('/roulette/hippo')}
					className="flex items-start justify-center whitespace-nowrap py-1.5"
				>
					<div className={getTextStyle('hippo')}>Hippo Spin</div>
				</Link>
				<Link
					href={`/roulette/sundog`}
					onClick={() => showRouterLoading('/roulette/sundog')}
					className="inline-flex flex-col items-center justify-center gap-1.5 whitespace-nowrap py-1.5"
				>
					<div className={getTextStyle('sundog')}>Sundog Spin</div>
				</Link>
				<Link
					href={`/roulette/sunpump`}
					onClick={() => showRouterLoading('/roulette/sunpump')}
					className="flex items-start justify-center whitespace-nowrap py-1.5"
				>
					<div className={getTextStyle('sunpump')}>Sunpump Spin</div>
				</Link>
			</div>
		</div>
	);
};

export default RouletteTab;
