'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useDeepCompareEffect } from 'ahooks';
import ChatMessage from '@/app/_components/ChatMessage/ChatMessage';
import {
	ChevronLeft,
	Eye,
	EyeOff,
	History,
	Mic,
	PhoneOff,
	Podcast,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { ChatMessage as ChatMessageType } from '@/types/chat.type';
import { RootState } from '@/store/store';
import { useStoryRecordVoice } from '@/hooks/useStoryChatRecord';
import { useStoryChatHistory } from '@/hooks/useStoryChatHistory';
import { useStory } from '@/hooks/useStoryDetail';
import ActionModal from '@/app/_components/ActionModal/ActionModal';
import { useRoleList } from '@/hooks/useRoleList';
import handleAudioData from '@/utils/handleAudioData';
import fetchAPI from '@/lib/api';

interface ActionButton {
	text: string;
	onClick: () => void;
}

const StoryCommunicate: React.FC = () => {
	const { id: storyId } = useParams();
	const userId = useSelector(
		(state: RootState) => state.accountInfo.account?.id!,
	);
	const [energy, setEnergy] = useState<number>();
	const [showMessage, setShowMessage] = useState<boolean>(true);
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [transcript, setTranscript] = useState<string>('');
	const [chatData, setChatData] = useState<ChatMessageType[]>();
	const balanceSlice = useSelector((state: RootState) => state.balance);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const recordingIntervalRef = useRef<number | null>(null);
	const [isSending, setIsSending] = useState(false);
	const [showActionModal, setShowActionModal] = useState<boolean>(false);
	const [actions, setActions] = useState<ActionButton[]>();
	const audioRef = useRef(null);
	const [audioSrc, setAudioSrc] = useState<string>();
	const {
		chatHistory,
		storyStar,
		messageCount,
		options,
		loading,
		error,
		chatStatus,
		storyResult,
		resultImage,
	} = useStoryChatHistory(storyId as string);
	const { story, hasStory, characterId, isLoading, isError } = useStory(
		storyId as string,
	);
	const { characters, getCharacter } = useRoleList();
	const [status, setStatus] = useState<string>(chatStatus);
	const [showMsgAndGoid, setShowMsgAndGoid] = useState(true);
	const [bgUrl, setBgUrl] = useState<string>('');
	const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
	const {
		recording,
		startRecording,
		stopRecording,
		text,
		audioData,
		isTranscribing,
		error: recordingError,
	} = useStoryRecordVoice(storyId as string, characterId);

	const router = useRouter();

	const handleAction = async (_options: string[], index: number) => {
		console.log(`Option ${index} selected: ${_options[index]}`);
		setShowActionModal(false);
		const data = await fetchAPI('/api/story/complete', {
			method: 'POST',
			body: JSON.stringify({
				storyId,
				selectedOptionIndex: index,
			}),
		});
		console.log(96, data);
		// todo ...chatData这里会报错
		setChatData([
			...chatData,
			{ role: 'user', content: data.userAnswer },
			{ role: 'assistant', content: data.systemAnswer },
		]);

		setBgUrl(`url('/img/${data.newBackgroundImage}.png')`);
		// 只展示背景图，把聊天记录和精力都隐藏
		setShowMsgAndGoid(false);
		//   {
		//     "userAnswer": "I had a wonderful time too, Lucy. I think I’ll stay a bit longer and browse some more. Thanks for the lovely company and enjoy your book!",
		//     "systemAnswer": "That sounds like a great plan. Enjoy your time here and happy reading! Let’s definitely do this again sometime soon. Take care!",
		//     "newBackgroundImage": "Story3-answer1"
		// }

		// console.log('response', response);
		// console.log('chatData', chatData);
	};

	const handleSendMessage = async () => {
		if (transcript.trim() && !isSending) {
			setIsSending(true);
			// 在这里调用发送消息的函数
			setTranscript('');
			// 设置经验值
		}
	};

	// 发送消息等待人物返回时状态
	const MessageSkeleton: React.FC = () => (
		<div className="mb-4 flex animate-pulse justify-end">
			<div className="max-w-[70%] rounded-lg bg-gray-300 p-3">
				<div className="mb-2 h-4 w-44 rounded bg-gray-400"></div>
				<div className="h-4 w-44 rounded bg-gray-400"></div>
			</div>
		</div>
	);

	const clickRecording = async () => {
		audioRef.current.load();
		if (isRecording) {
			await stopRecording();
			setIsRecording(false);
			await handleSendMessage();
		} else {
			setIsSending(true);
			await startRecording();
			setIsRecording(true);
		}
	};

	const renderSkeletonLoader = () => {
		return (
			<>
				<div className="mb-4 flex animate-pulse justify-start">
					<div className="max-w-[70%] rounded-lg bg-gray-300 p-3">
						<div className="mb-2 h-4 w-44 rounded bg-gray-400"></div>
						<div className="h-4 w-44 rounded bg-gray-400"></div>
					</div>
				</div>
				<div className="mb-4 flex animate-pulse justify-end">
					<div className="max-w-[70%] rounded-lg bg-gray-300 p-3">
						<div className="mb-2 h-4 w-44 rounded bg-gray-400"></div>
						<div className="h-4 w-44 rounded bg-gray-400"></div>
					</div>
				</div>
				<div className="mb-4 flex animate-pulse justify-start">
					<div className="max-w-[70%] rounded-lg bg-gray-300 p-3">
						<div className="mb-2 h-4 w-44 rounded bg-gray-400"></div>
						<div className="h-4 w-44 rounded bg-gray-400"></div>
					</div>
				</div>
			</>
		);
	};

	const renderChatMessages = () => {
		if (!chatData) return null;
		return (
			<>
				{chatData.map((message, index) => (
					<ChatMessage
						key={`${message.content}-${index}`}
						content={message.content}
						time={message?.time}
						type={message.role === 'user' ? 'sent' : 'received'}
						disable
					/>
				))}
			</>
		);
	};

	// 获取能量值
	useEffect(() => {
		const startRest = async () => {
			await fetchAPI('/api/energy/start', {
				method: 'POST',
			});
		};

		const stopRest = async () => {
			const data = await fetchAPI('/api/energy/stop', {
				method: 'POST',
			});
			console.log('--->', data, data.energy);
			setEnergy(data.energy);
		};

		// 页面加载时停止能量增长
		stopRest();

		// 页面卸载时恢复能量增长
		return () => {
			startRest();
		};
	}, []);

	useEffect(() => {
		const character = getCharacter(characterId as string);
		console.log('character', character);
		setStatus(chatStatus);

		if (chatStatus == 'FINISHED') {
			setBgUrl(`url('/img/${resultImage}.png')`);
		} else if (story?.backgroundImage?.[0]) {
			setBgUrl(`url('/img/${story?.backgroundImage?.[0]}.png')`);
		}
		console.log(status, bgUrl);
	}, [chatStatus, characterId, story]);

	// actions 选项
	useEffect(() => {
		if (status === 'COMPLETE' && options && options.length > 0) {
			setShowActionModal(true);
			const actions: ActionButton[] = options.map((option, index) => ({
				text: option,
				onClick: () => {
					handleAction(options, index).catch(error => {
						console.error('Error handling action:', error);
						// 这里可以添加错误处理逻辑
					});
				},
			}));
			setActions(actions);
		}
	}, [status, options]);

	// 滚动到底部
	useEffect(() => {
		// 页面加载时停止能量增长
		const storyEnd = (star: number, chatLength: number) => {
			if (star === 3 && chatLength >= 60) {
				return true;
			}
			if (star === 2 && chatLength >= 50) {
				return true;
			}
			if (star === 1 && chatLength >= 40) {
				return true;
			}
			return false;
		};

		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
		if (
			status == 'NORMAL' &&
			chatData &&
			storyEnd(storyStar, chatData.length)
		) {
			setStatus('COMPLETE');
		}
	}, [chatData, isSending]);

	useDeepCompareEffect(() => {
		setChatData(chatHistory);
	}, [chatHistory]);

	// 文字消息
	useEffect(() => {
		if (text) {
			setIsSending(false);
			setChatData(text);

			const updateEnergy = async () => {
				const data = await fetchAPI('/api/energy/stop', {
					method: 'POST',
				});
				console.log('--->', data, data.energy);
				setEnergy(data.energy);
			};

			updateEnergy();
		}
	}, [text]);

	useEffect(() => {
		if (audioData) {
			// 先判断是否为最新一条msg
			const assistantMsg = chatData.filter(item => item.role === 'assistant');

			if (
				audioData.content === assistantMsg[assistantMsg.length - 1]?.content
			) {
				// 停止当前正在播放的音频
				if (audioRef.current) {
					audioRef.current.pause();
					audioRef.current.currentTime = 0;
				}

				// 清除之前的音频源
				if (audioSrc) {
					URL.revokeObjectURL(audioSrc);
				}
				const newAudioUrl = handleAudioData(audioData);

				setAudioSrc(newAudioUrl);
				setTimeout(() => {
					if (audioRef.current) {
						audioRef.current.play().catch(error => {
							console.error('Error playing audio:', error);
						});
					}
				}, 100);
			}
		}
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}
			// 清除音频资源
			if (audioSrc) {
				URL.revokeObjectURL(audioSrc);
			}
		};
	}, [audioData]);

	// 当发送错误时
	useEffect(() => {
		if (recordingError) {
			toast.error(recordingError.message || 'Failed to transcribe audio');
			setIsSending(false);
		}
	}, [recordingError]);

	return (
		<div
			className="flex h-[100vh] w-full flex-col bg-cover bg-center"
			style={
				story && story.backgroundImage?.[0] && bgUrl
					? { backgroundImage: bgUrl }
					: {}
			}
		>
			{/* 顶部栏，包含金币数量 */}
			<div className="absolute flex w-full justify-between px-4 pt-4">
				<ChevronLeft
					size={32}
					color="white"
					onClick={() => {
						router.push('/stories');
					}}
				/>
				{/* story.condition && <CornerUpRight size={32} color='white' /> */}
			</div>

			{/* 金币数量 */}
			{showMsgAndGoid && status != 'FINISHED' && (
				<div className="flex w-full items-center justify-end bg-opacity-50 p-4">
					<div className="flex items-center justify-end gap-2 rounded-full bg-gray-400 py-1 pl-1 pr-4 text-white">
						<img
							src={'/img/icon/energy.png'}
							width={24}
							height={24}
							alt="Coin"
						/>
						<span>{energy}</span>
					</div>
				</div>
			)}

			{/* 中间聊天记录 */}
			{showMsgAndGoid && status != 'FINISHED' && (
				<div
					ref={chatContainerRef}
					className={`no-scrollbar flex-1 space-y-4 overflow-y-auto p-4 ${
						showMessage ? '' : 'opacity-0'
					}`}
				>
					{loading ? renderSkeletonLoader() : renderChatMessages()}
					{isSending && <MessageSkeleton key="temp-skeleton" />}
				</div>
			)}

			{status === 'COMPLETE' && showActionModal && (
				<ActionModal
					actions={actions!}
					onCancel={() => setShowActionModal(false)}
				/>
			)}

			{/* 底部操作栏 */}
			{status != 'FINISHED' && status != 'COMPLETE' && (
				<div className="flex items-center justify-center gap-8 bg-opacity-50 p-4">
					<div onClick={() => setShowMessage(!showMessage)}>
						{showMessage ? (
							<EyeOff size={40} color="white" />
						) : (
							<Eye size={40} color="white" />
						)}
					</div>
					<div
						className={`h-12 w-12 rounded-full ${
							!isRecording ? 'bg-green-600' : 'bg-gray-400'
						} flex items-center justify-center`}
						onClick={clickRecording}
						// onTouchStart={async e => {
						// 	e.preventDefault();
						// 	if (!isRecording) {
						// 		setIsSending(true);
						// 		setIsPressed(true);
						// 		await startRecording();
						// 		setIsRecording(true);
						// 		setRecordingTime(0);
						// 	}
						// }}
						// onTouchEnd={async e => {
						// 	e.preventDefault();
						// 	if (isRecording) {
						// 		setIsPressed(false);
						// 		await stopRecording();
						// 		setIsRecording(false);
						// 		await handleSendMessage();
						// 	}
						// }}
						// onTouchCancel={async e => {
						// 	e.preventDefault();
						// 	if (isPressed && isRecording) {
						// 		setIsPressed(false);
						// 		await stopRecording();
						// 		setIsRecording(false);
						// 		await handleSendMessage();
						// 	}
						// }}
					>
						{isRecording ? <Podcast color="white" /> : <Mic color="white" />}
					</div>
					<div
						className="flex h-12 w-12 items-center justify-center rounded-full bg-custom-red-005"
						onClick={() => {
							router.push('/roles/v1');
						}}
					>
						<PhoneOff color="white" />
					</div>
					<div>
						<History size={40} color="white" />
					</div>
					<audio ref={audioRef} src={audioSrc} preload="metadata" />
				</div>
			)}
		</div>
	);
};

export default withAuth(StoryCommunicate);
