import { ClientProviders } from './context/ClientProviders';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { ViewTransitions } from 'next-view-transitions';
import ClientLayout from './context/ClientLayout';
import { Toaster } from 'react-hot-toast';
import { ToastProvider } from './_components/ToastModal/ToastContext';
import { RouterLoadingProvider } from '@/app/_components/RouterLoading/RouterLoading';
import { WalletModalProvider } from '@/app/_components/WalletModal/WalletModalContext';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="">
			<ViewTransitions>
				<body className="relative flex h-screen w-full justify-center overflow-hidden bg-black">
					<ClientProviders>
						<ClientLayout>
							<ToastProvider>
								<WalletModalProvider>
									<RouterLoadingProvider>
										<div className="mx-auto h-full bg-black sm:max-w-[520px]">
											{children}
										</div>
									</RouterLoadingProvider>
								</WalletModalProvider>
							</ToastProvider>
							<Toaster />
						</ClientLayout>
					</ClientProviders>
					{/* 统计 */}
					<script src="https://tma.tonjoy.ai/sdk/ttag.browser.js?media_id=1850739812747370497"></script>
					<script
						type="text/javascript"
						src="https://cdnjs.cloudflare.com/ajax/libs/eruda/3.4.0/eruda.min.js"
					></script>
					{process.env.NEXT_PUBLIC_NODE_ENV !== 'production' && (
						<script>eruda.init();</script>
					)}
				</body>
			</ViewTransitions>
		</html>
	);
}
