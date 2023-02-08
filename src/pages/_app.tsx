import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Poppins } from '@next/font/google';
import { Toaster } from 'react-hot-toast';
import { ChainId } from '@thirdweb-dev/react';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import axios from 'axios';
import Web3 from 'web3';
import Radio from '../../backend/build/contracts/Radio.json';
import NFT from '../../backend/build/contracts/NFT.json';
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
  const [nfts, setNfts] = React.useState([]);
  const [songsLoaded, setSongsLoaded] = React.useState(false);

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
  React.useEffect(() => {
    loadSongs();
  }, []);

  async function loadSongs() {
    console.log('Loading songs...');
    // @ts-ignore
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      // @ts-ignore
      Radio.abi,
      // @ts-ignore
      Radio.networks[networkId].address
    );
    const listings = await radioContract.methods.getListedNfts().call();
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i: any) => {
        try {
          const NFTContract = new web3.eth.Contract(
            // @ts-ignore
            NFT.abi,
            // @ts-ignore
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

    // setTopThreeNfts(topThreeNfts);
    // @ts-ignore
    setNfts(sortedNfts);
    // @ts-ignore
    setSongsLoaded(true);
  }

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
              <CommandGroup heading="Navigation Suggestions">
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
              <CommandGroup heading="Search For Songs & Artists">
                {nfts.length ? (
                  nfts.map((nft, index) => (
                    <CommandItem key={index}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>
                        {/* @ts-ignore */}
                        {nft.name}
                      </span>
                      <CommandShortcut>
                        {/* @ts-ignore */}
                        {nft.genre}
                      </CommandShortcut>
                    </CommandItem>
                  ))
                ) : (
                  <h1>No songs found</h1>
                )}
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
