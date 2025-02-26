'use client';

import { Suspense } from 'react';
import RedirectContent from './RedirectContent';

export default function Redirect() {
	return (
		<div className="flex h-screen items-center justify-center">
			<Suspense fallback={<p className="text-lg">Loading...</p>}>
				<RedirectContent />
			</Suspense>
		</div>
	);
}
