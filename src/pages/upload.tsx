import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

import Web3 from 'web3';
import Radio from 'backend/build/contracts/Radio.json';
import NFT from 'backend/build/contracts/NFT.json';

import toast from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ipfsClient = require('ipfs-http-client');
const projectId = '2FdliMGfWHQCzVYTtFlGQsknZvb';
const projectSecret = '2274a79139ff6fdb2f016d12f713dca1';
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const Upload = () => {
  const [formInput, updateFormInput] = useState({
    name: '',
    coverImage: '',
    genre: '',
  });
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [fileUrl, setFileUrl] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const inputs = [
    <form key={0} className="form-control w-full max-w-xs ml-6">
      <label className="label">
        <span className="label-text">Pick a beat</span>
        <span className="label-text-alt">MP3 / WAV ONLY</span>
      </label>
      <label>
        <input
          type="file"
          onChange={onChange}
          accept=".mp3, .wav"
          className="text-sm text-grey-500 h-11
            file:mr-5 file:py-2 file:px-6
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-[#DADDE2] dark:file:bg-[#303030] 
            hover:file:cursor-pointer hover:file:bg-[#DADDE2]/80 dark:hover:file:bg-[#303030]/80
            
          "
        />
        <br />
        {loading ? <>Uploading file...</> : ''}
      </label>
    </form>,
    <div key={1} className="form-control w-full max-w-xs ml-6 mb-1">
      <label className="label">
        <span className="label-text">Enter a title for your song</span>
      </label>
      <input
        type="text"
        placeholder="Title here"
        className="w-full max-w-xs rounded-md bg-white dark:bg-black"
        onChange={(e) =>
          updateFormInput({ ...formInput, name: e.target.value })
        }
      />
    </div>,

    <form key={2} className="form-control w-full max-w-xs ml-6">
      <label className="label">
        <span className="label-text">Pick a Song</span>
        <span className="label-text-alt"> | MP3 / WAV ONLY</span>
      </label>
      <label>
        <input
          type="file"
          onChange={createCoverImage}
          accept="image/*"
          className="text-sm text-grey-500 h-11
          file:mr-5 file:py-2 file:px-6
          file:rounded-md file:border-0
          file:text-sm file:font-medium
          file:bg-[#DADDE2] dark:file:bg-[#303030] 
          hover:file:cursor-pointer hover:file:bg-[#DADDE2]/80 dark:hover:file:bg-[#303030]/80
          
        "
        />
        <br />
        {loading ? <>Uploading file...</> : ''}
      </label>
    </form>,

    <div key={3} className="ml-5">
      <label className="label">
        <span className="label-text">Choose the genre that fits</span>
      </label>
      <select
        onChange={(e) =>
          updateFormInput({ ...formInput, genre: e.target.value })
        }
        className="select select-bordered w-full max-w-xs rounded-md bg-white dark:bg-black"
      >
        <option disabled selected>
          Select Genre
        </option>
        <option value="lofi">Lofi</option>
        <option value="hiphop">Hip Hop</option>
        <option value="vocals">Vocals</option>
      </select>
      {/* <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue
            onChange={(e) =>
              // @ts-ignore
              updateFormInput({ ...formInput, genre: e.target.value })
            }
            placeholder="Theme"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="lofi">Lofi</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select> */}
    </div>,
  ];

  const router = useRouter();

  useEffect(() => {
    if (formInput.name && formInput.coverImage && formInput.genre && fileUrl) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [account, formInput, fileUrl]);

  async function onChange(e: any) {
    // upload image to IPFS
    setLoading(true);
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog: any) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setLoading(false);
      // @ts-ignore
      setFileUrl(url);
      toast.success('received audio file', {
        style: {
          border: '1px solid #fff',
          fontWeight: 'bold',
        },
      });
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function createCoverImage(e: any) {
    // upload image to IPFS
    setImageLoading(true);
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog: any) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);
      // @ts-ignore
      setCoverImage(url);
      updateFormInput({
        ...formInput,
        coverImage: url,
      }); // update form input with cover image URL
      setImageLoading(false);
      toast.success('received cover image', {
        style: {
          border: '1px solid #fff',
          fontWeight: 'bold',
        },
      });
    } catch (error) {
      console.log('Error uploading file: ', error);
      toast.error('Error uploading file: ', {
        style: {
          border: '1px solid #fff',
          fontWeight: 'bold',
        },
      });
    }
  }

  async function uploadToIPFS() {
    const { name, coverImage, genre } = formInput;
    if (!name || !coverImage || !genre || !fileUrl) {
      return;
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        name,
        coverImage,
        image: fileUrl,
        genre,
      });
      try {
        const added = await client.add(data);
        const url = `https://ipfs.io/ipfs/${added.path}`;
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction

        return url;
      } catch (error) {
        console.log('Error uploading file: ', error);
      }
    }
  }

  async function listNFTForSale() {
    const notification = toast.loading(
      'Make sure to confirm both transactions!',
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
      const url = await uploadToIPFS();

      const networkId = await web3.eth.net.getId();

      // Mint the NFT
      const networkIdHardCode = 80001;
      const NFTContractAddress = NFT.networks[networkIdHardCode].address;

      const NFTContract = new web3.eth.Contract(NFT.abi, NFTContractAddress);
      const accounts = await web3.eth.getAccounts();

      setIsUploading(true);

      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );

      NFTContract.methods
        .mint(url)
        .send({ from: accounts[0] })
        .on('receipt', function (receipt: any) {
          console.log('minted');
          // List the NFT
          const tokenId = receipt.events.NFTMinted.returnValues[0];
          radioContract.methods
            .listNft(NFTContractAddress, tokenId)
            .send({ from: accounts[0] })
            .on('receipt', function () {
              console.log('listed');

              toast.success('Listed to Etherwav!', {
                id: notification,
                style: {
                  border: '1px solid #fff',
                  fontWeight: 'bold',
                },
              });

              setIsUploading(false);

              // wait 2 seconds, then reload the page
              setTimeout(() => {
                router.push('/radio');
              }, 2000);
            });
        });
    } catch (error) {
      console.log(error);
      toast.error('Error creating stem', {
        id: notification,
        style: {
          border: '1px solid #fff',
          fontWeight: 'bold',
        },
      });
    }
  }

  const handleClick = (next: any) => {
    if (next) {
      setDirection('left');
    } else {
      setDirection('right');
    }
  };

  return (
    <div>
      <div className="bg-grid-[#0f0f0f] flex flex-col items-center justify-center w-full px-12 py-4">
        {/* CARD */}
        <div className="w-96 shadow-xl border border-[#303030] rounded-xl uploadcard ">
          <figure className="px-10 pt-5">
            <h1 className="text-3xl font-bold text-center">Upload a Song</h1>
          </figure>
          <p className="mt-2 text-sm text-center text-gray-400">
            PLEASE NOTE: THE BUTTON WILL BE DISABLED UNTIL ALL ASSETS ARE
            UPLOADED TO IPFS, THIS CAN TAKE A COUPLE SECONDS
          </p>
          <div className="card-body mt-6">
            <AnimatePresence>
              <div
                className="input-container"
                style={{
                  display: 'inline-flex',
                  width: '100%',
                  overflowX: 'hidden',
                }}
              >
                {inputs[currentInputIndex] && (
                  <motion.div
                    key={currentInputIndex}
                    initial={{ x: direction === 'right' ? '-100%' : '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: direction === 'right' ? '-100%' : '100%' }}
                    transition={{ type: 'tween', duration: 0.5 }}
                  >
                    {inputs[currentInputIndex]}
                  </motion.div>
                )}
              </div>
            </AnimatePresence>

            <div className="flex justify-between mt-4 px-6">
              <Button
                variant="default"
                onClick={() => {
                  setCurrentInputIndex(currentInputIndex - 1);
                  handleClick(false);
                }}
                disabled={currentInputIndex === 0}
              >
                Previous
              </Button>

              <h1 className="">
                {currentInputIndex + 1} of {inputs.length}
              </h1>
              <Button
                variant="default"
                onClick={() => {
                  setCurrentInputIndex(currentInputIndex + 1);
                  handleClick(true);
                }}
                disabled={loading || currentInputIndex === inputs.length - 1}
              >
                Next
              </Button>
            </div>
            <div className="card-actions w-full mt-4 p-6">
              {disabled ? (
                <Button
                  disabled={disabled}
                  onClick={listNFTForSale}
                  className="w-full"
                  variant="default"
                >
                  Upload
                </Button>
              ) : isUploading ? (
                <button className="btn btn-outline w-full rounded-xl loading">
                  loading
                </button>
              ) : (
                <button
                  disabled={disabled}
                  onClick={listNFTForSale}
                  className="btn btn-outline w-full rounded-xl"
                >
                  Upload{' '}
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
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="divider">OR</div>

        <div className="card w-96 shadow-xl bg-black border border-[#2a2a2a] rounded-3xl uploadcard">
          <figure className="px-10 pt-5">
            <h1 className="text-3xl font-bold text-center">
              Not sure what to upload?
            </h1>
          </figure>
          <div className="card-body items-center text-center">
            <h1 className="text-xl font-bold text-center">
              Browse the radio for some inspiration!
            </h1>
            <div className="card-actions w-full mt-4">
              <Link href="/radio" className="btn btn-outline w-full rounded-xl">
                Listen to radio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
