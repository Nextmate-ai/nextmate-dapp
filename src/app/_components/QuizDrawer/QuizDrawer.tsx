import React, { useEffect, useState } from 'react';
import { Clock, SearchCheck, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import fetchAPI from '@/lib/api';

interface Question {
	id: string;
	content: string;
	options: string[];
}

interface QuizDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	userCharacterId: string;
}

const QuizDrawer: React.FC<QuizDrawerProps> = ({
	isOpen,
	onClose,
	userCharacterId,
}) => {
	const router = useRouter();
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
		null,
	);
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [disableConfirm, setDisableConfirm] = useState(false);
	const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null);
	const [answers, setAnswers] = useState<
		{ questionId: string; selectedAnswer: number; isCorrect: boolean }[]
	>([]);
	const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
	const [quizStartTime, setQuizStartTime] = useState<number | null>(null);

	useEffect(() => {
		if (isOpen) {
			startQuiz();
		}
	}, [isOpen, userCharacterId]);

	const startQuiz = async () => {
		try {
			const data = await fetchAPI('/api/quiz/start', {
				method: 'POST',
				body: JSON.stringify({ userCharacterId }),
			});
			if (data) {
				setQuestions(data.questions);
				setQuizAttemptId(data.quizAttemptId);
				setQuizStartTime(Date.now());
				resetQuizState();
			} else {
				toast.error(data.error);
				onClose();
				console.error('Failed to start quiz:', data.error);
			}
		} catch (error) {
			console.error('Error starting quiz:', error);
		}
	};

	const resetQuizState = () => {
		setCurrentQuestionIndex(0);
		setSelectedOptionIndex(null);
		setIsConfirmed(false);
		setIsPending(false);
		setShowResult(false);
		setDisableConfirm(false);
		setAnswers([]);
		setCorrectAnswer(null);
	};

	const handleOptionSelect = (index: number) => {
		if (!isConfirmed && !isPending) {
			setSelectedOptionIndex(index);
		}
	};

	const handleConfirm = async () => {
		if (selectedOptionIndex !== null && !isPending) {
			setIsPending(true);
			setDisableConfirm(true);
			const currentQuestion = questions[currentQuestionIndex];

			try {
				const data = await fetchAPI('/api/quiz/answer', {
					method: 'POST',
					body: JSON.stringify({
						questionId: currentQuestion.id,
						selectedAnswer: selectedOptionIndex,
					}),
				});
				if (data) {
					setAnswers([
						...answers,
						{
							questionId: currentQuestion.id,
							selectedAnswer: selectedOptionIndex,
							isCorrect: data.isCorrect,
						},
					]);
					setCorrectAnswer(data.correctAnswer);
					setIsConfirmed(true);
				} else {
					console.error('Failed to submit answer:', data.error);
				}
			} catch (error) {
				console.error('Error submitting answer:', error);
			} finally {
				setIsPending(false);
			}

			setTimeout(() => {
				if (currentQuestionIndex < questions.length - 1) {
					setCurrentQuestionIndex(currentQuestionIndex + 1);
					setSelectedOptionIndex(null);
					setIsConfirmed(false);
					setDisableConfirm(false);
					setCorrectAnswer(null);
				} else {
					setShowResult(true);
				}
			}, 2000);
		}
	};

	const currentQuestion = questions[currentQuestionIndex];
	const currentAnswer = answers[currentQuestionIndex];

	const correctCount = answers.filter(a => a.isCorrect).length;
	const totalTime = quizStartTime
		? Math.round((Date.now() - quizStartTime) / 1000)
		: 0;

	return (
		<>
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black bg-opacity-50"
					onClick={onClose}
				></div>
			)}
			<div
				className={`fixed bottom-0 left-0 right-0 transform ${
					isOpen ? 'translate-y-0' : 'translate-y-full'
				} z-50 mx-auto h-[760px] max-w-lg rounded-t-3xl bg-white px-4 pb-4 shadow-lg transition-transform duration-300`}
			>
				<div className="absolute right-4 top-4" onClick={onClose}>
					<X className="h-6 w-6 cursor-pointer" />
				</div>
				{!showResult ? (
					<>
						{currentQuestion && (
							<>
								<h2 className="mt-16 p-4 text-center text-xl font-bold">
									{currentQuestion.content}
								</h2>
								<div className="flex flex-col gap-5">
									{currentQuestion.options.map((option, index) => (
										<button
											key={index}
											onClick={() => handleOptionSelect(index)}
											className={`flex h-[60px] w-full items-center rounded-full border px-4 py-2 text-left transition-colors ${
												selectedOptionIndex === index
													? isConfirmed
														? currentAnswer?.isCorrect
															? 'bg-green-500 text-white'
															: 'bg-red-800 text-white'
														: isPending
															? 'bg-yellow-500 text-white'
															: 'border-custom-purple-002'
													: isConfirmed && index === correctAnswer
														? 'bg-green-500 text-white'
														: ''
											}`}
											disabled={isPending || isConfirmed}
										>
											<div
												className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
													selectedOptionIndex === index
														? isConfirmed
															? currentAnswer?.isCorrect
																? 'bg-white text-green-500'
																: 'bg-white text-red-800'
															: isPending
																? 'bg-white text-yellow-500'
																: 'bg-custom-purple-004 text-white'
														: isConfirmed && index === correctAnswer
															? 'bg-white text-green-500'
															: 'bg-custom-purple-002'
												} mr-3`}
											>
												{String.fromCharCode(65 + index)}
											</div>
											{option}
										</button>
									))}
								</div>
								<button
									className={`mb-2 mt-5 h-[60px] w-full rounded-full py-2 text-xl text-white ${
										selectedOptionIndex !== null && !isConfirmed && !isPending
											? 'bg-custom-purple-006 shadow-xl'
											: isPending
												? 'bg-yellow-500'
												: 'bg-gray-300'
									}`}
									onClick={handleConfirm}
									disabled={
										selectedOptionIndex === null || disableConfirm || isPending
									}
								>
									{isPending ? 'Checking...' : 'Confirm'}
								</button>
							</>
						)}
					</>
				) : (
					<div className="flex flex-col items-center gap-2 p-4 text-center">
						<div className="mt-16 h-40 w-40 rounded-full bg-custom-purple-001"></div>
						<h2 className="text-xl font-bold">Congratulations!</h2>
						<p>
							You got {correctCount} right answers out of {questions.length}.
						</p>
						<div className="flex w-full items-center justify-between">
							<div className="flex h-24 w-full justify-center gap-4 rounded-3xl border text-left font-thin text-custom-gray-003">
								<p className="my-6 flex flex-col items-center">
									<strong className="text-sm">Time:</strong>
									<div className="flex items-center gap-2">
										<Clock size={'14'} />
										{totalTime}s
									</div>
								</p>
								<p className="my-6 flex flex-col items-center border-l border-r pl-4 pr-4">
									<strong className="text-sm">Learning Speed:</strong>
									{totalTime < 30 ? 'Fast' : totalTime < 60 ? 'Medium' : 'Slow'}
								</p>
								<p className="my-6 flex flex-col items-center">
									<strong className="text-sm">Correct:</strong>
									<div className="flex items-center gap-2">
										<SearchCheck size={'14'} />
										{correctCount}
									</div>
								</p>
							</div>
						</div>
						<div className="w-full">
							<button
								disabled={correctCount === 0}
								className={`mt-4 h-[60px] w-full rounded-full py-2 text-xl ${
									correctCount > 0 ? 'bg-custom-purple-006' : 'bg-slate-300'
								} text-white`}
								onClick={async () => {
									await fetchAPI('/api/quiz/submit', {
										method: 'POST',
										body: JSON.stringify({
											quizAttemptId: quizAttemptId,
											answers,
										}),
									});

									router.push(
										`/study/${userCharacterId}?quizAttemptId=${quizAttemptId}`,
									);
								}}
							>
								Go to Study
							</button>
							<button
								className="mt-4 h-[60px] w-full rounded-full bg-gray-200 py-2 text-xl text-custom-purple-006"
								onClick={() => {
									setShowResult(false);
									setCurrentQuestionIndex(0);
									setSelectedOptionIndex(null);
									setIsConfirmed(false);
									setDisableConfirm(false);
									setAnswers([]);
									onClose();
								}}
							>
								Back Home
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default QuizDrawer;
