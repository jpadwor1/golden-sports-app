"use client";
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
const MockupGrid = () => {
  const images = [
    "/mockup-bg.png",
    "/mockup-bg2.png",
    "/mockup-bg3.png",
    "/mockup-bg4.png",
  ];

  const [image, setImage] = useState(0);

  return (
    <div className="hidden w-full gap-8 md:grid md:grid-cols-[.5fr_1fr_.5fr] md:grid-rows-[1fr_1fr_1fr]">
      <div className="flex flex-col justify-between p-4 md:h-[600px] text-white">
        <div
          onClick={() => setImage(0)}
          onMouseEnter={() => setImage(0)}
          className={cn(
            image === 0 ? "opacity-1" : "opacity-50",
            "flex flex-col items-center row-span-1 cursor-pointer transition-all duration-300 ease-in-out"
          )}
        >
          <h1 className="text-3xl text-white font-bold">Plan Ahead</h1>
          <p className="text-lg text-white">
            Within your Golden Sports event settings you can set meet-up times
            to congregate before your event starts.
          </p>
        </div>
        <div
          onClick={() => setImage(1)}
          onMouseEnter={() => setImage(1)}
          className={cn(
            image === 1 ? "opacity-1" : "opacity-50",
            "flex flex-col items-center row-span-1 cursor-pointer transition-all duration-300 ease-in-out"
          )}
        >
          <h1 className="text-3xl text-white font-bold">Plan Ahead</h1>
          <p className="text-lg text-white">
            Within your Golden Sports event settings you can set meet-up times
            to congregate before your event starts.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-4">
        <div className="relative z-10 overflow-hidden">
          <Image
            src="/iphone-mockup.png"
            alt="Golden Sports mobile app mockup"
            width={300}
            height={500}
            className="relative z-10 h-[575px]"
          />
          <div className="absolute top-0 bottom-0 z-0 rounded-[52px] overflow-hidden w-[298px] px-1">
            <Image
              src={images[image]}
              alt="Golden Sports mobile app mockup"
              width={300}
              height={600}
              className="h-full"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between p-4 md:h-[600px] ">
        <div
          onClick={() => setImage(2)}
          onMouseEnter={() => setImage(2)}
          className={cn(
            image === 2 ? "opacity-1" : "opacity-50",
            "flex flex-col items-center row-span-1 cursor-pointer transition-all duration-300 ease-in-out"
          )}
        >
          <h1 className="text-3xl text-white font-bold">Plan Ahead</h1>
          <p className="text-lg text-white">
            Within your Golden Sports event settings you can set meet-up times
            to congregate before your event starts.
          </p>
        </div>
        <div
          onClick={() => setImage(3)}
          onMouseEnter={() => setImage(3)}
          className={cn(
            image === 3 ? "opacity-1" : "opacity-50",
            "flex flex-col items-center row-span-1 cursor-pointer transition-all duration-300 ease-in-out"
          )}
        >
          <h1 className="text-3xl text-white font-bold">Plan Ahead</h1>
          <p className="text-lg text-white">
            Within your Golden Sports event settings you can set meet-up times
            to congregate before your event starts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockupGrid;
