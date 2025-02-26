const blobToBase64 = (blob: Blob, callback: (base64data: string) => void) => {
	const reader = new FileReader();
	reader.onload = function () {
		const base64data = reader?.result?.toString().split(',')[1];
		callback(base64data || '');
	};
	console.log('Blob size:', blob.size);
	reader.readAsDataURL(blob);
};

export { blobToBase64 };
