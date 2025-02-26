import React, {
	useState,
	useRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	forwardRef,
} from 'react';
import ReferralCodeCss from './ReferralCode.module.css';

const ReferralCode = forwardRef(
	(
		{
			invitationCode,
			invitationMsg,
			onValueChange,
			onComplete,
		}: {
			invitationCode: string;
			invitationMsg: string;
			onValueChange: (value: string) => void;
			onComplete: any;
		},

		ref,
	) => {
		const [codes, setCodes] = useState(Array.from({ length: 6 }, () => ''));
		const inputsRef = useRef([]);
		const onValueChangeRef = useRef(onValueChange);

		useEffect(() => {
			onValueChangeRef.current = onValueChange;
		}, [onValueChange]);

		// 修改状态 codes
		const resetCodes = useCallback(
			(index: string | number | string[], value: string) => {
				setCodes(pre => {
					let newData = [...pre];

					if (Array.isArray(index)) {
						newData = index;
					}

					if (typeof index === 'number') {
						newData[index] = value;
					}

					// 处理 onComplete
					if (newData.every(Boolean) && onComplete) {
						onComplete(newData.join(''));
					}

					return newData;
				});
			},
			[onComplete],
		);

		useEffect(() => {
			onValueChangeRef.current(codes.join(''));
		}, [codes]);

		// const handleChange = useCallback(
		// 	(event: { target: { value: string } }, index: number) => {
		// 		// const currentValue = event.target.value.match(/[0-9]{1}/)
		// 		// 	? event.target.value
		// 		// 	: '';
		// 		const currentValue = event.target.value;

		// 		// 如果输入有效值, 则自动聚焦到下一个输入框
		// 		if (currentValue) {
		// 			inputsRef.current[index + 1]?.focus();
		// 		}

		// 		resetCodes(index, currentValue);
		// 	},
		// 	[resetCodes],
		// );
		const handleChange = useCallback(
			(event: { target: { value: string } }, index: number) => {
				const currentValue = event.target.value;

				// 如果输入有效值, 则自动聚焦到下一个输入框
				if (currentValue) {
					inputsRef.current[index + 1]?.focus();
				}

				resetCodes(index, currentValue);
			},
			[resetCodes],
		);

		const handleDelete = useCallback(
			(event: { key: any }, index: number) => {
				const { key } = event;

				// 是否按下删除键, 否提前结束
				if (key !== 'Backspace') {
					return;
				}

				// 1. 如果当前输入框有值, 则删除当前输入框内容
				if (codes[index]) {
					resetCodes(index, '');
				} else if (index > 0) {
					// 2. 如果当前输入框没有值(考虑下边界的情况 index === 0): 则删除上一个输入框内容, 并且光标聚焦到上一个输入框
					resetCodes(index - 1, '');
					inputsRef.current[index - 1].focus();
				}
			},
			[codes, resetCodes],
		);

		const handlePaste = useCallback(
			(event: { clipboardData: { getData: (arg0: string) => any } }) => {
				const pastedValue = event.clipboardData.getData('Text'); // 读取剪切板数据
				// const pastNum = pastedValue.replace(/[^0-9]/g, ''); // 去除数据中非数字部分, 只保留数字

				// 重新生成 codes: 6 位, 每一位取剪切板对应位置的数字, 没有则置空
				// const newData = Array.from(
				// 	{ length: 6 },
				// 	(_, index) => pastNum.charAt(index) || '',
				// );
				for (let index = 0; index < pastedValue.length; index++) {
					const element = pastedValue[index];
					if (index > 5) return;
					resetCodes(index, element);
				}

				// 光标要聚焦的输入框的索引, 这里取 pastNum.length 和 5 的最小值即可, 当索引为 5 就表示最后一个输入框了
				const focusIndex = Math.min(pastedValue.length, 5);
				inputsRef.current[focusIndex]?.focus();
			},
			[resetCodes],
		);

		const handleOnFocus = useCallback(
			(e: { target: { select: () => void } }) => {
				e.target.select();
			},
			[],
		);

		useImperativeHandle(ref, () => ({
			// 获取焦点
			focus: (index = 0) => {
				if (inputsRef.current) {
					inputsRef.current[index].focus();
				}
			},
			// 清空内容
			clear: () => {
				for (let index = 0; index < 6; index++) {
					if (index > 5) return;
					resetCodes(index, '');
				}
			},
			// 让最后一个输入框失去焦点
			blurLastInput: () => {
				inputsRef.current[5]?.blur();
			},
			// 让所有输入框失去焦点
			blurAllInputs: () => {
				inputsRef.current.forEach(input => input?.blur());
			},
		}));

		useEffect(() => {
			inputsRef.current[0].focus();
		}, []);

		useEffect(() => {
			for (let index = 0; index < invitationCode.length; index++) {
				const element = invitationCode[index];
				if (index > 5) return;
				resetCodes(index, element);
			}
		}, [invitationCode, resetCodes]);

		return (
			<>
				<div className="relative flex w-full flex-col items-center justify-center">
					{/* 邀请码 */}
					<div className="flex w-full items-center justify-center gap-2.5">
						{codes.map((value, index) => (
							<div
								className={`relative h-9 w-9 px-2.5 py-1.5 ${ReferralCodeCss.bgInput}`}
								key={index}
							>
								<input
									type="text"
									key={index}
									value={value}
									maxLength={1}
									onPaste={handlePaste}
									className={ReferralCodeCss.input}
									onFocus={handleOnFocus}
									onKeyDown={e => handleDelete(e, index)}
									onChange={e => handleChange(e, index)}
									ref={ele => {
										inputsRef.current[index] = ele;
									}}
								/>
								{invitationMsg && index === codes.length - 1 && (
									<img
										src="/img/icon/error.svg"
										alt="error"
										className="absolute right-[-30px] top-1/2 w-6 -translate-y-1/2 transform"
									/>
								)}
							</div>
						))}
					</div>
					{/* 报错提示 */}
					{invitationMsg && (
						<div className="absolute bottom-[-1.5rem] mt-2 w-80 text-center font-jamjuree text-base font-medium tracking-wide text-[#f44336]">
							{invitationMsg}
						</div>
					)}
				</div>
			</>
		);
	},
);
export default ReferralCode;
