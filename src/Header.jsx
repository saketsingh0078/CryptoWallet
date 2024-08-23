import React from "react";
import { FaGithub } from "react-icons/fa";
import { LuWallet } from "react-icons/lu";

export const Header = () => {
  return (
    <div className="p-2 flex justify-between">
      <div className="flex gap-1 items-center">
        <h1 className="text-3xl">CryptoWallet</h1>
        <LuWallet className="w-[40px] h-[40px]" />
      </div>

      <div className="flex items-center">
        <a href="https://github.com/saketsingh0078">
          <FaGithub className="w-[32px] h-[32px]" />
        </a>
      </div>
    </div>
  );
};
