import { generateMnemonic } from "bip39";
import "./App.css";
import { useState } from "react";
import { SolanaWallet } from "./SolanaWallet";
import { EtheremWallet } from "./EtheremWallet";
import { Header } from "./Header";
import { Accordian } from "./Accordian";

function App() {
  const [mnemonic, setmnemonic] = useState(null);
  const [seed, setSeed] = useState("");
  return (
    <div className="bg-gradient-to-t min-h-screen from-slate-500 to-slate-800 text-white ">
      <Header />

      <div className="flex justify-center mt-10 ">
        <button
          className="border-2 p-2 rounded-md hover:bg-black"
          onClick={async () => {
            const mn = generateMnemonic();
            setmnemonic(mn);
          }}
        >
          Create a seed Phrase
        </button>
      </div>
      {mnemonic && (
        <>
          <Accordian mnemonic={mnemonic} />
          <SolanaWallet mnemonic={mnemonic} />
          <EtheremWallet mnemonic={mnemonic} />
        </>
      )}
    </div>
  );
}

export default App;
