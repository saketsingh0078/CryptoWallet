import { mnemonicToSeed } from "bip39";
import { HDNodeWallet } from "ethers";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

export const EtheremWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);
  const [balances, setBalances] = useState([]);
  const [sendToAddress, setSendToAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState("");

  const provider = new ethers.JsonRpcProvider(
    "https://rpc.ankr.com/eth/3f9610e78d050f1215426074e3117e5fbc8b8bb884a45b38d8cf671156e9ec61"
  );

  const checkBalance = async (address, index) => {
    const balance = await provider.getBalance(address);
    const etherBalance = ethers.formatEther(balance);
    const newBalances = [...balances];
    newBalances[index] = etherBalance;
    setBalances(newBalances);
  };

  const sendTransaction = async (privateKey, to, amount) => {
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = {
      to: to,
      value: ethers.parseEther(amount),
    };

    try {
      const txResponse = await wallet.sendTransaction(tx);
      await txResponse.wait();
      console.log("Transaction successful:", txResponse);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="w-[80%] md:w-[50%]">
        <div className="flex justify-center ">
          <button
            className="mt-5 mb-5 border-2 rounded-md p-1 hover:bg-black "
            onClick={async () => {
              const seed = await mnemonicToSeed(mnemonic);
              const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
              const hdNode = HDNodeWallet.fromSeed(seed);
              const child = hdNode.derivePath(derivationPath);
              const privateKey = child.privateKey;
              const address = child.address;

              setPrivateKeys([...privateKeys, privateKey]);
              setAddresses([...addresses, address]);
              setBalances([...balances, ""]);
              setCurrentIndex(currentIndex + 1);
            }}
          >
            Add an Ethereum Wallet
          </button>
        </div>

        {addresses.map((address, index) => (
          <div key={index} className="border-2 p-2 w-full mb-4 rounded-md">
            <div className="border-2 mb-2 p-2 rounded-md">
              Public Address:
              <h1 className="break-all p-2 select-all rounded-md">{address}</h1>
            </div>
            <div className="border-2 mb-2 p-2 rounded-md">
              Private Key:
              <h1 className="break-all p-2 select-all rounded-md">
                {privateKeys[index]}
              </h1>
            </div>

            <div className="border-2 mb-2 p-2  rounded-md">
              Balance: {balances[index]} ETH
            </div>

            <button
              className="border-2 mb-2 rounded-md p-2 hover:bg-black "
              onClick={() => checkBalance(address, index)}
            >
              Check Balance
            </button>
            <div className="flex flex-wrap gap-2">
              <input
                className=" border-2 rounded-md p-2 "
                type="text"
                placeholder="Send to Address"
                value={sendToAddress}
                onChange={(e) => setSendToAddress(e.target.value)}
              />
              <input
                className="border-2 rounded-md p-2 "
                type="text"
                placeholder="Amount in ETH"
                value={amountToSend}
                onChange={(e) => setAmountToSend(e.target.value)}
              />
              <button
                className=" border-2 rounded-md p-2  hover:bg-black "
                onClick={() => {
                  if (addresses.length > 0 && privateKeys.length > 0) {
                    sendTransaction(
                      privateKeys[0],
                      sendToAddress,
                      amountToSend
                    );
                  } else {
                    console.error(
                      "No addresses or private keys available to send Ether."
                    );
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
