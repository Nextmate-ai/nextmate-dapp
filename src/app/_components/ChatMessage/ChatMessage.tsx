'use client';

import React, { useState } from 'react';
import { LIKE_SVG } from '@/assets/icon/like.svg';
import { BUY_SVG } from '@/assets/icon/buy.svg';
import ActionModal from '../ActionModal/ActionModal';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import './ChatMessage.css';

interface ChatMessageProps {
	content: string;
	time?: string;
	type: 'sent' | 'received';
	action?: string;
	product?: boolean;
	disable?: boolean; // 新增的 disable 属性
	isMsgFull?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
	content,
	time,
	type,
	action,
	product,
	disable,
	isMsgFull,
}) => {
	const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

	const handleProductClick = () => {
		if (product) {
			setIsGiftModalOpen(true);
		}
	};

	const handleCancel = () => {
		setIsGiftModalOpen(false);
	};

	const handleConfirmClick = () => {
		setIsConfirmModalOpen(true);
	};

	const handleConfirmModalCancel = () => {
		setIsConfirmModalOpen(false);
	};

	const actions = [
		{
			text: 'Buy an ice-cream',
			icon: <img src={'/img/icon/coin.png'} alt="like" className="h-4 w-4" />,
			price: 10,
			onClick: () => alert('Buy an ice-cream'),
		},
		{
			text: 'Go to restaurant',
			icon: <img src={'/img/icon/coin.png'} alt="like" className="h-4 w-4" />,
			price: 20,
			onClick: () => alert('Go to restaurant'),
		},
		{
			text: 'I am hungry too',
			onClick: () => alert('I am hungry too'),
		},
	];

	return (
		<>
			<div
				className={`flex ${
					type === 'sent' ? 'justify-end' : 'justify-start'
				} relative mb-4`}
			>
				<div className="relative flex w-auto max-w-xs items-stretch shadow-md">
					<img
						className="absolute h-full w-full"
						src={`${type === 'sent' ? '/img/bg-chat-sent.png' : '/img/bg-chat.png'}`}
					/>
					{/* 底部高斯模糊 */}
					{!isMsgFull && (
						<div className="absolute bottom-0 left-2 right-2 top-0 backdrop-blur-sm"></div>
					)}
					<div className={`z-10 flex-1 px-3 py-2`}>
						<p
							className="text-sm text-white"
							// onClick={disable ? undefined : handleConfirmClick}
						>
							{content}
						</p>
						{action === 'liked' && (
							<div
								className={`absolute flex h-7 w-7 items-center justify-center rounded-full ${
									action === 'liked' && 'bg-custom-red-003'
								} ${
									type === 'sent' ? 'left-[-15px]' : 'right-[-15px]'
								} top-[-15px]`}
							>
								<img src={LIKE_SVG} alt="like" className={``} />
							</div>
						)}
						{product && (
							<div
								className={`absolute flex h-7 w-7 items-center justify-center rounded-full ${
									action === 'liked' && 'bg-custom-red-003'
								} ${
									type === 'sent' ? 'left-[-15px]' : 'right-[-15px]'
								} bottom-[-15px] cursor-pointer`}
								onClick={handleProductClick}
							>
								<img src={BUY_SVG} alt="buy" className={``} />
							</div>
						)}
					</div>
				</div>
			</div>
			{isGiftModalOpen && (
				<ActionModal actions={actions} onCancel={handleCancel} />
			)}
			{isConfirmModalOpen && (
				<ConfirmModal
					title="Unlock New Scene"
					confirmText="10"
					cancelText="Skip"
					confirmIcon={<img src="/img/icon/coin.png" className="h-7 w-7" />}
					onConfirm={handleConfirmClick}
					onCancel={handleConfirmModalCancel}
				/>
			)}
		</>
	);
};

export default ChatMessage;
