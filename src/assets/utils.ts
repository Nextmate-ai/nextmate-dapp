export function encodeSvgToImgSrc(svg: string) {
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const formatDecimal = (
	value: string | number | undefined | null,
	decimal: number = 7,
): string => {
	// 处理无效输入
	if (value === undefined || value === null || value === '') {
		return '0';
	}

	try {
		// 如果是字符串，先去除多余空格
		const strValue = typeof value === 'string' ? value.trim() : String(value);

		// 转换为数字
		const num = parseFloat(strValue);

		// 检查是否为有效数字
		if (isNaN(num)) {
			return '0';
		}

		// 使用toFixed处理小数点
		const fixed = num.toFixed(decimal);

		// 可选：移除末尾的0
		// return fixed.replace(/\.?0+$/, '');

		// 或者保留所有0
		return fixed;
	} catch (error) {
		console.error('Format decimal error:', error);
		return '0';
	}
};

export const sleep = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms));
