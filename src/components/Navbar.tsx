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
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  Plus,
  PlusCircle,
  Radio,
  Settings,
  Sun,
  Twitter,
  Upload,
  User,
  UserPlus,
  Users,
  Wifi,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useNetworkMismatch,
  useAddress,
  ConnectWallet,
  useNetwork,
} from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk';

const CHAIN_ID = ChainId.Mumbai;

const Navbar = () => {
  const address = useAddress();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    // <header
    //   aria-label="Site Header"
    //   className="shadow-sm sticky top-0 z-50 bg-white dark:bg-black border-b  dark:border-[#303030]"
    // >
    //   <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
    //     <div className="flex w-0 flex-1 lg:hidden">
    //       <Button
    //         variant="subtle"
    //         onClick={(e) => setTheme(theme === 'dark' ? 'light' : 'dark')}
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //           strokeWidth={1.5}
    //           stroke="currentColor"
    //           className="w-4 h-4"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
    //           />
    //         </svg>
    //       </Button>
    //     </div>

    //     <div className="flex items-center">
    //       <a href="#">
    //         <span className="sr-only">Logo</span>
    //         <span className="h-10 w-20 rounded-lg bg-gray-200"></span>
    //       </a>

    //       <Link
    //         href="/"
    //         className="text-2xl font-bold group transition-all duration-300 ease-in-out hidden lg:block"
    //       >
    //         <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
    //           Etherwav
    //         </span>
    //       </Link>
    //       <a
    //         className="group text-pink-500 transition-all duration-300 ease-in-out"
    //         href="#"
    //       ></a>
    //     </div>

    //     {/* reponsive */}
    //     <div className="flex w-0 flex-1 justify-end lg:hidden">
    //       <Dialog>
    //         <DialogTrigger asChild>
    //           {address ? (
    //             <Button variant="default">
    //               {address.substring(0, 5)}...{address.substring(38, 42)}
    //             </Button>
    //           ) : (
    //             <Button variant="default">Connect Wallet</Button>
    //           )}
    //         </DialogTrigger>
    //         <DialogContent className="sm:max-w-[425px]">
    //           <DialogHeader>
    //             <DialogTitle>Connect your wallet.</DialogTitle>
    //             <DialogDescription>
    //               Please connect with one of the available wallet providers to
    //               continue.
    //             </DialogDescription>
    //           </DialogHeader>

    //           {/* <Button variant="subtle">Browser Wallet </Button> */}
    //           {/* <Button variant="subtle">WalletConnect</Button> */}
    //           <ConnectWallet accentColor="#f97316" colorMode="dark" />

    //           {isOnWrongNetwork && (
    //             <div className="mt-4">
    //               <Button
    //                 variant="default"
    //                 onClick={() => switchNetwork?.(CHAIN_ID)}
    //                 className="w-full"
    //               >
    //                 <Wifi />
    //                 &nbsp; Wrong Network. Switch to Mumbai.&nbsp; <Wifi />
    //               </Button>
    //             </div>
    //           )}
    //         </DialogContent>
    //       </Dialog>
    //     </div>

    //     <NavMenu />

    //     <div className="hidden items-center gap-4 lg:flex">
    //       <Dialog>
    //         <DialogTrigger asChild>
    //           {address ? (
    //             <Button variant="default">
    //               {address.substring(0, 5)}...{address.substring(38, 42)}
    //             </Button>
    //           ) : (
    //             <Button variant="default">Connect Wallet</Button>
    //           )}
    //         </DialogTrigger>
    //         <DialogContent className="sm:max-w-[425px]">
    //           <DialogHeader>
    //             <DialogTitle>Connect your wallet.</DialogTitle>
    //             <DialogDescription>
    //               Please connect with one of the available wallet providers to
    //               continue.
    //             </DialogDescription>
    //           </DialogHeader>

    //           {/* <Button variant="subtle">Browser Wallet </Button> */}
    //           {/* <Button variant="subtle">WalletConnect</Button> */}
    //           <ConnectWallet accentColor="#f97316" colorMode="dark" />
    //         </DialogContent>
    //       </Dialog>

    //       <Button
    //         variant="subtle"
    //         onClick={(e) => setTheme(theme === 'dark' ? 'light' : 'dark')}
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //           strokeWidth={1.5}
    //           stroke="currentColor"
    //           className="w-4 h-4"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
    //           />
    //         </svg>
    //       </Button>
    //     </div>
    //   </div>

    //   <div className="border-t border-b border-black dark:border-white  lg:hidden">
    //     <nav className="flex items-center justify-center overflow-x-auto p-4 text-sm font-medium space-x-8 z-10">
    //       <Link
    //         href="/"
    //         className="font-bold group transition-all duration-300 ease-in-out"
    //       >
    //         <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
    //           Home
    //         </span>
    //       </Link>
    //       <Link
    //         href="/radio"
    //         className="font-bold group transition-all duration-300 ease-in-out"
    //       >
    //         <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
    //           Radio
    //         </span>
    //       </Link>
    //       <Link
    //         href="/upload"
    //         className="font-bold group transition-all duration-300 ease-in-out"
    //       >
    //         <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
    //           Upload
    //         </span>
    //       </Link>
    //       <Link
    //         href="/profile"
    //         className="font-bold group transition-all duration-300 ease-in-out"
    //       >
    //         <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
    //           Profile
    //         </span>
    //       </Link>
    //     </nav>
    //   </div>
    // </header>
    <header
      aria-label="Site Header"
      className="bg-white dark:bg-black sticky top-0 z-50 border-b border-black dark:border-[#1f1f1f]"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <Link
              href="/"
              className="text-2xl font-bold group transition-all duration-300 ease-in-out"
            >
              <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                Etherwav
              </span>
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Site Nav" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link
                    className="text-black dark:text-white transition hover:text-black/75 dark:hover:text-white/75"
                    href="/"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-black dark:text-white transition hover:text-black/75 dark:hover:text-white/75"
                    href="/radio"
                  >
                    Radio
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-black dark:text-white transition hover:text-black/75 dark:hover:text-white/75"
                    href="/upload"
                  >
                    Upload
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-black dark:text-white transition hover:text-black/75 dark:hover:text-white/75"
                    href="/profile"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
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
                      <DialogTitle>
                        Connect your wallet. Polygon Mainnet only for now.
                      </DialogTitle>
                      <DialogDescription>
                        Please connect with one of the available wallet
                        providers to continue.
                      </DialogDescription>
                      <ConnectWallet accentColor="#f97316" colorMode="dark" />
                    </DialogHeader>

                    {/* <Button variant="subtle">Browser Wallet </Button> */}
                    {/* <Button variant="subtle">WalletConnect</Button> */}
                    {isOnWrongNetwork && (
                      <div className="mt-4">
                        <Button
                          variant="default"
                          onClick={() => switchNetwork?.(CHAIN_ID)}
                          className="w-full"
                        >
                          <Wifi />
                          &nbsp; Wrong Network. Switch to Mumbai.&nbsp; <Wifi />
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <div className="hidden sm:flex">
                  <Button
                    variant="subtle"
                    onClick={(e) =>
                      setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
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

              <div className="block md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Etherwav</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link href="/profile">
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/radio">
                        <DropdownMenuItem>
                          <Radio className="mr-2 h-4 w-4" />
                          <span>Radio</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/upload">
                        <DropdownMenuItem>
                          <Upload className="mr-2 h-4 w-4" />
                          <span>Upload</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Sun className="mr-2 h-4 w-4" />
                          <span>Theme</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme('light')}>
                              <Sun className="mr-2 h-4 w-4" />
                              <span>Light</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>
                              <Moon className="mr-2 h-4 w-4" />
                              <span>Dark</span>
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        window.open('https://www.github.com/chrisabdo')
                      }
                    >
                      <Github className="mr-2 h-4 w-4" />
                      <span>GitHub</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        window.open('https://www.twitter.com/abdo_eth')
                      }
                    >
                      <Twitter className="mr-2 h-4 w-4" />
                      <span>Twitter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
