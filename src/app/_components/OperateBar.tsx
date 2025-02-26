import React from 'react';
import { enqueueSnackbar } from 'notistack';

const OperateBar = (props: {
	showChat?: boolean;
	onChatClick?: () => void;
	onOutfitClick: () => void;
	onQuizClick: () => void;
}) => {
	const { showChat = true } = props;
	return (
		<div className="flex items-center gap-2">
			{showChat && (
				<div
					className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAFAFA]"
					onClick={() => props.onChatClick()}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clipPath="url(#clip0_2083_1328)">
							<path
								d="M12.0001 0C5.55244 0 0.326172 5.22677 0.326172 11.674C0.326172 14.4223 1.28174 16.9424 2.87234 18.9353C3.51691 19.7403 3.84998 21.028 3.26259 21.7874C2.84325 22.3306 2.38127 22.7018 1.88267 22.768C0.25695 22.9852 2.47958 24.9315 6.2898 23.4457C7.25039 23.071 8.74518 22.923 9.75693 23.1252C10.4818 23.2707 11.2317 23.3479 12.0006 23.3479C18.4483 23.3479 23.6746 18.1216 23.6746 11.6745C23.6746 5.22727 18.4473 0 12.0001 0Z"
								fill="#010002"
							/>
						</g>
						<defs>
							<clipPath id="clip0_2083_1328">
								<rect width="24" height="24" fill="white" />
							</clipPath>
						</defs>
					</svg>
				</div>
			)}
			<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAFAFA]">
				<img
					width={24}
					height={24}
					src={'/img/equipment.png'}
					alt="equip"
					onClick={() => {
						props.onOutfitClick();
					}}
				/>
			</div>
		</div>
	);
};

export default OperateBar;
