import fetchAPI from '@/lib/api';
import { useParams } from 'next/navigation';
import React from 'react';
import moment from 'moment';
import { X } from 'lucide-react';

export interface ChatActionButton {
	text: string;
	options: {
		option: string;
		text: string;
		type: string;
	}[];
}

interface ChatActionModalProps {
	actions: ChatActionButton;
	updateChatData: (data: any) => void;
	onCancel: () => void;
}

const ChatActionModal: React.FC<ChatActionModalProps> = ({
	actions,
	updateChatData,
	onCancel,
}) => {
	const { id: characterId } = useParams();
	const handleClick = async (type: string) => {
		try {
			/**
			 * 处理事件的逻辑
			 * url: /api/dailyInteraction
			 * 参数
			 * type - 事件类型
			 */
			const dailyInteractionRes = await fetchAPI(
				`/api/dailyInteraction/${characterId}`,
				{
					method: 'POST',
					body: { type },
				},
			);

			updateChatData({
				...dailyInteractionRes?.data?.messages?.[1],
				time: moment().format('YYYY-MM-DD HH:mm:ss'),
			});
		} catch (error) {
			console.error('Failed to save lottery record:', error);
		} finally {
			onCancel();
		}
	};
	return (
		actions?.options && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
				<div className="relative w-80 rounded-2xl bg-black p-6 shadow-lg">
					<img
						className="absolute left-0 top-0 h-full"
						src="/img/bg-action.png"
					/>
					<X
						className="absolute right-2 top-2 text-gray-400"
						onClick={onCancel}
					/>

					<div className="mb-6 text-center text-xl font-medium text-white">
						What would you choose?
					</div>
					{actions?.options?.map((action, index) => (
						<button
							key={index}
							onClick={() => {
								handleClick(action.type);
							}}
							className="relative mb-2 flex h-12 w-full items-center justify-center bg-cover px-4 py-2 text-black"
						>
							<span className="z-10 min-w-40 items-center">{action.text}</span>
							<img
								src="/img/icon/diamond.png"
								className="z-10 mr-[6px] h-6 w-6"
							/>
							<span className="z-10">{(index + 1) * 5}</span>
							<img className="absolute" src="/img/bg-action-item.png" />
							{/* {action.price !== undefined && (
              <div className='flex items-center'>
                {action.icon && <span className="mr-2">{action.icon}</span>} 
                {action.price}
              </div>
            )} */}
						</button>
					))}
					{/* <button
						onClick={onCancel}
						className="mt-2 h-12 w-full rounded-full bg-gray-200 px-4 py-2 text-black"
					>
						Cancel
					</button> */}
				</div>
			</div>
		)
	);
};

export default ChatActionModal;
