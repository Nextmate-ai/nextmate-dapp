import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
	const processEnv = {
		env: {
			NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
		},
	};
	console.log('这里是服务端生成配置送给客户端的地方 => ', processEnv);

	return (
		<Html lang="en">
			<Head>
				<script src="https://tma.tonjoy.ai/sdk/ttag.browser.js?media_id=1850739812747370497"></script>
			</Head>
			<body>
				<Script id="initState" strategy="beforeInteractive">
					{`window.process=${JSON.stringify(processEnv)}`}
				</Script>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
