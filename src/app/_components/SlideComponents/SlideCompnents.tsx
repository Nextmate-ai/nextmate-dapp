import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface SliderProps {
	items: any[]; // 根据实际情况调整类型
	renderItem: (item: any) => React.ReactNode; // 渲染每个项的函数
}

const SlideComponent: React.FC<SliderProps> = ({ items, renderItem }) => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		adaptiveHeight: true,
	};

	return (
		<div className="slider-container my-4">
			<Slider {...settings}>
				{items.map((item, index) => (
					<div key={index} className="slide-item">
						{renderItem(item)}
					</div>
				))}
			</Slider>
		</div>
	);
};

export default SlideComponent;
