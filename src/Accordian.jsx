import React from "react";

export const Accordian = ({ mnemonic }) => {
  const arr = mnemonic.split(" ");

  return (
    <>
      {arr.length === 1 ? (
        ""
      ) : (
        <div className="flex justify-center mt-5 rounded-md">
          <div className="bg-slate-600 w-[80%] md:w-[60%] ">
            <div className="flex justify-between p-3 items-center">
              <h1 className="text-lg text-white">Mnemonics</h1>
            </div>
            <div className="grid grid-cols-2 grid-rows-3 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
              {arr.map((item, index) => (
                <h1
                  key={index}
                  className="border-2 p-3 break-all rounded-md text-white "
                >
                  {item}
                </h1>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
