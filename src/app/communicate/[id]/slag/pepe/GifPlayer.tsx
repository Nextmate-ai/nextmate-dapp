import React, { useMemo } from 'react';
// import './GifPlayer.css';

// 40 帧
const TOTAL_FRAMES = 40;
// 假设每帧宽度为208px
const FRAME_WIDTH = 300;

const GifPlayer = ({ rotation }) => {
	const currentFrame = useMemo(() => {
		let frame = Math.round((rotation / 360) * TOTAL_FRAMES) % TOTAL_FRAMES;
		frame = frame < 0 ? TOTAL_FRAMES + frame : frame;
		return frame;
	}, [rotation]);

	return (
		<div className="gif-container">
			<div
				style={{
					width: '300px',
					height: '380px',
					backgroundImage: 'url(/img/slag/pepe/pepe-sprites.png)',
					backgroundSize: `${FRAME_WIDTH * TOTAL_FRAMES}px 100%`,
					backgroundPosition: `-${currentFrame * FRAME_WIDTH}px 0`,
				}}
			/>
		</div>
	);
};

export default GifPlayer;
