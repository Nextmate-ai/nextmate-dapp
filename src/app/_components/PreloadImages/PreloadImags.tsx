import React, { useEffect } from 'react';

interface PreloadImagesProps {
	loading: boolean;
	preloadImages: string[];
}

const PreloadImages: React.FC<PreloadImagesProps> = ({
	loading,
	preloadImages,
}) => {
	return (
		<>
			{!loading && (
				<div className="hidden">
					{preloadImages.map((image, index) => (
						<img
							key={index}
							src={image}
							alt="hidden background"
							width={1}
							height={1}
						/>
					))}
				</div>
			)}
		</>
	);
};

export default PreloadImages;
