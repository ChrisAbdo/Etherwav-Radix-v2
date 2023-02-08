import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Poppins } from '@next/font/google';
import { Toaster } from 'react-hot-toast';
import { ChainId } from '@thirdweb-dev/react';
import { ThirdwebProvider } from '@thirdweb-dev/react';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  Calculator,
  CreditCard,
  Radio as RadioIcon,
  Settings,
  Upload,
  User,
} from 'lucide-react';
import Head from 'next/head';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
});

const activeChainId = ChainId.Mumbai;

export default function App({ Component, pageProps }: AppProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // if user presses control + k
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="author" content="Christopher Abdo" />
        <meta
          name="description"
          content="Etherwav is an algorthmically rewarding and community driven Web3 radio built to reward creators for making amazing music."
        />
        <meta
          name="keywords"
          content="Christopher Abdo, Etherwav, web3 radio, web3, software engineer, developer, programming, projects"
        />
      </Head>
      <main className={poppins.className}>
        <ThemeProvider>
          {/* @ts-ignore */}
          <Navbar open={open} setOpen={setOpen} />
          <CommandDialog open={open} onOpenChange={setOpen}>
            <div className="mt-3 w-[95%]">
              <CommandInput placeholder="Type a command or search..." />
            </div>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <Link href="/radio">
                  <CommandItem>
                    <RadioIcon className="mr-2 h-4 w-4" />
                    <span className="text-black dark:text-white">Radio</span>
                  </CommandItem>
                </Link>
                <Link href="/upload">
                  <CommandItem>
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Upload</span>
                  </CommandItem>
                </Link>
                <Link href="/profile">
                  <CommandItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </CommandItem>
                </Link>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Coming Soon | Search For Songs & Artists">
                <CommandItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </main>
    </ThirdwebProvider>
  );
}
