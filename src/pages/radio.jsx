import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  useNetworkMismatch,
  useAddress,
  ConnectWallet,
  useNetwork,
} from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk';

import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';

import Web3 from 'web3';
import Radio from '../../backend/build/contracts/Radio.json';
import NFT from '../../backend/build/contracts/NFT.json';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Radio as RadioIcon,
  Wifi,
  Github,
  Twitter,
  Upload,
  Moon,
  User,
  Search,
  Sun,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import Marquee from 'react-fast-marquee';

const transition = { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] };
const CHAIN_ID = ChainId.Mumbai;

const RadioPage = () => {
  const { theme, setTheme } = useTheme();
  const [nfts, setNfts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [heatCount, setHeatCount] = useState(0);
  const [topThreeNfts, setTopThreeNfts] = useState([]);
  const [direction, setDirection] = useState('right');
  const [isOpen, setIsOpen] = useState(false);
  const [ascending, setAscending] = useState(false);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState('bottom');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [open, setOpen] = useState(false);
  const audioRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const address = useAddress();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    setShouldPlay(true);
  }, [currentIndex]);

  useLayoutEffect(() => {
    if (audioRef.current && shouldPlay) {
      audioRef.current.play();
      setIsPlaying(true);
      setShouldPlay(false);
      console.log('Duration:', audioRef.current.duration);
      setDuration(audioRef.current.duration);
    }
  }, [shouldPlay]);

  async function loadSongs() {
    console.log('Loading songs...');
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      Radio.abi,
      Radio.networks[networkId].address
    );
    const listings = await radioContract.methods.getListedNfts().call();
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
          const NFTContract = new web3.eth.Contract(
            NFT.abi,
            NFT.networks[networkId].address
          );
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          const nft = {
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            image: meta.data.image,
            name: meta.data.name,
            coverImage: meta.data.coverImage,
            heatCount: i.heatCount,
            genre: meta.data.genre,
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    // setNfts(nfts.filter((nft) => nft !== null));

    // set nfts in order of heatCount
    const sortedNfts = nfts
      .filter((nft) => nft !== null)
      .sort((a, b) => b.heatCount - a.heatCount);
    const topThreeNfts = sortedNfts.slice(0, 3);

    setTopThreeNfts(topThreeNfts);
    setNfts(sortedNfts);

    setSongsLoaded(true);
  }

  async function loadSongsAscending() {
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      Radio.abi,
      Radio.networks[networkId].address
    );
    const listings = await radioContract.methods.getListedNfts().call();
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
          const NFTContract = new web3.eth.Contract(
            NFT.abi,
            NFT.networks[networkId].address
          );
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          const nft = {
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            image: meta.data.image,
            name: meta.data.name,
            coverImage: meta.data.coverImage,
            heatCount: i.heatCount,
            genre: meta.data.genre,
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );

    // set nfts in order of ascending heatCount
    const sortedNfts = nfts
      .filter((nft) => nft !== null)
      .sort((a, b) => a.heatCount - b.heatCount);
    const topThreeNfts = sortedNfts.slice(0, 3);

    // setTopThreeNfts(topThreeNfts);
    setNfts(sortedNfts);
  }

  async function loadSongsByGenre(genre) {
    if (genre === '' || genre === 'All') {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );
      const listings = await radioContract.methods.getListedNfts().call();
      // Iterate over the listed NFTs and retrieve their metadata
      const nfts = await Promise.all(
        listings.map(async (i) => {
          try {
            const NFTContract = new web3.eth.Contract(
              NFT.abi,
              NFT.networks[networkId].address
            );
            const tokenURI = await NFTContract.methods
              .tokenURI(i.tokenId)
              .call();
            const meta = await axios.get(tokenURI);
            const nft = {
              tokenId: i.tokenId,
              seller: i.seller,
              owner: i.buyer,
              image: meta.data.image,
              name: meta.data.name,
              coverImage: meta.data.coverImage,
              heatCount: i.heatCount,
              genre: meta.data.genre,
            };
            return nft;
          } catch (err) {
            console.log(err);
            return null;
          }
        })
      );
      const sortedNfts = nfts
        .filter((nft) => nft !== null)
        .sort((a, b) => b.heatCount - a.heatCount);
      const topThreeNfts = sortedNfts.slice(0, 3);
      setTopThreeNfts(topThreeNfts);
      setNfts(sortedNfts);
    } else {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();

      // Get all listed NFTs
      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );
      const listings = await radioContract.methods.getListedNfts().call();
      // Iterate over the listed NFTs and retrieve their metadata
      const nfts = await Promise.all(
        listings.map(async (i) => {
          try {
            const NFTContract = new web3.eth.Contract(
              NFT.abi,
              NFT.networks[networkId].address
            );
            const tokenURI = await NFTContract.methods
              .tokenURI(i.tokenId)
              .call();
            const meta = await axios.get(tokenURI);
            if (meta.data.genre === genre) {
              const nft = {
                tokenId: i.tokenId,
                seller: i.seller,
                owner: i.buyer,
                image: meta.data.image,
                name: meta.data.name,
                coverImage: meta.data.coverImage,
                heatCount: i.heatCount,
                genre: meta.data.genre,
              };
              return nft;
            } else {
              return null;
            }
          } catch (err) {
            console.log(err);
            return null;
          }
        })
      );
      // setNfts(nfts.filter((nft) => nft !== null));

      // set nfts in order of heatCount
      const sortedNfts = nfts
        .filter((nft) => nft !== null)
        .sort((a, b) => b.heatCount - a.heatCount);
      const topThreeNfts = sortedNfts.slice(0, 3);

      setTopThreeNfts(topThreeNfts);
      setNfts(sortedNfts);
    }
  }

  async function handleGiveHeat() {
    const notification = toast.loading(
      'Confirm the transaction to give heat! 🔥🔥🔥',
      {
        style: {
          border: '1px solid #fff',
          backgroundColor: '#2a2a2a',
          fontWeight: 'bold',
          color: '#fff',
        },
      }
    );
    // Get an instance of the Radio contract
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );

      // Give heat to the current NFT
      setLoading(true);
      radioContract.methods
        .giveHeat(nfts[currentIndex].tokenId, heatCount)
        .send({
          from: window.ethereum.selectedAddress,
          value: web3.utils.toWei(heatCount.toString(), 'ether'),
        })
        .on('receipt', function () {
          console.log('listed');
          document.getElementById(
            'heatcounttext'
          ).innerHTML = `YOU GAVE ${heatCount} HEAT!`;
          document
            .getElementById('heatcountdiv')
            .classList.add('animate-pulse');
          document.getElementById('heatanimation').classList.remove('hidden');

          toast.success('Heat given successfully! 🔥🔥🔥', {
            style: {
              border: '1px solid #fff',
              backgroundColor: '#2a2a2a',
              fontWeight: 'bold',
              color: '#fff',
            },
            id: notification,
          });
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
      toast.error('Heat could not be given! ❌❌❌', {
        style: {
          border: '1px solid #fff',
          backgroundColor: '#2a2a2a',
          fontWeight: 'bold',
          color: '#fff',
        },
        id: notification,
      });
    }
  }

  async function handleSwap() {
    setAscending(!ascending);
    if (ascending) {
      await loadSongs();
      toast.success('Songs sorted descending! 🔽🔥');
    } else {
      await loadSongsAscending();
      toast.success('Songs sorted ascending! 🔼🔥');
    }
  }

  function handleNext() {
    setDirection('right');
    setCurrentIndex((currentIndex + 1) % nfts.length);
  }

  function handlePrevious() {
    setDirection('left');
    setCurrentIndex(currentIndex === 0 ? nfts.length - 1 : currentIndex - 1);
  }

  if (!songsLoaded) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex justify-center items-center space-x-2">
          <div
            className="spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0 text-orange-500"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div
            className="
spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0
text-orange-500"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div
            className="
spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0
text-orange-500"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div
            className="spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0 text-orange-500"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div
            className="
spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0
text-orange-500"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div
            className="spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0 text-orange-500"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div
            className="spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0 text-orange-500"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div>
        <div className="drawer drawer-mobile">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* <!-- Page content here --> */}
            <div className="flex">
              <div className="w-full px-1">
                <div className="flex justify-end p-3 space-x-4 sticky top-0 z-50 bg-white dark:bg-black">
                  <Dialog>
                    <DialogTrigger asChild>
                      {address ? (
                        <Button variant="default">
                          {address.substring(0, 5)}...
                          {address.substring(38, 42)}
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
                            &nbsp; Wrong Network. Switch to Mumbai.&nbsp;{' '}
                            <Wifi />
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
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
                            <RadioIcon className="mr-2 h-4 w-4" />
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
                              <DropdownMenuItem
                                onClick={() => setTheme('light')}
                              >
                                <Sun className="mr-2 h-4 w-4" />
                                <span>Light</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setTheme('dark')}
                              >
                                <Moon className="mr-2 h-4 w-4" />
                                <span>Dark</span>
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Search className="mr-2 h-4 w-4" />
                        <span>Search</span>
                      </DropdownMenuItem>
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
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <h1 className="text-3xl text-center ml-4">
                        Heat Leaderboard 🔥
                      </h1>
                    </AccordionTrigger>
                    <AccordionContent>
                      {topThreeNfts.map((nft, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center px-6">
                            <div className="flex items-center space-y-2">
                              <h1 className="text-2xl">
                                {index === 0 ? (
                                  <h1 className="text-4xl">🥇&nbsp;</h1>
                                ) : index === 1 ? (
                                  <h1 className="text-4xl">🥈&nbsp;</h1>
                                ) : index === 2 ? (
                                  <h1 className="text-4xl">🥉&nbsp;</h1>
                                ) : (
                                  <h1>{index + 1}</h1>
                                )}
                              </h1>
                              <Image
                                src={nft.coverImage}
                                width={50}
                                height={50}
                                alt="cover"
                                className="rounded-none"
                              />
                              <p className="ml-2 text-2xl truncate">
                                {nft.name}
                              </p>
                            </div>
                            <p className="text-2xl">{nft.heatCount}</p>
                          </div>
                          <Separator className="mt-2" />
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <div className="">
              {songsLoaded ? (
                <div>
                  <div
                    key={currentIndex}
                    className="card rounded-none border-b border-[#2a2a2a] w-full "
                  >
                    <figure>
                      <motion.div
                        key={nfts[currentIndex].tokenId}
                        initial={
                          direction === 'right' ? { x: -100 } : { x: 100 }
                        }
                        animate={{ x: 0 }}
                        exit={direction === 'right' ? { x: 100 } : { x: -100 }}
                        transition={transition}
                      >
                        <Image
                          src={nfts[currentIndex].coverImage}
                          width={300}
                          height={300}
                          alt="cover"
                          className="rounded-none min-w-[300px] min-h-[300px] max-w-[300px] max-h-[300px]"
                          priority
                        />
                      </motion.div>
                    </figure>
                    <div className="text-orange-500 text-xl p-2 font-bold bg-[#DADDE2] dark:bg-[#2a2a2a] border-none text-center cursor-default">
                      <span>🔥</span> Heat Count: {nfts[currentIndex].heatCount}{' '}
                      <span>🔥</span>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between">
                        <Button
                          onClick={async () => {
                            await loadSongsByGenre(nfts[currentIndex].genre);
                            // reset the index
                            setCurrentIndex(0);
                            toast.success(
                              `Sorted by ${nfts[currentIndex].genre}`
                            );
                          }}
                          variant="outline"
                          size="lg"
                        >
                          {nfts[currentIndex].genre}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="lg" variant="outline">
                              More Info
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                More Information
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                <p className="py-4">
                                  {nfts[currentIndex] &&
                                    nfts[currentIndex].name}{' '}
                                  | Heat 🔥:{' '}
                                  {nfts[currentIndex] &&
                                    nfts[currentIndex].heatCount}
                                </p>
                                <a
                                  className="link link-hover text-xs "
                                  rel="noreferrer"
                                  target="_blank"
                                  // href to etherscan with the seller address
                                  href={`https://etherscan.io/address/${
                                    nfts[currentIndex] &&
                                    nfts[currentIndex].seller
                                  }`}
                                >
                                  Original Author:{' '}
                                  {nfts[currentIndex] &&
                                    nfts[currentIndex].seller.substring(0, 5) +
                                      '...' +
                                      nfts[currentIndex].seller.substring(
                                        38,
                                        42
                                      )}
                                </a>
                                <br />
                                <a
                                  className="link link-hover text-xs "
                                  rel="noreferrer"
                                  target="_blank"
                                  href={
                                    nfts[currentIndex] &&
                                    nfts[currentIndex].coverImage.toString()
                                  }
                                >
                                  Cover Image: IPFS (click to view)
                                </a>
                                <br />
                                <a
                                  className="link link-hover text-xs "
                                  rel="noreferrer"
                                  target="_blank"
                                  href={
                                    nfts[currentIndex] &&
                                    nfts[currentIndex].image.toString()
                                  }
                                >
                                  Audio Source: IPFS (click to view)
                                </a>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogAction>Close</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <h2 className="card-title text-center justify-center text-2xl truncate">
                        {nfts.length > 0 &&
                          nfts[currentIndex].name.substring(0, 24)}
                      </h2>

                      <div className="flex justify-center text-center items-center">
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="link">
                              {nfts.length > 0 &&
                                nfts[currentIndex].seller.slice(0, 6)}
                              ...
                              {nfts.length > 0 &&
                                nfts[currentIndex].seller.slice(38, 42)}
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="flex justify-between space-x-4">
                              <Avatar>
                                <AvatarImage
                                  // src="https://api.dicebear.com/5.x/identicon/svg?seed=Felix"
                                  src={`https://api.dicebear.com/5.x/lorelei/svg?seed=/${nfts[currentIndex].seller}.svg?`}
                                />
                              </Avatar>
                              <div className="space-y-1">
                                <Link
                                  href="/[slug]"
                                  as={`/${nfts[currentIndex].seller}`}
                                  className="text-center link link-hover"
                                >
                                  {nfts.length > 0 &&
                                    nfts[currentIndex].seller.slice(0, 6)}
                                  ...
                                  {nfts.length > 0 &&
                                    nfts[currentIndex].seller.slice(38, 42)}
                                </Link>
                                <p className="text-sm">
                                  Bios are coming soon. For now, please imagine
                                  something cool here.
                                </p>
                                <div className="flex items-center pt-2">
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Joined February 2023
                                  </span>
                                </div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>

                      <div className="flex justify-between items-center text-center space-x-4">
                        <h1>0:00</h1>
                        <Progress value={progress} />
                        <div>
                          {Math.floor(duration / 60)}:
                          {Math.floor(duration % 60) < 10
                            ? `0${Math.floor(duration % 60)}`
                            : Math.floor(duration % 60)}
                        </div>
                      </div>

                      <div className="flex justify-between space-x-4 mt-4">
                        <Button
                          onClick={handlePrevious}
                          disabled={currentIndex === 0}
                          variant="subtle"
                          size="lg"
                        >
                          <SkipBack />
                        </Button>

                        <audio
                          src={nfts[currentIndex].image}
                          ref={audioRef}
                          onEnded={() => {
                            if (currentIndex < nfts.length - 1) {
                              setCurrentIndex(currentIndex + 1);
                            }
                          }}
                          onPlay={() => {
                            console.log(audioRef.current.duration);
                            setDuration(audioRef.current.duration);
                            // calculate the progress every second considering the duration
                            const interval = setInterval(() => {
                              setProgress(
                                (audioRef.current.currentTime / duration) * 100
                              );
                            }, 1000);
                            return () => clearInterval(interval);
                          }}
                          className="h-12 w-full hidden"
                          controls
                          // autoplay after the first song
                          autoPlay={currentIndex !== 0}
                        />

                        <Button
                          onClick={() => {
                            if (isPlaying) {
                              audioRef.current.pause();
                              setIsPlaying(false);
                            } else {
                              audioRef.current.play();
                              audioRef.current.pause();
                              audioRef.current.play();
                              setIsPlaying(true);
                            }
                          }}
                          variant="subtle"
                          size="lg"
                        >
                          {isPlaying ? <Pause /> : <Play />}
                        </Button>

                        <Button
                          onClick={handleNext}
                          disabled={currentIndex === nfts.length - 1}
                          variant="subtle"
                          size="lg"
                        >
                          <SkipForward />
                        </Button>
                      </div>
                      <div className="card-actions justify-between mt-4">
                        <Button
                          size="lg"
                          variant="outline"
                          className="lg:invisible"
                        >
                          <label
                            htmlFor="my-drawer-2"
                            className="flex rounded-md  text-black dark:text-white"
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
                                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                              />
                            </svg>
                            &nbsp; queue
                          </label>
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="lg" variant="destructive">
                              Give Heat 🔥{' '}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Give Heat 🔥</DialogTitle>

                              <Accordion
                                type="single"
                                collapsible
                                className="full"
                              >
                                <AccordionItem value="item-1">
                                  <AccordionTrigger className="text-2xl">
                                    What is Heat?
                                  </AccordionTrigger>
                                  <AccordionContent className="text-xl">
                                    Heat 🔥 is a way to show your appreciation
                                    for a song. The more heat a song has, the
                                    more it will be promoted and pushed to the
                                    top of the queue. <br /> <br />
                                    <p className="text-center text-xl mt-4">
                                      <span className="font-bold">
                                        1 Heat = 1 MATIC.
                                      </span>
                                      <br />
                                      You can give as much heat as you want.
                                      <br />
                                      Please refresh the page after giving heat
                                      to see the updated amount.
                                      <br />
                                      <br /> As of now it is a contract
                                      interaction, but very soon all Heat values
                                      will be sent to the uploader. EST Feb
                                      2023.
                                    </p>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </DialogHeader>

                            <div className="flex justify-center text-center ">
                              <div className="form-control mt-4  rounded-xl">
                                {nfts[currentIndex] && (
                                  <div
                                    id="heatcountdiv"
                                    className="bg-[#DADDE2] dark:bg-[#1f1f1f] border border-[#2a2a2a] mt-4 p-4 max-w-xl rounded-md"
                                  >
                                    <h1
                                      id="heatcounttext"
                                      className="text-center text-xl "
                                    >
                                      You are giving {heatCount} Heat 🔥 to{' '}
                                      {nfts[currentIndex].name}
                                    </h1>
                                    <div
                                      id="heatanimation"
                                      className="hidden  text-center justify-center items-center"
                                    >
                                      <span className="fire-emoji">🔥</span>
                                      <span className="fire-emoji">🔥</span>
                                      <span className="fire-emoji">🔥</span>
                                      <span className="fire-emoji">🔥</span>
                                      <span className="fire-emoji">🔥</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex w-full items-center space-x-2 mt-12">
                              <Input
                                onChange={(event) =>
                                  setHeatCount(event.target.value)
                                }
                                type="number"
                                min="0"
                                //
                                // do not allow negative values

                                placeholder="Enter Heat count"
                              />

                              {loading ? (
                                <Button disabled>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Confirm Transaction!
                                </Button>
                              ) : (
                                <Button
                                  onClick={handleGiveHeat}
                                  disabled={heatCount === 0}
                                  type="submit"
                                  className=" w-1/3"
                                  variant="destructive"
                                >
                                  Give Heat!
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                  <Marquee
                    className="overflow-y-hidden lg:mt-12 bg-[#DADDE2] dark:bg-[#2a2a2a]"
                    gradient={false}
                  >
                    <div className="">
                      <h1>
                        <span>🔥{nfts[currentIndex].name}</span> by{' '}
                        <Link
                          className="font-bold hover:underline"
                          href={nfts[currentIndex].seller}
                        >
                          {nfts[currentIndex].seller.substring(0, 6)}...
                          {nfts[currentIndex].seller.substring(38, 42)}🔥
                        </Link>
                      </h1>
                    </div>
                  </Marquee>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-4xl">
                    No songs found. This can mean the following:
                  </p>
                  <p className="text-2xl mt-4">
                    1. There are no songs on Etherwav yet.
                  </p>
                  <p className="text-2xl mt-4">
                    2. You are not connected to the correct network (Polygon).
                  </p>
                  <p className="text-2xl mt-4">
                    3. Your wallet is not connected.
                  </p>
                  <p className="text-2xl mt-4">
                    4. There are no songs uploaded for this genre
                  </p>
                  <p className="text-2xl mt-4 bg-[#2a2a2a]">
                    Please try again in a couple seconds. If the issue persists,
                    please message me on Twitter @abdo_eth
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <ul className="menu p-2 w-80 bg-white dark:bg-black text-base-content border-r border-[#2a2a2a] ">
              {/* <!-- Sidebar content here --> */}
              <Link
                href="/"
                className="text-2xl font-bold group transition-all duration-300 ease-in-out p-3"
              >
                <span className="bg-left-bottom bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  Etherwav
                </span>
              </Link>
              <div className="flex justify-between border-b border-black dark:border-[#303030] p-2.5 sticky top-0 bg-white dark:bg-black z-50 ">
                <Select
                  onValueChange={(value) =>
                    loadSongsByGenre(value).then(() => {
                      toast.success(`Loaded ${value} songs!`);
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="lofi">Lofi</SelectItem>
                    <SelectItem value="hiphop">Hiphop</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="subtle">Sort By</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Sort by...</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={position}
                      onValueChange={setPosition}
                    >
                      <DropdownMenuRadioItem
                        onClick={() => {
                          handleSwap();
                          // set index to 1
                          setCurrentIndex(0);
                        }}
                        value="top"
                      >
                        Ascending
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        onClick={() => {
                          handleSwap();
                          // set index to 1
                          setCurrentIndex(0);
                        }}
                        value="bottom"
                      >
                        Descending
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h1 className="text-2xl font-bold mt-4">Queue</h1>

              {nfts.length ? (
                nfts.map((nft, index) => (
                  <li
                    key={index}
                    className={`justify-between border-b border-[#DADDE2] dark:border-[#303030] card3 ${
                      index === currentIndex
                        ? 'bg-[#DADDE2] dark:bg-[#555555]'
                        : ''
                    }`}
                    onClick={() => {
                      setCurrentIndex(index);
                    }}
                  >
                    <div className="justify-between">
                      <h1>
                        {nft.heatCount} | &nbsp;
                        <span className="text-lg font-semibold">
                          {/* if nft.name is longer than 10 characters, replace it with ... */}
                          {nft.name.length > 16
                            ? nft.name.substring(0, 16) + '...'
                            : nft.name}
                        </span>{' '}
                        <br /> {nft.seller.slice(0, 6)}...
                        {nft.seller.slice(-4)}
                      </h1>

                      <Image
                        src={nft.coverImage}
                        height={50}
                        width={50}
                        alt="nft"
                        className="w-12 h-12 border border-white rounded"
                        priority
                      />
                    </div>
                  </li>
                ))
              ) : (
                <h1>It looks like there are no songs!</h1>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPage;
