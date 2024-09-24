import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Navigation/Footer";

const TeamSportsPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-green-50 to-white">
        <h1 className="text-5xl font-bold mb-8 text-center text-green-800">
          Team Sports and Activities
        </h1>
        <p className="text-xl mb-8 text-center max-w-3xl mx-auto text-gray-700">
          Golden Sports simplifies group management for nearly all sports and
          activities. Say goodbye to the hassles of organizing teams, scheduling
          events, and tracking performance.
        </p>

        <div className="flex justify-center space-x-4 mb-12">
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Link href="/features">Learn More</Link>
          </Button>
        </div>

        <h2 className="text-3xl font-semibold mb-6 text-center text-green-800">
          Supported Sports and Activities
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sportsData.map((sport, index) => (
            <SportCard key={index} {...sport} />
          ))}
        </div>

        <div className="mt-16 bg-green-100 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-green-800">
            Why Choose Golden Sports?
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Effortless team organization and management</li>
            <li>Intuitive scheduling and event planning</li>
            <li>Real-time communication with team members</li>
            <li>Performance tracking and analytics</li>
            <li>Customizable for any sport or group activity</li>
          </ul>
          <Button
            asChild
            className="mt-6 bg-green-600 hover:bg-green-700 text-white"
          >
            <Link href="/demo">Request a Demo</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

const SportCard = ({
  name,
  icon,
  color,
}: {
  name: string;
  icon: string;
  color: string;
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:scale-105 border-t-4 ${color}`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
    </div>
  );
};

const sportsData = [
  { name: "Soccer", icon: "⚽️", color: "border-green-500" },
  { name: "Basketball", icon: "🏀", color: "border-orange-500" },
  { name: "Volleyball", icon: "🏐", color: "border-yellow-500" },
  { name: "Baseball", icon: "⚾️", color: "border-red-500" },
  { name: "Football", icon: "🏈", color: "border-brown-500" },
  { name: "Hockey", icon: "🏒", color: "border-blue-500" },
  { name: "Tennis", icon: "🎾", color: "border-green-300" },
  { name: "Swimming", icon: "🏊‍♀️", color: "border-blue-300" },
  { name: "Track & Field", icon: "🏃‍♂️", color: "border-purple-500" },
  { name: "Gymnastics", icon: "🤸‍♀️", color: "border-pink-500" },
  { name: "Martial Arts", icon: "🥋", color: "border-red-700" },
  { name: "Chess", icon: "♟️", color: "border-gray-500" },
];

export default TeamSportsPage;
