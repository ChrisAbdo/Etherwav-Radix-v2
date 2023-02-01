import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Poppins } from '@next/font/google';
import { Toaster } from 'react-hot-toast';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

import Navbar from '@/components/Navbar';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
});

const activeChainId = ChainId.Mumbai;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <main className={poppins.className}>
        <ThemeProvider>
          <Navbar />
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </main>
    </ThirdwebProvider>
  );
}
