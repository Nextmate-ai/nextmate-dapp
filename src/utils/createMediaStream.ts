const getPeakLevel = (analyzer: AnalyserNode) => {
	const array = new Uint8Array(analyzer.fftSize);
	analyzer.getByteTimeDomainData(array);
	return (
		array.reduce((max, current) => Math.max(max, Math.abs(current - 127)), 0) /
		128
	);
};

const createMediaStream = (
	stream: MediaStream,
	isRecording: boolean,
	callback: (peak: number) => void,
): (() => void) => {
	const context = new AudioContext();
	const source = context.createMediaStreamSource(stream);
	const analyzer = context.createAnalyser();
	source.connect(analyzer);

	let animationFrameId: number;

	const tick = () => {
		if (isRecording) {
			const peak = getPeakLevel(analyzer);
			callback(peak);
			animationFrameId = requestAnimationFrame(tick);
		}
	};

	tick();

	// 返回一个函数，用于停止音频流分析
	return () => {
		cancelAnimationFrame(animationFrameId);
		analyzer.disconnect();
		source.disconnect();
		context.close();
	};
};

export { createMediaStream };
