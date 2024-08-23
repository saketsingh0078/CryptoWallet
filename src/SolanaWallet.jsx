import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import React, { useState } from "react";
import bs58 from "bs58";
import nacl from "tweetnacl";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export const SolanaWallet = ({ mnemonic }) => {
  const [sendToAddress, setSendToAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [secretKeys, setSecretKeys] = useState([]);
  const [balances, setBalances] = useState([]);

  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/ZdxMDAp5HFXaA84BtnP6a4ClFClk-81p"
  );

  const checkBalance = async (publicKey, index) => {
    try {
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      const newBalances = [...balances];
      newBalances[index] = solBalance;
      setBalances(newBalances);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const sendTransaction = async (secretKey, to, amount) => {
    try {
      const fromKeypair = Keypair.fromSecretKey(secretKey);
      console.log(fromKeypair.publicKey);
      const toPublicKey = to;
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPublicKey,
          lamports: Math.floor(amount * LAMPORTS_PER_SOL),
        })
      );

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromKeypair]
      );
      console.log("Transaction confirmed with signature:", signature);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-[80%] md:w-[50%]">
        <div className="flex justify-center">
          <button
            className="mt-5 border-2 rounded-md p-2 hover:bg-black items-center "
            onClick={async () => {
              const seed = await mnemonicToSeed(mnemonic);
              const path = `m/44'/501'/${currentIndex}'/0'`;
              const derivedSeed = derivePath(path, seed.toString("hex")).key;
              const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
              const keyPair = Keypair.fromSecretKey(secret);

              setCurrentIndex(currentIndex + 1);
              setPublicKeys([...publicKeys, keyPair.publicKey]);
              setSecretKeys([...secretKeys, secret]);
              setBalances([...balances, ""]);
            }}
          >
            Add Solana Wallet
          </button>
        </div>

        <div>
          {publicKeys &&
            publicKeys.map((publicKey, index) => (
              <div key={index} className="border-2 mt-5 p-2 w-full rounded-md">
                <div className="border-2 rounded-md p-2 mb-2">
                  Public Key:{" "}
                  <h1 className="break-all p-2 select-all rounded-md ">
                    {publicKey.toBase58()}
                  </h1>
                </div>
                <div className="border-2 rounded-md p-2 mb-2 w-full">
                  Secret Key:{" "}
                  <h1 className="break-all p-2 select-all rounded-md">
                    {bs58.encode(secretKeys[index])}
                  </h1>
                </div>

                <div className="border-2 rounded-md p-2 mb-2">
                  Balance: {balances[index]} SOL
                </div>
                <button
                  className=" border-2 rounded-md p-2 hover:bg-black "
                  onClick={() => checkBalance(publicKey, index)}
                >
                  Check Balance
                </button>

                <div className="mt-2 flex gap-2 flex-wrap">
                  <input
                    className=" border-2 rounded-md p-2 "
                    type="text"
                    placeholder="Send to Address"
                    value={sendToAddress}
                    onChange={(e) => setSendToAddress(e.target.value)}
                  />
                  <input
                    className="border-2 rounded-md p-2  "
                    type="text"
                    placeholder="Amount in SOL"
                    value={amountToSend}
                    onChange={(e) => setAmountToSend(e.target.value)}
                  />
                  <button
                    className=" border-2 rounded-md p-2 hover:bg-black "
                    onClick={() => {
                      if (publicKeys.length > 0 && secretKeys.length > 0) {
                        sendTransaction(
                          secretKeys[index],
                          sendToAddress,
                          amountToSend
                        );
                      } else {
                        console.error(
                          "No public keys or secret keys available to send SOL."
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
    </div>
  );
};
