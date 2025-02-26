'use client';
import { useMemo } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { RainbowConnector } from '@/lib/rainbowKit';
import store from '@/store/store';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
// import '@tronweb3/tronwallet-adapter-react-ui/style.css';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import {
	TronLinkAdapter,
	OkxWalletAdapter,
} from '@tronweb3/tronwallet-adapters';
import isMobile from '@/lib/isMobile';

export function ClientProviders({ children }: { children: React.ReactNode }) {
	const adapters = useMemo(() => {
		const tronLinkAdapter = new TronLinkAdapter();
		return [tronLinkAdapter];
	}, []);
	return (
		<ReduxProvider store={store}>
			<SnackbarProvider autoHideDuration={1000}>
				<WalletProvider adapters={adapters}>
					<WalletModalProvider>
						{children}
						{/* <SessionProvider session={session}>{children}</SessionProvider> */}
						{/* <WalletActionButton></WalletActionButton> */}
					</WalletModalProvider>
				</WalletProvider>
				{/* <RainbowConnector> */}
				{/* </RainbowConnector> */}
			</SnackbarProvider>
		</ReduxProvider>
	);
}
