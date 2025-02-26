import { useRouter } from 'next/navigation';

export const GiftButton = () => {
	const router = useRouter();
	return (
		<div className="relative">
			{/* <img
				width={70}
				height={70}
				src={'/img/icon/Gift.png'}
				alt="equip"
				onClick={() => router.push('/lottery/v1')}
				className="absolute bottom-[84px] right-6 z-30"
			/> */}
		</div>
	);
};
