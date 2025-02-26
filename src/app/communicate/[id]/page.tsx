'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import moment from 'moment';
import { useDeepCompareEffect } from 'ahooks';
import ChatMessage from '@/app/_components/ChatMessage/ChatMessage';
import { ChevronUp, ChevronLeft, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useWebSocket from 'react-use-websocket';
import { useRecordVoice } from '@/hooks/useRecordVoice';
import { withAuth } from '@/app/_components/withAuth/withAuth';
import { useChatHistory } from '@/hooks/useChatHistory';
import { ChatStatus, ChatMessage as ChatMessageType } from '@/types/chat.type';
import { RootState } from '@/store/store';
import fetchAPI from '@/lib/api';
import ChatActionModal, {
	ChatActionButton,
} from '@/app/_components/ChatActionModal/ChatActionModal';
import handleAudioData from '@/utils/handleAudioData';
import { getCookie } from 'cookies-next';
import { useSpring, animated } from 'react-spring';
import '@/app/_components/ChatMessage/ChatMessage.css';
import { useUserBalance } from '@/hooks/useBalance';
import { useRouterLoadingContext } from '@/app/_components/RouterLoading/RouterLoading';
import { useToastContext } from '@/app/_components/ToastModal/ToastContext';

const dailyInteractionTime = 2 * 60 * 1000;

//无需求事件
const dailyInteraction = [
	{
		text: "Hi there! I'm feeling a bit thirsty right now. Would you like to take a break and have a cup of coffee or tea with me?",
		options: [
			{
				option: 'Drink water',
				text: 'Drink water',
				type: 'water',
				diamond: 10,
			},
			{
				option: 'A cup of coffee',
				text: 'A cup of coffee',
				type: 'coffee',
				diamond: 20,
			},
			{
				option: 'I prefer tea',
				text: 'I prefer tea',
				type: 'tea',
				diamond: 40,
			},
		],
	},

	{
		text: "Hi! I'm feeling a bit hungry and thinking of going to the convenience store to grab something to eat. Want to join me? We can pick out some tasty snacks together!",
		options: [
			{
				option: 'Get some snacks',
				text: 'Get some snacks',
				type: 'snacks',
				diamond: 10,
			},
			{
				option: 'Get a sandwich',
				text: 'Get a sandwich',
				type: 'sandwich',
				diamond: 20,
			},
			{
				option: 'Grab some desserts',
				text: 'Grab some desserts',
				type: 'desserts',
				diamond: 40,
			},
		],
	},

	{
		text: 'Hi there! I was thinking of going to the mall for a bit of shopping. How about joining me? Which mode of transportation would you prefer – taxi,subway, or bus?',
		options: [
			{
				option: "Let's take a taxi.",
				text: "Let's take a taxi.",
				type: 'taxi',
				diamond: 10,
			},
			{
				option: 'I prefer the subway',
				text: 'I prefer the subway',
				type: 'subway',
				diamond: 20,
			},
			{
				option: 'How about the bus',
				text: 'How about the bus',
				type: 'bus',
				diamond: 30,
			},
		],
	},
];

function getRandomArrayElement<T>(arr: T[]): T {
	if (arr.length === 0) {
		throw new Error('Array cannot be empty');
	}

	return arr[Math.floor(Math.random() * arr.length)];
}

const Communicate: React.FC = () => {
	const { id: characterId } = useParams();
	const router = useRouter();
	const userId = useSelector(
		(state: RootState) => state.accountInfo.account?.id!,
	);
	const authorizationCookie = getCookie('Authorization');

	const {
		chatHistory,
		// sendMessage,
		// isLoading,
		backgroundImage,
		equipmentName,
		error: historyError,
	} = useChatHistory(userId, characterId as string);

	const [audioChunks, setAudioChunks] = useState([]);
	const [transcript, setTranscript] = useState<string>('');
	const [energy, setEnergy] = useState<number>();
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const audioRef = useRef(null);
	const audioRef2 = useRef(null);
	const [audioSrc, setAudioSrc] = useState<string>();
	const [receivingMsg, setReceivingMsg] = useState(false);
	// 临时存储 AI text
	const [AITextData, setAITextData] = useState([]);
	const [isMsgFull, setisMsgFull] = useState(false);

	const {
		recording,
		startRecording,
		stopRecording,
		text,
		audioData,
		isTranscribing,
		error: recordingError,
	} = useRecordVoice(characterId as string);

	const [chatData, setChatData] = useState<ChatMessageType[]>();
	const [showActionModal, setShowActionModal] = useState<boolean>(false);
	const [actions, setActions] = useState<ChatActionButton>(null);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const [isSending, setIsSending] = useState(false);
	// const [balance, setBalance] = useState<{
	// 	diamond: number;
	// 	gold: number;
	// 	energy: number;
	// } | null>(null);
	const [popupTimeoutId, setPopupTimeoutId] = useState<NodeJS.Timeout | null>(
		null,
	);
	const [lazyTimeoutId, setLazyTimeoutId] = useState<NodeJS.Timeout | null>(
		null,
	);
	const [showSlap, setShowSlap] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const account = useSelector((state: RootState) => state.accountInfo).account;
	const { data: balance, reload: reloadBalance } = useUserBalance();
	const { showRouterLoading } = useRouterLoadingContext();

	const socketOrigin = process.env.NEXT_PUBLIC_BACKEND_URL?.split('://')?.[1];
	const WS_URL = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${socketOrigin}/api/chat_stream?Authorization=${authorizationCookie}`;

	const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
		shouldReconnect: closeEvent => true, // 总是尝试重连
		reconnectInterval: attemptNumber =>
			Math.min(Math.pow(2, attemptNumber) * 1000, 30000), // 指数退避，最大30秒
		reconnectAttempts: Infinity, // 无限重试
		retryOnError: true,
	});

	const { showToast } = useToastContext();

	const springProps = useSpring({
		height: isMsgFull ? '100%' : '40%',
		config: { mass: 1, tension: 280, friction: 90 },
	});

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [chatData, isSending]);

	useDeepCompareEffect(() => {
		// 当只有欢迎语时，播放欢迎语音
		if (chatHistory?.length === 1 && chatHistory[0].role === 'system') {
			audioRef2.current.play();
		}
		if (chatHistory?.length) {
			setIsLoading(false);
		}
		setChatData(chatHistory);
	}, [chatHistory]);

	useEffect(() => {
		if (text) {
			setIsSending(false);
			setChatData(text);

			reloadBalance();
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

	// 获取 history error
	useEffect(() => {
		if (historyError) {
			toast.error(
				historyError.message ||
					historyError.error ||
					'Error fetching chat history',
			);
		}
	}, [historyError]);

	useEffect(() => {
		// 有需求事件
		const quantitativeNeeds = [];

		// 每 30 分钟触发日常互动
		const intervalId = setInterval(() => {
			// 产生一个 0 到 30 分钟之间的随机延迟
			const randomDelay = Math.floor(Math.random() * dailyInteractionTime);
			// 设置定时器，延迟后显示弹窗
			const timeoutId = setTimeout(async () => {
				setShowActionModal(true);
				const randomElement = getRandomArrayElement(dailyInteraction);
				const dailyAudioData = await fetchAPI('/api/tts', {
					method: 'POST',
					body: {
						text: randomElement.text,
						characterId: characterId as string,
					},
				});

				const newAudioUrl = handleAudioData(dailyAudioData.audioData);

				setAudioSrc(newAudioUrl);
				setTimeout(() => {
					if (audioRef.current) {
						audioRef.current.play().catch(error => {
							console.error('Error playing audio:', error);
						});
					}
				}, 100);

				if (chatData) {
					setChatData([
						...chatData,
						{
							content: randomElement.text,
							role: 'assistant',
							time: moment().format('YYYY-MM-DD HH:mm:ss'),
						},
					]);
				}

				// 等待人物读完对白
				const newLazyTimeoutId = setTimeout(() => {
					setActions(randomElement);
				}, 6000);
				setLazyTimeoutId(newLazyTimeoutId);
			}, randomDelay);

			setPopupTimeoutId(timeoutId);
		}, dailyInteractionTime);

		return () => {
			clearInterval(intervalId);
			if (popupTimeoutId) {
				clearTimeout(popupTimeoutId);
			}
			if (lazyTimeoutId) {
				clearTimeout(lazyTimeoutId);
			}
		};
	}, [chatData]);

	useEffect(() => {
		const list = ['sundog', 'pepe'];
		setShowSlap(list.includes(backgroundImage));
	}, [backgroundImage]);

	// 接收 websocket 消息
	useEffect(() => {
		if (lastMessage !== null) {
			setIsSending(false);

			if (lastMessage.data instanceof Blob) {
				if (lastMessage.data.size) {
					setAudioChunks(prevBlobs => [...prevBlobs, lastMessage.data]);
				} else if (!lastMessage.data.size) {
					// 最后一次
					setReceivingMsg(false);
					if (AITextData?.length) {
						setChatData(AITextData);
					}
					const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' }); // 假设音频格式为 mp3
					const url = URL.createObjectURL(audioBlob);
					setAudioSrc(url);
					setAudioChunks([]);
					setTimeout(() => {
						setAITextData([]);
						audioRef.current.play();
					}, 30);
				}
			} else {
				const data = JSON.parse(lastMessage.data);
				if (data.success === false) {
					if (data.msg) {
						toast.error(data.msg);
					}
				} else {
					switch (data.type) {
						case 'UserText':
							setChatData([
								...chatData,
								{
									content: data.data,
									role: 'user',
								},
							]);
							// 接收到返回的消息时就设置接收 AI loading
							setReceivingMsg(true);
							break;
						case 'AIText':
							{
								// const lastHistoryData = chatData[chatData.length - 1];
								// if (lastHistoryData.role === 'user') {
								// 	setChatData([
								// 		...chatData,
								// 		{
								// 			content: data.data,
								// 			role: 'assistant',
								// 		},
								// 	]);
								// } else {

								setAITextData([
									...chatData,
									{
										content: data.data,
										role: 'assistant',
									},
								]);
								// }
							}
							break;

						default:
							break;
					}
				}
			}
		}
	}, [lastMessage]);

	const renderChatMessages = (isMsgFull: boolean) => {
		if (!chatData) return null;
		return (
			<>
				{chatData.map((message, index) => (
					<ChatMessage
						key={`${message.content}-${index}`}
						content={message.content}
						time={message?.time}
						isMsgFull={isMsgFull}
						type={message.role === 'user' ? 'sent' : 'received'}
					/>
				))}
			</>
		);
	};

	const MessageSkeleton: React.FC = () => (
		<div className="mb-4 flex animate-pulse justify-end">
			<div className="max-w-[70%] rounded-lg bg-gray-300 p-3">
				<div className="mb-2 h-4 w-44 rounded bg-gray-400"></div>
				<div className="h-4 w-44 rounded bg-gray-400"></div>
			</div>
		</div>
	);

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

	const clickRecording = async () => {
		// 点击后才能自动播放语音
		audioRef.current.load();
		if (isRecording) {
			const audioBase64 = await stopRecording();

			setIsRecording(false);
			if (audioBase64) {
				sendMessage(
					JSON.stringify({
						userCharacterId: characterId,
						audioData: audioBase64,
					}),
				);
			}
		} else {
			setIsSending(true);
			await startRecording();
			setIsRecording(true);
		}
	};

	const clickMsgFul = () => {
		setisMsgFull(!isMsgFull);
	};

	return (
		<div
			className={`relative flex h-full w-full flex-col bg-cover bg-no-repeat ${chatData ? 'bg-black bg-opacity-85' : ''}`}
			style={
				backgroundImage
					? {
							backgroundImage: `url('/img/${equipmentName ? `${backgroundImage}_${equipmentName}.jpeg` : `${backgroundImage}.png`}')`,
						}
					: {}
			}
		>
			{/* 顶部栏，包含金币数量 */}
			<div
				className={`fixed top-0 flex w-full items-center justify-between p-4 ${isMsgFull ? 'bg-black bg-opacity-70 backdrop-blur-lg' : 'bg-opacity-0'}`}
			>
				<div className="flex items-center">
					<Link
						href={'/roles/v1'}
						onClick={() => showRouterLoading('/roles/v1')}
					>
						<ChevronLeft color="white" size={20} />
					</Link>
					<span className="ml-4 text-white">
						{backgroundImage
							? backgroundImage === 'dragon'
								? 'DGTRON'
								: `${backgroundImage?.toUpperCase()}`
							: ''}
					</span>
				</div>

				<div className="flex w-full items-center justify-end gap-3">
					{/* energy */}
					<div className="flex h-6 items-center justify-center gap-1">
						<img src="/img/icon/energy.svg" alt="energy" className="w-4" />
						<div className="text-center font-poppins text-base font-medium leading-3 text-white">
							{balance?.energy}
						</div>
					</div>
					{/* diamond */}
					<div className="flex h-6 items-center justify-center gap-1">
						<img src="/img/icon/diamond.svg" alt="diamond" className="w-4" />
						<div className="text-center font-poppins text-base font-medium leading-3 text-white">
							{balance?.diamond}
						</div>
					</div>
					{/* gold */}
					<div className="flex h-6 items-center justify-center gap-1">
						<img src="/img/icon/coin.svg" alt="coin" className="w-4" />
						<div className="text-center font-poppins text-base font-medium leading-3 text-white">
							{balance?.gold}
						</div>
					</div>
				</div>
			</div>
			{/* 弹性空间 */}
			<div className="flex-1"></div>
			{/* 中间聊天记录 */}
			<animated.div
				ref={chatContainerRef}
				style={{
					height: springProps.height,
				}}
				className={`no-scrollbar relative mb-20 w-full overflow-y-auto bg-gradient-to-b from-transparent to-black p-4 sm:max-w-[520px] ${isMsgFull ? 'mt-14 bg-black bg-opacity-40 backdrop-blur-lg' : 'bg-gradient-to-b from-transparent to-black'}`}
			>
				<div className="sticky top-0 z-50 flex w-full justify-end text-right">
					<div
						className="flex h-6 w-6 items-center justify-center rounded-full bg-white bg-opacity-20"
						onClick={clickMsgFul}
					>
						{isMsgFull ? (
							<ChevronDown color="white" size={20} />
						) : (
							<ChevronUp color="white" size={20} />
						)}
					</div>
				</div>
				{isLoading ? renderSkeletonLoader() : renderChatMessages(isMsgFull)}
				{/* {isSending && <MessageSkeleton key="temp-skeleton" />} */}
				{isSending && (
					<div className="flex w-full justify-end">
						<div className="relative flex h-[32px] w-32 items-stretch shadow-md">
							<img
								className="absolute h-full w-full"
								src={'/img/bg-chat-sent.png'}
							/>
							<div className="flex h-[32px] w-28 justify-center">
								<img src="/img/loading-purple.gif" className="scale-[2]" />
							</div>
						</div>
					</div>
				)}
				{receivingMsg && (
					<div className="relative flex h-[32px] w-32 items-stretch justify-end shadow-md">
						<img className="absolute h-full w-full" src={'/img/bg-chat.png'} />
						<div className="flex h-[32px] w-28 justify-center">
							<img src="/img/loading-purple.gif" className="scale-[2]" />
						</div>
					</div>
				)}
			</animated.div>
			{showActionModal && (
				<ChatActionModal
					actions={actions}
					updateChatData={dailyInteractionMsg =>
						setChatData([...chatData, dailyInteractionMsg])
					}
					onCancel={() => setShowActionModal(false)}
				/>
			)}

			{/* 底部操作栏 */}
			<div
				className={`fixed bottom-0 z-10 m-auto flex h-[96px] w-full items-center justify-around bg-black px-2 py-4 backdrop-blur-lg ${isMsgFull ? 'bg-opacity-100' : 'bg-opacity-100'} sm:max-w-[520px]`}
			>
				{/* 显示文本 */}
				<Link
					href="/vote"
					className="flex h-14 w-10 flex-col items-center justify-center p-3"
				>
					<img
						src="/img/icon/vote.svg"
						alt="vote"
						className="-mb-1 h-[18px] w-[18px] transition-all duration-300 ease-in-out"
					/>
					<div className="mt-2 text-sm text-white">Predict</div>
				</Link>
				<div className="relative flex-1 px-4" onClick={clickRecording}>
					<img src="/img/bg-chat-btn.png" className="h-16 w-[345px]" />
					<div className="absolute left-1/2 top-1/2 flex min-w-44 -translate-x-1/2 -translate-y-1/2 justify-center">
						<span className={`text-center text-xl font-semibold text-white`}>
							{isRecording ? 'Stop And Send' : 'Click To Talk'}
						</span>
					</div>
				</div>
				{/* 拍一拍 */}
				<Link
					href={
						backgroundImage === 'sundog'
							? `/communicate/${characterId}/slag`
							: `/communicate/${characterId}/slag/pepe`
					}
					onClick={() =>
						showRouterLoading(
							backgroundImage === 'sundog'
								? `/communicate/${characterId}/slag`
								: `/communicate/${characterId}/slag/pepe`,
						)
					}
					className={`${showSlap ? 'opacity-100' : 'opacity-0'} flex h-14 w-10 cursor-pointer flex-col items-center justify-center`}
				>
					<img className="h-6 w-6" src="/img/icon/hand.svg" />
					<span className="text-sm text-white">
						{backgroundImage === 'sundog' ? 'Pat' : 'Disco'}
					</span>
				</Link>
			</div>
			<audio ref={audioRef} src={audioSrc} preload="metadata" />
			<audio
				ref={audioRef2}
				src={backgroundImage ? `/audio/${backgroundImage}-greeting.mp3` : ''}
				preload="auto"
			/>
		</div>
	);
};

export default withAuth(Communicate);
