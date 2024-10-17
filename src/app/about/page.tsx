import React from "react";
import Image from "next/image";
import Link from "next/link";
import MetricsCarousel from "@/components/MetricsCarousel";
import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Navigation/Footer";
import ExpandableCard from "@/components/Cards/ExpandableCard";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-gray-800">
              Our Mission
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We believe these precious social activities ought to be easier
            </p>
          </div>

          {/* Mission and Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Making Sports Management Easier
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                When people get together, wonderful things happen. The time we
                spend playing sport or sharing common interests is priceless.
                Away from the worries of work or the million other things that
                play on our minds, it leaves us happier and healthier.
              </p>
              <p className="text-xl text-gray-600 mb-6">
                We believe these precious social activities ought to be much
                easier to make happen. But, too often, it falls on one person to
                organize it. We&apos;re here to help.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <MetricsCarousel />
            </div>
          </div>

          {/* Our Story */}
          <h2 className="text-4xl font-bold mb-8 text-gray-800">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <ExpandableCard
              title="Founded in 2023"
              description="By a team of sports enthusiasts and tech experts"
              icon="🏆"
              outcomes={[
                "Comprehensive all-in-one platform",
                "Born out of personal experiences",
                "Dedicated to solving pain points",
              ]}
            />
            <ExpandableCard
              title="Our Vision"
              description="Enabling a sustainable future for grassroots activities"
              icon="🌱"
              outcomes={[
                "Best-in-class technology",
                "Ecosystem for thriving communities",
                "Making activities easy to organize",
              ]}
            />
            <ExpandableCard
              title="Supporting Volunteers"
              description="Empowering the backbone of grassroots sports"
              icon="🤝"
              outcomes={[
                "Reducing administrative burden",
                "Providing tools for efficient management",
                "Recognizing and appreciating volunteer efforts",
              ]}
            />
          </div>

          {/* Mockup Section */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 md:ml-10">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Experience Golden Sports on the go
              </h2>
              <p className="text-xl text-gray-600">
                Our mobile app puts the power of sports management in your
                pocket.
              </p>
            </div>
            <div className="md:w-1/2 relative md:ml-24">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
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
                    src="/mockup-bg.png"
                    alt="Golden Sports mobile app mockup"
                    width={300}
                    height={600}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Career Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Join Our Team
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Thinking about a career at Golden Sports?
            </p>
            <Link
              href="/careers"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-blue-600 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Work With Us
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
