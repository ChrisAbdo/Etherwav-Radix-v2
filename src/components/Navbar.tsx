import React from 'react';
import NavMenu from './NavMenu';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Syringe } from 'lucide-react';
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';

// @ts-ignore
const Navbar = () => {
  const address = useAddress();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header
      aria-label="Site Header"
      className="shadow-sm sticky top-0 z-50 bg-white dark:bg-black border-b  dark:border-[#303030]"
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
        <div className="flex w-0 flex-1 lg:hidden">
          <Button
            variant="subtle"
            onClick={(e) => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          </Button>
        </div>

        <div className="flex items-center">
          <a href="#">
            <span className="sr-only">Logo</span>
            <span className="h-10 w-20 rounded-lg bg-gray-200"></span>
          </a>

          <Link
            href="/"
            className="text-2xl font-bold group transition-all duration-300 ease-in-out hidden lg:block"
          >
            <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
              Etherwav
            </span>
          </Link>
          <a
            className="group text-pink-500 transition-all duration-300 ease-in-out"
            href="#"
          ></a>
        </div>

        {/* reponsive */}
        <div className="flex w-0 flex-1 justify-end lg:hidden">
          <Dialog>
            <DialogTrigger asChild>
              {address ? (
                <Button variant="default">
                  {address.substring(0, 5)}...{address.substring(38, 42)}
                </Button>
              ) : (
                <Button variant="default">Connect Wallet</Button>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Connect your wallet.</DialogTitle>
                <DialogDescription>
                  Please connect with one of the available wallet providers to
                  continue.
                </DialogDescription>
              </DialogHeader>

              {/* <Button variant="subtle">Browser Wallet </Button> */}
              {/* <Button variant="subtle">WalletConnect</Button> */}
              <ConnectWallet accentColor="#f97316" colorMode="dark" />
            </DialogContent>
          </Dialog>
        </div>

        <NavMenu />

        <div className="hidden items-center gap-4 lg:flex">
          <Dialog>
            <DialogTrigger asChild>
              {address ? (
                <Button variant="default">
                  {address.substring(0, 5)}...{address.substring(38, 42)}
                </Button>
              ) : (
                <Button variant="default">Connect Wallet</Button>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Connect your wallet.</DialogTitle>
                <DialogDescription>
                  Please connect with one of the available wallet providers to
                  continue.
                </DialogDescription>
              </DialogHeader>

              {/* <Button variant="subtle">Browser Wallet </Button> */}
              {/* <Button variant="subtle">WalletConnect</Button> */}
              <ConnectWallet accentColor="#f97316" colorMode="dark" />
            </DialogContent>
          </Dialog>

          <Button
            variant="subtle"
            onClick={(e) => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          </Button>
        </div>
      </div>

      <div className="border-t border-b border-black dark:border-white  lg:hidden">
        <nav className="flex items-center justify-center overflow-x-auto p-4 text-sm font-medium space-x-8 z-10">
          <Link
            href="/"
            className="font-bold group transition-all duration-300 ease-in-out"
          >
            <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
              Home
            </span>
          </Link>
          <Link
            href="/radio"
            className="font-bold group transition-all duration-300 ease-in-out"
          >
            <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
              Radio
            </span>
          </Link>
          <Link
            href="/upload"
            className="font-bold group transition-all duration-300 ease-in-out"
          >
            <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
              Upload
            </span>
          </Link>
          <Link
            href="/profile"
            className="font-bold group transition-all duration-300 ease-in-out"
          >
            <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
              Profile
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
