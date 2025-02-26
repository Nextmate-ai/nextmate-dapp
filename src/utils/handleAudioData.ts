function base64ToBlob(base64, mimeType) {
	const byteCharacters = atob(base64);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);
	return new Blob([byteArray], { type: mimeType });
}

const handleAudioData = (audioData: { data: string; type: string }) => {
	if (audioData?.data) {
		const audioBlob = base64ToBlob(audioData?.data, audioData?.type);
		const audioUrl = URL.createObjectURL(audioBlob);
		return audioUrl;
	}
	return '';
};

const handleAudioDataBuffer = base64Data => {
	const binaryString = window.atob(base64Data);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
};

export { handleAudioDataBuffer };

export default handleAudioData;
