import React, { useState } from "react";
import { IoBedOutline } from "react-icons/io5";
import { PiMoneyThin } from "react-icons/pi";
import { MdAttachMoney } from "react-icons/md";



function BoxChoix({ maxBedrooms, setMaxBedrooms, maxPrice, setMaxPrice }) {
  return (
    <div className="p-4 h-48 border border-gray-300 bg-gray-30 shadow-lg rounded-lg">
      <input
        type="range"
        min="0"
        max="3000"
        value={maxPrice}
        className="range w-full"
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      
      <div className="px-3 py-1 flex items-center text-lg">
        Maximum Price:  {maxPrice}$
      </div>

      <div className="flex justify-around mt-4 space-x-4">

        <p className="px-4 py-2 text-blue-300 text-lg font-light italic">
          <IoBedOutline  size={24} color="black" />
          </p>
        
        
        <button
          className="border border-blue-300 px-4 py-2 w-20 bg-white hover:bg-gray-100"
          onClick={() => setMaxBedrooms(1)}
        >
          <p>1</p>
        </button>

        <button
          className="border border-blue-300 px-4 py-2 w-20 bg-white hover:bg-gray-200"
          onClick={() => setMaxBedrooms(2)}
        >
          <p>2</p>
        </button>

        <button
          className="border border-blue-300 px-4 py-2  w-20 bg-white hover:bg-gray-300"
          onClick={() => setMaxBedrooms(3)}
        >
         <p>3</p>
        </button>
      </div>
    </div>
  );
}

export default BoxChoix;
