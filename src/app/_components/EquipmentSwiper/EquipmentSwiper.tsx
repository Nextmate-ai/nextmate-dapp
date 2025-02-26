// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import clsx from 'clsx';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
// import 'swiper/css/pagination';

// 导入所需模块
import { EffectCoverflow, Pagination, A11y } from 'swiper/modules';

import './swiper.moulde.css';

interface EquipmentSwiperProps {
	equipments?: any[];
	selectedOutfit: string | null;
	clickEquipment: (index) => void;
}

const EquipmentItem: React.FC<{
	equipment: any;
	index: number;
	selectedOutfit: string | null;
	clickEquipment: (index: number) => void;
}> = ({ equipment, index, selectedOutfit, clickEquipment }) => (
	<div className="item-container">
		{equipment?.name && (
			<div
				className="relative h-full w-full"
				onClick={() => clickEquipment(index)}
			>
				<img
					src={`/img/equipment/${equipment.name}.png`}
					alt={equipment.name}
					className="h-full w-full object-contain"
				/>
				<div
					className={clsx(
						equipment.name !== selectedOutfit && 'hidden',
						'absolute left-1/2 top-1/2 flex origin-top-left -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] items-center justify-center bg-white/80 px-4',
					)}
				>
					<div className="font-jamjuree text-sm font-medium text-black">
						Equipped
					</div>
				</div>
			</div>
		)}
	</div>
);

const EquipmentSwiper: React.FC<EquipmentSwiperProps> = ({
	equipments,
	selectedOutfit,
	clickEquipment,
}) => {
	const swiperOption = {
		speed: 500,
		loop: true,
		grabCursor: true,
		slidesPerView: 3,
		centeredSlides: true,
		coverflowEffect: {
			rotate: 0,
			stretch: 0,
			depth: 100,
			modifier: 2,
			slideShadows: true,
		},
		keyboard: {
			enabled: true,
		},
		mousewheel: {
			thresholdDelta: 70,
		},
		spaceBetween: 35,
		observer: true, //修改swiper自己或子元素时，自动初始化swiper
		observeParents: true, //修改swiper的父元素时，自动初始化swiper
		observeSlideChildren: true, //修改swiper的子元素时，自动初始化swiper
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
	};

	return (
		<Swiper
			speed={swiperOption.speed}
			loop={swiperOption.loop}
			grabCursor={swiperOption.grabCursor}
			slidesPerView={swiperOption.slidesPerView}
			spaceBetween={swiperOption.spaceBetween}
			centeredSlides={swiperOption.centeredSlides}
			observer={swiperOption.observer}
			observeParents={swiperOption.observeParents}
			observeSlideChildren={swiperOption.observeSlideChildren}
			mousewheel={{
				thresholdDelta: swiperOption.mousewheel.thresholdDelta,
			}}
			pagination={swiperOption.pagination}
			modules={[A11y]}
			className="mySwiper"
		>
			{[...Array(3)].map((_, index) => (
				<SwiperSlide key={index}>
					<EquipmentItem
						key={`extra-${index}`}
						equipment={equipments?.[index]}
						index={index}
						selectedOutfit={selectedOutfit}
						clickEquipment={clickEquipment}
					/>
				</SwiperSlide>
			))}
			{/* 如果需要额外的幻灯片来实现循环效果，可以再添加一些 */}
			{[...Array(3)].map((_, index) => (
				<SwiperSlide key={index}>
					<EquipmentItem
						key={`extra-${index}`}
						equipment={equipments?.[index]}
						index={index}
						selectedOutfit={selectedOutfit}
						clickEquipment={clickEquipment}
					/>
				</SwiperSlide>
			))}
		</Swiper>
	);
};

export default EquipmentSwiper;
