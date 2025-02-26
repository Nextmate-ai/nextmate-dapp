'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import fetchAPI from '@/lib/api';
import toast from 'react-hot-toast';

const StudyBg = {
	Lucy: 'lucy-studying.png',
	David: 'david-studying.png',
};

/** 答对题数对应的学习速度（分钟）*/
const Speed = [0, 5, 4, 3];

/** 最长学习时间2两小时 */
const MaxStudyTime = 2 * 60 * 60;

function formatTime(time: number) {
	return `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(
		time % 60,
	).padStart(2, '0')}`;
}
interface StudyInfo {
	character: {
		ability: number;
		character: {
			name: 'David' | 'Lucy';
		};
	};
	quizAttempt: {
		correctCount: number;
		incorrectCount: number;
		startTime: string;
		endTime: string;
	};
}

const Study: React.FC = () => {
	const router = useRouter();
	const { id: characterId } = useParams();
	const params = useSearchParams();
	const quizAttemptId = params.get('quizAttemptId');

	const endConfirmDialogRef = useRef<HTMLDialogElement>(null);
	const [studyTime, setStudyTime] = useState<number>(0);
	const [ability, setAbility] = useState<number>(0);
	const [basicInfo, setBasicInfo] = useState<StudyInfo | null>(null);

	const characterName = basicInfo?.character.character.name;
	const speed = Speed[basicInfo?.quizAttempt.correctCount || 0];

	useEffect(() => {
		const interval = setInterval(() => {
			setStudyTime(time => time + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (speed === 0) return;
		if (studyTime % (speed * 60) !== 0) return;
		if (studyTime >= MaxStudyTime) {
			toast.success('Study End');
			router.replace('/roles/v1');
			return;
		}

		const study = async () => {
			const data = await fetchAPI('/api/study/ing', {
				method: 'POST',
				body: JSON.stringify({
					characterId,
					quizAttemptId,
				}),
			});
			if (data) {
				setAbility(data.ability);
			} else {
				toast.error(data.message);
				router.replace('/roles/v1');
			}
		};
		study();
	}, [speed, studyTime, characterId, quizAttemptId]);

	useEffect(() => {
		const init = async () => {
			const response = (await fetchAPI('/api/study/start', {
				method: 'GET',
				params: {
					characterId: characterId as string,
					quizAttemptId,
				},
			})) as StudyInfo;
			const quizEndTime = new Date(response.quizAttempt.endTime).getTime();
			const currentTime = new Date().getTime();
			const secondsElapsed = Math.floor((currentTime - quizEndTime) / 1000);

			setBasicInfo(response);
			setAbility(response.character.ability);
			setStudyTime(secondsElapsed);
		};

		init();
	}, [characterId, quizAttemptId]);

	const handleEnd = () => {
		endConfirmDialogRef.current.showModal();
	};

	const handleEndConfirm = () => {
		router.replace('/roles/v1');
	};

	if (!basicInfo) {
		return <>Loading...</>;
	}

	return (
		<>
			<div
				className="relative h-screen bg-cover"
				style={{
					backgroundImage: `url(/img/study/${
						StudyBg[characterName] || 'lucy-studying.png'
					})`,
				}}
			>
				<header className="relative mb-9 pt-4">
					<ChevronLeft
						className="absolute left-4 top-4 font-bold text-white"
						onClick={() => router.back()}
					/>
					<p className="text-center text-xl font-bold text-white">
						{characterName} is studying
					</p>
				</header>
				<div className="flex items-center justify-around px-10 text-white">
					<div className="flex flex-col items-center">
						<p>Ability</p>
						<span>{ability}</span>
					</div>
					<div className="h-6 w-[1px] bg-white" />
					<div className="flex flex-col items-center">
						<p>Learning Speed</p>
						<span>1 point / {speed} min</span>
					</div>
					<div className="h-6 w-[1px] bg-white" />
					<div className="flex flex-col items-center">
						<p>Time</p>
						<span className="w-12 text-center">{formatTime(studyTime)}</span>
					</div>
				</div>

				<div className="absolute bottom-6 flex w-full justify-center">
					<button
						className="rounded-full bg-[#8D87F9] px-5 py-3 font-bold text-white"
						onClick={() => handleEnd()}
					>
						End Study
					</button>
				</div>
			</div>

			<EndConfirmDialog
				ref={endConfirmDialogRef}
				onContinue={() => {
					endConfirmDialogRef.current.close();
				}}
				onEnd={() => handleEndConfirm()}
			/>
		</>
	);
};

const EndConfirmDialog = forwardRef(
	(
		props: {
			onContinue: () => void;
			onEnd: () => void;
		},
		ref: ForwardedRef<HTMLDialogElement>,
	) => {
		return (
			<dialog ref={ref} className="overflow-hidden bg-transparent">
				<div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-80">
					<div className="flex w-5/6 flex-col justify-center rounded-2xl bg-white px-5 py-6 sm:max-w-[520px]">
						<div className="relative">
							<h2 className="text-center text-xl font-semibold">
								Sure to end study?
							</h2>
							<X
								className="absolute right-0 top-0 text-gray-500"
								onClick={() => props.onContinue()}
							/>
						</div>

						<p className="mt-8 max-w-[312px]">
							If you end study now, Lucy will lose the chance to gain more
							ability.
						</p>

						<div className="flex justify-between gap-2">
							<button
								className="mt-8 flex w-full justify-center rounded-full bg-[#6E67F6] py-3 text-white"
								onClick={() => props.onContinue()}
							>
								Continue
							</button>

							<button
								className="mt-8 flex w-full justify-center rounded-full bg-[#F5F5F5] py-3 text-[#6E67F6]"
								onClick={() => props.onEnd()}
							>
								End
							</button>
						</div>
					</div>
				</div>
			</dialog>
		);
	},
);
EndConfirmDialog.displayName = 'EndConfirmDialog';

export default Study;
