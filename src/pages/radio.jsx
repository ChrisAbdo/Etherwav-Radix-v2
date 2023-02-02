import { useEffect, useState, useLayoutEffect, useRef, Fragment } from 'react';
import { motion } from 'framer-motion';
import Balancer from 'react-wrap-balancer';

import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const transition = { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] };

const RadioPage = () => {
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

  const audioRef = useRef(null);

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    setShouldPlay(true);
  }, [currentIndex]);

  // useLayoutEffect(() => {
  //   if (audioRef.current && shouldPlay) {
  //     audioRef.current.play();
  //     setIsPlaying(true);
  //     setShouldPlay(false);
  //   }
  // }, [shouldPlay]);

  async function loadSongs() {
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
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-4xl">No songs found. This can mean the following:</p>
        <p className="text-2xl mt-4">1. There are no songs on Etherwav yet.</p>
        <p className="text-2xl mt-4">
          2. You are not connected to the correct network (Polygon).
        </p>
        <p className="text-2xl mt-4">3. Your wallet is not connected.</p>
        <p className="text-2xl mt-4">
          4. There are no songs uploaded for this genre
        </p>
        <p className="text-2xl mt-4 bg-[#2a2a2a]">
          Please try again in a couple seconds. If the issue persists, please
          message me on Twitter @abdo_eth
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="drawer drawer-mobile">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            {/* <!-- Page content here --> */}
            <div className="flex justify-between ">
              <div className="w-full">
                <label
                  htmlFor="my-drawer-2"
                  className="btn btn-outline rounded-md border border-[#DADDE2] dark:border-[#303030]  text-black dark:text-white lg:hidden "
                >
                  queue
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                    />
                  </svg>
                </label>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <h1 className="text-3xl text-center ml-4">
                        Heat Leaderboard 🔥
                      </h1>
                    </AccordionTrigger>
                    <AccordionContent>
                      {topThreeNfts.map((nft, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center px-6"
                        >
                          <div className="flex items-center">
                            <Image
                              src={nft.coverImage}
                              width={50}
                              height={50}
                              alt="cover"
                              className="rounded-none"
                            />
                            <p className="ml-2 text-2xl">{nft.name}</p>
                          </div>
                          <p className="text-2xl">{nft.heatCount} 🔥</p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <div className="hero ">
              {songsLoaded ? (
                <div
                  key={currentIndex}
                  className="card rounded-none border-b border-[#2a2a2a] w-full "
                >
                  <figure>
                    <motion.div
                      key={nfts[currentIndex].tokenId}
                      initial={direction === 'right' ? { x: -100 } : { x: 100 }}
                      animate={{ x: 0 }}
                      exit={direction === 'right' ? { x: 100 } : { x: -100 }}
                      transition={transition}
                    >
                      <Image
                        src={nfts[currentIndex].coverImage}
                        width={400}
                        height={400}
                        alt="cover"
                        className="rounded-none min-w-[390px] min-h-[390px] max-w-[390px] max-h-[390px]"
                        priority
                      />
                    </motion.div>
                  </figure>
                  <div className="text-orange-500 text-xl p-2 font-bold bg-[#DADDE2] dark:bg-[#2a2a2a] border-none text-center cursor-default">
                    <span>🔥</span> Heat Count: {nfts[currentIndex].heatCount}{' '}
                    <span>🔥</span>
                  </div>
                  <div className="card-body">
                    <div className="flex justify-between">
                      <motion.span
                        className="badge card3 rounded cursor-pointer p-4 min-w-[90px]"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                        onClick={async () => {
                          await loadSongsByGenre(nfts[currentIndex].genre);
                          // reset the index
                          setCurrentIndex(0);
                          toast.success(
                            `Sorted by ${nfts[currentIndex].genre}`
                          );
                        }}
                      >
                        {nfts[currentIndex].genre}
                      </motion.span>

                      <motion.label
                        htmlFor="my-modal-69"
                        className="badge card3 rounded cursor-pointer p-4"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                      >
                        More Info
                      </motion.label>
                    </div>
                    <h2 className="card-title text-center justify-center text-2xl truncate">
                      {nfts.length > 0 &&
                        nfts[currentIndex].name.substring(0, 24)}
                    </h2>
                    <Link
                      href="/[slug]"
                      as={`/${nfts[currentIndex].seller}`}
                      className="text-center link link-hover"
                    >
                      {nfts.length > 0 && nfts[currentIndex].seller.slice(0, 6)}
                      ...
                      {nfts.length > 0 &&
                        nfts[currentIndex].seller.slice(38, 42)}
                    </Link>

                    <div className="flex justify-between space-x-4 mt-4">
                      <Button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        variant="subtle"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
                          />
                        </svg>
                      </Button>

                      <ReactAudioPlayer
                        src={nfts[currentIndex].image}
                        ref={audioRef}
                        onEnded={() => {
                          if (currentIndex < nfts.length - 1) {
                            setCurrentIndex(currentIndex + 1);
                          }
                        }}
                        className="h-12 w-full"
                        controls
                        autoPlay
                      />
                      <Button
                        onClick={handleNext}
                        disabled={currentIndex === nfts.length - 1}
                        variant="subtle"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
                          />
                        </svg>
                      </Button>
                    </div>
                    <div className="card-actions justify-between mt-4">
                      <label
                        htmlFor="my-modal-6"
                        className="btn btn-outline text-[#555555] normal-case rounded cursor-pointer"
                      >
                        Report
                      </label>

                      <label
                        htmlFor="my-modal-5"
                        className="rounded relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group cursor-pointer"
                      >
                        <span className="rounded w-full h-full bg-gradient-to-br from-yellow-600  to-red-600 group-hover:from-yellow-600  group-hover:to-red-600 absolute"></span>
                        <span className="rounded relative px-6 py-3 transition-all ease-out bg-white dark:bg-black  group-hover:bg-opacity-0 duration-400">
                          <span className="rounded relative text-black dark:text-white">
                            Give Heat 🔥
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
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

          <div className="drawer-side overflow-y-hidden">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <ul className="menu p-2 w-80 bg-white dark:bg-black text-base-content border-r border-[#2a2a2a] ">
              {/* <!-- Sidebar content here --> */}

              <div className="flex justify-between border-b border-orange-500 sticky top-0  z-50">
                {' '}
                <select
                  className=" mb-3 rounded-md select select-bordered bg-white dark:bg-black"
                  onChange={async (e) => {
                    await loadSongsByGenre(e.target.value);
                    toast.success(`Loaded ${e.target.value} songs!`);
                  }}
                >
                  <option disabled selected>
                    Sort by genre
                  </option>
                  <option value="">All</option>
                  <option value="lofi">Lofi</option>
                  <option value="hiphop">Hip Hop</option>
                  <option value="vocals">Vocals</option>
                  <option value="edm">EDM</option>
                </select>
                {/* SWAP */}
                <label className="swap swap-rotate mb-3 rounded-md card3 border dark:border-white border-black p-2">
                  <input
                    type="checkbox"
                    onClick={() => {
                      handleSwap();
                      // set index to 1
                      setCurrentIndex(0);
                    }}
                    className="hidden"
                  />

                  {/* <!-- sun icon --> */}
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

                  {/* <!-- moon icon --> */}
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
                </label>
              </div>

              <h1 className="text-2xl font-bold">Queue</h1>

              {nfts.length ? (
                nfts.map((nft, index) => (
                  <li
                    key={index}
                    className={`justify-between border-b border-orange-500 card3 ${
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
                        <span className="text-lg font-semibold">
                          {nft.name} | {nft.heatCount}
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

        {/* Report Modal */}
        <input type="checkbox" id="my-modal-6" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle bg-white dark:bg-black ">
          <div className="modal-box  rounded-md">
            <h3 className="font-bold text-lg">
              Sorry! This feature is not available yet.
            </h3>
            <p className="py-4">
              I am working on this feature. Please check back later. For now,
              Please message me on Twitter @abdo_eth
            </p>
            <div className="modal-action">
              <label htmlFor="my-modal-6" className="btn rounded-xl">
                close
              </label>
            </div>
          </div>
        </div>

        {/* Give Heat Modal */}
        <input type="checkbox" id="my-modal-5" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle bg-white dark:bg-black">
          <div className="modal-box ">
            <h2 className="text-xl mb-4 text-center">Give Heat 🔥</h2>
            {/* <div className="collapse collapse-arrow rounded-xl">
              <input type="checkbox" />

              <div className="collapse-title text-xl font-medium bg-[#2a2a2a] h-12">
                What is Heat?
              </div>

              <div className="collapse-content bg-[#1a1a1a]">
                <p className="p-4">
                  {' '}
                  Heat 🔥 is a way to show your appreciation for a song. The
                  more heat a song has, the more it will be promoted and pushed
                  to the top of the queue. <br />
                  As of now it is a contract interaction, but very soon all Heat
                  values will be sent to the uploader. EST Feb 2023.
                </p>
              </div>
            </div> */}
            <div>
              <Accordion type="single" collapsible className="full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-2xl">
                    What is Heat?
                  </AccordionTrigger>
                  <AccordionContent className="text-xl">
                    Heat 🔥 is a way to show your appreciation for a song. The
                    more heat a song has, the more it will be promoted and
                    pushed to the top of the queue. <br /> <br />
                    As of now it is a contract interaction, but very soon all
                    Heat values will be sent to the uploader. EST Feb 2023.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <p className="text-center text-xl mt-4">
              <span className="font-bold">1 Heat = 1 MATIC.</span>
              <br />
              You can give as much heat as you want.
              <br />
              Please refresh the page after giving heat to see the updated
              amount.
            </p>

            <div className="flex justify-center text-center ">
              <div className="form-control mt-4  rounded-xl">
                {/* <label className="input-group ">
                  <span>🔥</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Enter Heat Count"
                    className="input border border-white w-full rounded-md"
                    id="heatcountinput"
                    onChange={(event) => setHeatCount(event.target.value)}
                  />
                  <span>MATIC</span>
                </label> */}

                {nfts[currentIndex] && (
                  <div
                    id="heatcountdiv"
                    className="bg-[#1f1f1f] border border-[#2a2a2a] mt-4 p-4 max-w-xl rounded-xl"
                  >
                    <h1 id="heatcounttext" className="text-center text-xl ">
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
                onChange={(event) => setHeatCount(event.target.value)}
                type="number"
                min={0}
                placeholder="Enter Heat count"
                className="h-12"
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
                >
                  Give Heat!
                </Button>
              )}
            </div>

            <div className="modal-action">
              <label htmlFor="my-modal-5" className="btn rounded-md">
                cancel
              </label>
            </div>
          </div>
        </div>

        <input type="checkbox" id="my-modal-69" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle bg-white dark:bg-black">
          <div className="modal-box rounded-md ">
            <h3 className="font-bold text-lg">More Information</h3>
            <p className="py-4">
              {nfts[currentIndex] && nfts[currentIndex].name} | Heat 🔥:{' '}
              {nfts[currentIndex] && nfts[currentIndex].heatCount}
            </p>
            <a
              className="link link-hover text-xs "
              rel="noreferrer"
              target="_blank"
              // href to etherscan with the seller address
              href={`https://etherscan.io/address/${
                nfts[currentIndex] && nfts[currentIndex].seller
              }`}
            >
              Original Author: {nfts[currentIndex] && nfts[currentIndex].seller}
            </a>
            <br />
            <a
              className="link link-hover text-xs "
              rel="noreferrer"
              target="_blank"
              href={
                nfts[currentIndex] && nfts[currentIndex].coverImage.toString()
              }
            >
              Cover Image:{' '}
              {nfts[currentIndex] && nfts[currentIndex].coverImage.toString()}
            </a>
            <br />
            <a
              className="link link-hover text-xs "
              rel="noreferrer"
              target="_blank"
              href={nfts[currentIndex] && nfts[currentIndex].image.toString()}
            >
              Audio Source:{' '}
              {nfts[currentIndex] && nfts[currentIndex].image.toString()}
            </a>
            <br />
            <div className="modal-action">
              <label htmlFor="my-modal-69" className="btn rounded-xl">
                close
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPage;
