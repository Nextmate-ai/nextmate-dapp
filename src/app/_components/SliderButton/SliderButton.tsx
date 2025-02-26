import React from 'react';

interface SliderButtonProps {
	onClick: () => void;
}

const SliderButton: React.FC<SliderButtonProps> = ({ onClick }) => {
	return (
		<div className="m-auto mt-2 w-full max-w-md px-4">
			<button
				className="h-12 w-full rounded-full bg-custom-purple-005 text-white"
				onClick={onClick}
			>
				Start My Journey
			</button>
		</div>
	);
};

export default SliderButton;
