import MaxWidthWrapper from "@/components/Layout/MaxWidthWrapper";
import Footer from "@/components/Navigation/Footer";
import Navbar from "@/components/Navigation/Navbar";
import React from "react";
import MockupGrid from "@/components/ui/MockupGrid";

const Page = () => {
  return (
    <>
      <Navbar />
      <MaxWidthWrapper className="main-bg-gradient-to-bottom pt-24">
        <div className="flex flex-col items-center h-screen w-full">
          <div className="flex flex-col items-center">
            <h1 className="text-xl text-white font-bold">
              Event Organizer App
            </h1>
            <p className="text-6xl text-white text-center">
              Organize activities or sports events and manage your participants
            </p>
          </div>
          <div className="flex flex-col items-center mt-32 w-full md:h-[600px]">
            <h1 className="text-5xl text-white font-bold mb-10">
              Here&apos;s some valuable tips to remember:
            </h1>
            <MockupGrid />
          </div>
        </div>
      </MaxWidthWrapper>
      <Footer />
    </>
  );
};

export default Page;
