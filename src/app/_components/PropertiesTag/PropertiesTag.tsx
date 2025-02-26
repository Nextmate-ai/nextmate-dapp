import React from 'react';

interface PropertiesTagProps {
	text: string;
	level: number;
	color: string;
}

const PropertiesTag: React.FC<PropertiesTagProps> = ({
	text,
	level,
	color,
}) => {
	return (
		<div className="flex items-center space-x-2">
			<span className="text-sm font-semibold">{text}</span>
			<span
				className="flex h-4 w-4 items-center justify-center rounded-full text-sm text-white"
				style={{ backgroundColor: color }}
			>
				{level}
			</span>
		</div>
	);
};

export default PropertiesTag;
