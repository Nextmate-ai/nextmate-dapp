'use client';

import React from 'react';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const VoteRules = () => {
	const router = useRouter();

	const clickBack = () => {
		router.back();
	};

	return (
		<div className="h-screen w-full bg-bg-purple bg-[length:100%_100%] bg-no-repeat text-white">
			<div className="flex h-full w-full flex-col overflow-y-auto p-3">
				<div className="flex pt-1">
					<ChevronLeft onClick={clickBack} />
					<div className="ml-5 font-jamjuree text-xl font-semibold text-white">
						Rules
					</div>
				</div>

				<div className="mt-8 w-full text-center font-jamjuree text-xl font-semibold text-white">
					Vote to Earn Participation Rules
				</div>
				<div className="mt-8 w-full px-3 font-jamjuree text-base font-medium text-white">
					All the rules below are priced and demonstrated in USDT.
				</div>
				<div className="mt-8 w-full px-3">
					<div className="font-jamjuree text-base font-medium text-white">
						1. Users who guess correctly will share the amount invested by those
						who guessed incorrectly.
					</div>
					<div className="mt-8 font-jamjuree text-base font-medium text-white">
						2. The earlier you predict, the greater the earnings.
					</div>

					<div className="mt-2 flex w-full flex-col items-center justify-center">
						<div className="flex w-full items-center justify-center gap-2">
							<div className="h-3.5 w-36 text-center font-jamjuree text-xs font-bold text-[#aca8ff]">
								Voter Participation Time
							</div>
							<div className="w-36 text-center font-jamjuree text-xs font-bold text-[#aca8ff]">
								Earnings
							</div>
						</div>

						<div className="relative mt-3 flex w-full items-center justify-center gap-12">
							<div className="w-28 font-jamjuree text-sm font-medium text-[#aca8ff]">
								{`0s < time < 20s`}
							</div>
							<div className="w-36 font-jamjuree text-sm font-medium text-[#aca8ff]">
								110% of the principal
							</div>
							<div className="absolute -bottom-2 left-1/2 h-px w-60 -translate-x-1/2 border border-white/20"></div>
						</div>
						<div className="relative mt-3 flex w-full items-center justify-center gap-12">
							<div className="w-28 font-jamjuree text-sm font-medium text-[#aca8ff]">
								{`20s < time < 40s`}
							</div>
							<div className="w-36 font-jamjuree text-sm font-medium text-[#aca8ff]">
								60% of the principal
							</div>
							<div className="absolute -bottom-2 left-1/2 h-px w-60 -translate-x-1/2 border border-white/20"></div>
						</div>
						<div className="relative mt-3 flex w-full items-center justify-center gap-12">
							<div className="w-28 font-jamjuree text-sm font-medium text-[#aca8ff]">
								{`40s < time < 60s`}
							</div>
							<div className="w-36 font-jamjuree text-sm font-medium text-[#aca8ff]">
								10% of the principal
							</div>
						</div>

						<div className="mt-3 w-full px-2 text-justify">
							<div className="font-jamjuree text-xs font-normal text-white">
								Example: For instance, if you invest 100 U when 0 &lt; time &le;
								20s and guess correctly, you will win 110 U.
							</div>
							{/* <div className="mt-2 font-jamjuree text-xs font-normal text-white">
								<li>
									A: 10000 × (100 × 1.5) / (100 × 1.5 + 200 × 1.2 + 300) = 2173
									U
								</li>
								<li>
									B: 10000 × (200 × 1.2) / (100 × 1.5 + 200 × 1.2 + 300) = 3478
									U
								</li>
								<li>C: 10000 × 300 / (100 × 1.5 + 200 × 1.2 + 300) = 4347 U</li>
							</div> */}
						</div>
					</div>

					<div className="mt-8 font-jamjuree text-base font-medium text-white">
						3. Win or lose, you can get Goldcoin incentives.
					</div>
					<div className="text-justify font-jamjuree text-sm font-normal text-white">
						<li>
							Correct guesses will earn 10% of the invested amount in U as
							Goldcoin.
						</li>
						<li>
							Incorrect guesses will earn 5% of the invested amount in U as
							Goldcoin.
						</li>
					</div>

					<div className="mt-8 font-jamjuree text-base font-medium text-white">
						4. A handling fee of 4% will be charged for each participation.
					</div>
				</div>
			</div>
		</div>
	);
};

export default withAuth(VoteRules);
