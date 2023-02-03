import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import toast from 'react-hot-toast';
import Image from 'next/image';

import Web3 from 'web3';
import Radio from '../../backend/build/contracts/Radio.json';
import NFT from '../../backend/build/contracts/NFT.json';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const [nfts, setNfts] = useState([]);
  const [topThreeNfts, setTopThreeNfts] = useState([]);
  const [ascending, setAscending] = useState(false);

  useEffect(() => {
    loadProfileSongs();
  }, []);

  async function loadProfileSongs() {
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
    const listings = await radioContract.methods
      .getMyListedNfts()
      // @ts-ignore
      .call({ from: window.ethereum.selectedAddress });
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
    // setNfts(nfts.filter((nft) => nft !== null));

    // set nfts in order of heatCount
    const sortedNfts = nfts
      .filter((nft) => nft !== null)
      .sort((a, b) => b.heatCount - a.heatCount);
    const topThreeNfts = sortedNfts.slice(0, 3);
    // @ts-ignore
    setTopThreeNfts(topThreeNfts);
    // @ts-ignore
    setNfts(sortedNfts);
  }
  // @ts-ignore
  async function deleteNft(tokenId) {
    const notification = toast.loading(
      'Confirm the transaction to delete your song',
      {
        style: {
          border: '1px solid #fff',
          fontWeight: 'bold',
        },
      }
    );

    try {
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
      const accounts = await web3.eth.getAccounts();

      await radioContract.methods
        .deleteNft(tokenId)
        .send({ from: accounts[0] });
      console.log('NFT deleted successfully');
      toast.success('Song deleted successfully', {
        id: notification,
        style: {
          border: '1px solid #fff',
          fontWeight: 'bold',
        },
      });

      // wait for 2 seconds and reload the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      toast.error('Could not delete. Try again in a couple seconds.', {
        id: notification,
        style: {
          border: '1px solid #fff',
          fontWeight: 'bold',
        },
      });
      console.log(err);
    }
  }
  // @ts-ignore
  async function loadSongsByGenre(genre) {
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
      setTopThreeNfts(topThreeNfts);
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
      setTopThreeNfts(topThreeNfts);
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
    const topThreeNfts = sortedNfts.slice(0, 3);

    // setTopThreeNfts(topThreeNfts);
    // @ts-ignore
    setNfts(sortedNfts);
  }

  async function handleSwap() {
    setAscending(!ascending);
    if (ascending) {
      await loadProfileSongs();
      toast.success('Songs sorted descending! 🔽🔥');
    } else {
      await loadSongsAscending();
      toast.success('Songs sorted ascending! 🔼🔥');
    }
  }

  return (
    <div>
      <div className="navbar bg-slate-50 dark:bg-black sticky top-16 z-40 border-b border-[#2a2a2a]">
        <div className="flex-1">
          <h1 className=" normal-case text-xl">Filters</h1>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 space-x-1">
            <select
              className=" rounded-md select select-bordered bg-white dark:bg-black"
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
            </select>

            <label className="swap swap-rotate rounded-md card3 border border-[#2a2a2a] p-2">
              <input
                type="checkbox"
                onClick={() => {
                  handleSwap();
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
          </ul>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-center mt-6">
        Your Uploaded Songs
      </h1>
      {nfts.map((nft, index) => (
        // @ts-ignore
        <div className="p-6" key={nft.tokenId}>
          <motion.div
            // @ts-ignore
            key={nft.tokenId}
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="card card3 card-side border border-[#2a2a2a] rounded-3xl shadow-xl">
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
                <div className="space-y-6 space-x-4">
                  {/*  @ts-ignore */}
                  <h2 className="card-title text-2xl">{nft.name}</h2>
                  <motion.span
                    className="badge card1 rounded p-4"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/*  @ts-ignore */}
                    {nft.genre}
                  </motion.span>
                  <motion.span
                    className="badge card1 rounded p-4  min-w-[90px]"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/*  @ts-ignore */}
                    Heat: {nft.heatCount}🔥
                  </motion.span>
                  <ReactAudioPlayer
                    //  @ts-ignore
                    src={nft.image}
                    controls
                    className="w-full"
                  />
                </div>

                <div className="card-actions justify-end mt-4">
                  <label
                    //  @ts-ignore
                    htmlFor={`my-modal-${nft.tokenId}`}
                    className="btn btn-outline rounded-md normal-case"
                  >
                    DELETE{' '}
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
          <input
            type="checkbox"
            //  @ts-ignore
            id={`my-modal-${nft.tokenId}`}
            className="modal-toggle"
          />
          <div className="modal modal-bottom sm:modal-middle backdrop-blur-md">
            <div className="modal-box bg-white dark:bg-black border border-[#303030]">
              <h3 className="font-bold text-lg flex">
                {/* @ts-ignore */}
                Are you sure you want to delete: {nft.name} ?{' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="red"
                  className="w-24 h-24 animate-pulse flex"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </h3>
              <p className="py-4 flex justify-between">
                <br />
                This is not reversible. If you delete this song, it will be gone
                forever and you will not be able to earn any more heat from it.
              </p>

              <Button
                variant="destructive"
                className="w-full"
                // @ts-ignore
                onClick={() => deleteNft(nft.tokenId)}
              >
                {/* @ts-ignore */}
                Delete {nft.name}
              </Button>

              <div className="modal-action">
                <label
                  // @ts-ignore
                  htmlFor={`my-modal-${nft.tokenId}`}
                  className="btn rounded-md"
                >
                  close
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Profile;
