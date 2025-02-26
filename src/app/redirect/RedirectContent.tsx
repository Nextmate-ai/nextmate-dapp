'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function RedirectContent() {
	const searchParams = useSearchParams();

	useEffect(() => {
		const deeplinkParam = searchParams.get('deeplink');
		if (deeplinkParam) {
			window.location.href = decodeURIComponent(deeplinkParam);
		}
	}, [searchParams]);

	return <p className="text-lg">Redirecting to TronLink...</p>;
}
