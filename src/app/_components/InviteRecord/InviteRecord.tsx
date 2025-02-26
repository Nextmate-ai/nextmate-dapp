import React, { useRef, useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import { useInviteRecord } from '@/hooks/useInviteRecord';
import moment from 'moment';

interface InvitePopProps {
	isOpen: boolean;
	onClose: () => void;
}

const InvitePop: React.FC<InvitePopProps> = ({ isOpen, onClose }) => {
	const [isFull, setIsFull] = useState(false);
	const [showContent, setShowContent] = useState(false);
	const [inviteRecord, setInviteRecord] = useState<any[]>([]);
	const inviteRecordRef = useRef();
	const springProps = useSpring({
		height: isFull ? '100%' : '40vh',
		transform: isFull ? 'translateY(-93vh)' : 'translateY(-11vh)',
		// marginTop: isFull ? '-117vh' : '-42vh',
		config: { mass: 1, tension: 300, friction: 40 },
		onChange: ({ value }) => {
			if (isFull) {
				setShowContent(true);
			} else {
				setShowContent(false);
			}
		},
	});

	useEffect(() => {
		if (isFull) {
			const timer = setTimeout(() => setShowContent(true), 300);
			return () => clearTimeout(timer);
		} else {
			setShowContent(false);
		}
	}, [isFull]);

	const { inviteRecordData } = useInviteRecord();
	const { records, totalCommission, totalCount } = inviteRecordData || {};
	// 根据时间戳判断标签
	const pickTag = (time: string) => {
		const contest = moment(time).isBetween(1733227200000, 1733745600000);
		if (contest) {
			return 'S2';
		}
		return '';
	};

	useEffect(() => {
		const newRecords = [];
		if (records) {
			records.forEach(record => {
				newRecords.push({
					...record,
					tag: pickTag(record.createdAt),
				});
			});
			setInviteRecord(newRecords);
			console.log('newRecords', newRecords);
		}
	}, [records]);

	return (
		<div className="relative z-[99]">
			<animated.div
				ref={inviteRecordRef}
				style={{
					height: springProps.height,
					transform: springProps.transform,
					// marginTop: springProps.marginTop,
				}}
				className={`no-scrollbar relative z-[99] w-full overflow-y-auto bg-black p-2 sm:max-w-[520px]`}
			>
				<div
					className="w-full text-center font-jamjuree text-xl font-normal text-white"
					onClick={() => setIsFull(!isFull)}
					style={{
						background:
							'linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.20) 100%)',
						backgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
					}}
				>
					Inviting Details
				</div>
				<img
					src="/img/icon/up-arrow.svg"
					alt="up-arrow"
					className={`mx-auto mb-4 mt-4 w-4 cursor-pointer ${isFull ? 'rotate-180' : ''}`}
					onClick={() => setIsFull(!isFull)}
				/>
				<img
					src="/img/invite/invite-deal.png"
					className={`w-full px-1 ${showContent ? '' : 'h-0'}`}
				/>

				<div
					className={`relative w-full rounded-lg bg-cover transition-opacity duration-300 ease-in-out ${
						showContent ? 'opacity-100' : 'opacity-0'
					} ${isFull ? 'h-[calc(100vh-240px)]' : 'h-auto'}`}
				>
					<img
						className="absolute h-[calc(100vh-226px)]"
						src="/img/invite/bg-invite-history.png"
					/>
					<div className="h-6 w-full"></div>
					<div className="flex justify-between px-5 text-white">
						<span className="font-jamjuree text-2xl font-semibold">Total</span>
						<div className="flex">
							<div className="mr-4 flex">
								<img className="mr-2 h-6 w-6" src="/img/USDT.png" alt="USDT" />
								<span className="font-jamjuree text-xl">{totalCommission}</span>
							</div>
							<div className="flex">
								<img
									className="mr-2 h-6 w-6"
									src="/img/icon/round-person.png"
									alt=""
								/>
								<span className="font-jamjuree text-xl">{totalCount}</span>
							</div>
						</div>
					</div>

					<div className="m-auto mt-5 h-[1px] w-4/5 bg-white/20"></div>

					<div
						className={`no-scrollbar relative w-full overflow-y-auto rounded-lg p-5 ${isFull ? 'h-[calc(100vh-315px)]' : showContent ? 'h-auto' : 'h-0'}`}
					>
						{/* record data */}
						{totalCount !== 0 && (
							<div className="flex h-full w-full flex-col items-start justify-start gap-4">
								<div className="flex items-center justify-start gap-2">
									<div className="font-jamjuree text-sm font-medium text-white">
										Invited Users
									</div>
								</div>
								<div className="flex w-full justify-around gap-2 text-xs uppercase text-white/70">
									<div className="w-[88px] text-center">Invites</div>
									<div className="w-[60px] text-center">Deposit</div>
									<div className="w-[54px] text-center">Bonus</div>
									<div className="w-[73px] text-center">Time</div>
								</div>
								{inviteRecord && (
									<div className="flex w-full flex-col items-start justify-start gap-2">
										{inviteRecord.map((invite, index) => (
											<div
												className="flex w-full items-center justify-between font-jamjuree text-sm text-white"
												key={index}
											>
												<div className="flex w-[88px] flex-col items-center justify-center gap-2">
													<div className="inline-flex items-center justify-start gap-2">
														<div className="w-[56px] font-jamjuree text-sm font-normal text-white">
															@
															{`${invite.username.slice(0, 2)}...${invite.username.slice(-2)}`}
														</div>
														{invite.tag && (
															<div className="flex w-[24px] items-center justify-center rounded-lg bg-[#6e67f6]">
																<div className="font-jamjuree text-[10px] font-medium text-white">
																	{invite.tag}
																</div>
															</div>
														)}
													</div>
												</div>
												<div className="flex w-[60px] items-center justify-center">
													<span>{invite.inviteeDepositUsdt}</span>
													<img
														className="ml-1 h-[14px] w-[14px] self-center"
														src="/img/USDT.png"
														alt=""
													/>
												</div>
												<div className="flex w-[54px] items-center justify-center">
													<span>{invite.commissionUsdt}</span>
													<img
														className="ml-1 h-[14px] w-[14px] self-center"
														src="/img/USDT.png"
														alt=""
													/>
												</div>
												<div className="w-[73px] text-right text-xs text-[#DBDBDB]">
													{moment(invite.createdAt).format('MMM D, YYYY')}
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}
						{/* no data */}
						{totalCount === 0 && (
							<div className="mt-16 flex flex-col items-center justify-center">
								<img
									className="h-28 w-28"
									src="/img/invite-record-no-data.png"
								/>
								<div className="mt-8 flex flex-col items-start justify-start gap-2">
									<div className="self-stretch text-center font-jamjuree text-base font-normal text-white">
										No friends have joined recently.
									</div>
									<div className="self-stretch text-center font-jamjuree text-base font-normal text-white">
										Share and invite them to join now!
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</animated.div>
		</div>
	);
};

export default InvitePop;
