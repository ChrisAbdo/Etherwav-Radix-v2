import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import toast from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReactAudioPlayer from 'react-audio-player';

import Web3 from 'web3';
import Radio from '../../backend/build/contracts/Radio.json';
import NFT from '../../backend/build/contracts/NFT.json';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Button } from '@/components/ui/button';
export default function ProjectShowcase() {
  const router = useRouter();
  const { slug } = router.query;

  const [account, setAccount] = useState('');
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [ascending, setAscending] = useState(false);
  const [position, setPosition] = useState('bottom');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadNFTs();
  }, [account]);

  async function loadNFTs() {
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

          console.log(nft);
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
    // @ts-ignore
    setNfts(sortedNfts);
    setLoadingState('loaded');
  }

  async function loadSongsByGenre(genre: any) {
    if (genre === '' || genre === 'All') {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
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
      // @ts-ignore
      setNfts(sortedNfts);
    } else {
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
      // @ts-ignore
      setNfts(sortedNfts);
    }
  }

  async function loadSongsAscending() {
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

    // set nfts in order of ascending heatCount
    const sortedNfts = nfts
      .filter((nft) => nft !== null)
      .sort((a, b) => a.heatCount - b.heatCount);
    // @ts-ignore
    setNfts(sortedNfts);
  }

  async function handleSwap() {
    setAscending(!ascending);
    if (ascending) {
      await loadNFTs();
      toast.success('Songs sorted descending! ????????');
    } else {
      await loadSongsAscending();
      toast.success('Songs sorted ascending! ????????');
    }
  }

  return (
    <div>
      <div className="navbar bg-slate-50 dark:bg-black sticky top-16 z-40 border-b border-[#2a2a2a]">
        <div className="flex-1">
          <h1 className="normal-case text-xl">Filters</h1>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 space-x-1">
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

            {/* <label className="swap swap-rotate rounded-md card3 border border-[#2a2a2a] p-2">
              <input
                type="checkbox"
                onClick={() => {
                  handleSwap();
                }}
                className="hidden"
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="swap-on w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="swap-off w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
                />
              </svg>
            </label> */}
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
          </ul>
        </div>
      </div>
      <h1 className="text-center text-3xl p-4 truncate">Songs by {slug}</h1>
      {nfts.map((nft, index) => {
        // @ts-ignore
        if (nft.seller === slug) {
          return (
            // @ts-ignore
            <div className="p-6" key={nft.tokenId}>
              <motion.div
                // @ts-ignore
                key={nft.tokenId}
                initial={{ y: -200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="card card3 card-side border border-[#2a2a2a] rounded-md shadow-xl">
                  <figure>
                    <Image
                      // @ts-ignore
                      src={nft.coverImage}
                      // @ts-ignore
                      alt={nft.name}
                      width={250}
                      height={250}
                      className="h-full bg-black"
                      priority
                    />
                  </figure>
                  <div className="card-body">
                    <div className="space-y-6">
                      <h2 className="card-title text-2xl">
                        {/* @ts-ignore */}
                        {nft.name} | Heat: {nft.heatCount}????
                      </h2>
                      <motion.span
                        className="badge card1 rounded-md p-4"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* @ts-ignore */}
                        {nft.genre}
                      </motion.span>
                      <ReactAudioPlayer
                        // @ts-ignore
                        src={nft.image}
                        controls
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        }
      })}
    </div>
  );
}
