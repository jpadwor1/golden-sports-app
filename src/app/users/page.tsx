import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Navigation/Footer";
import ExpandableCard from "@/components/Cards/ExpandableCard";

const UsersPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen main-bg-gradient-to-bottom text-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              Empowering Sports Communities
            </h1>
            <p className="text-xl mb-8">
              Golden Sports: The all-in-one platform for every member of your
              sports ecosystem
            </p>
          </div>

          {/* User Cards */}
          <h2 className="text-4xl font-bold mb-8">Who Uses Golden Sports?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <ExpandableCard
              title="Coaches"
              description="Streamline team management, track player performance, and communicate effectively."
              icon="👨‍🏫"
              outcomes={[
                "Easily manage team rosters and player information",
                "Track individual and team performance metrics",
                "Communicate with players and parents through a unified platform",
              ]}
            />
            <ExpandableCard
              title="Team Managers"
              description="Organize schedules, manage resources, and keep everyone informed."
              icon="👩‍💼"
              outcomes={[
                "Efficiently create and manage team schedules",
                "Coordinate equipment and facility usage",
                "Send automated notifications for events and changes",
              ]}
            />
            <ExpandableCard
              title="League Administrators"
              description="Oversee multiple teams, manage competitions, and ensure smooth operations."
              icon="🏆"
              outcomes={[
                "Manage multiple teams and leagues from a central dashboard",
                "Automate tournament and competition scheduling",
                "Generate comprehensive reports for league performance",
              ]}
            />
            <ExpandableCard
              title="Parents"
              description="Stay updated on schedules, team news, and their child's progress."
              icon="👨‍👩‍👧‍👦"
              outcomes={[
                "Access real-time updates on game schedules and locations",
                "Track child's performance and progress over time",
                "Easily communicate with coaches and team managers",
              ]}
            />
            <ExpandableCard
              title="Players"
              description="Access personal stats, team schedules, and communicate with teammates."
              icon="🏃‍♀️"
              outcomes={[
                "View personal performance statistics and improvement areas",
                "Access team schedules and event details on-the-go",
                "Collaborate with teammates through integrated messaging",
              ]}
            />
            <ExpandableCard
              title="Club Directors"
              description="Manage multiple teams, track club-wide performance, and streamline operations."
              icon="🏢"
              outcomes={[
                "Oversee all teams and coaches within the club",
                "Analyze club-wide performance metrics and trends",
                "Streamline financial management and resource allocation",
              ]}
            />
          </div>

          {/* Key Feature Outcomes */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Key Feature Outcomes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureOutcome
                title="Seamless Communication"
                description="Keep teams close with instant messaging, announcements, and file sharing."
                icon="💬"
              />
              <FeatureOutcome
                title="Automated Event Management"
                description="Effortlessly schedule practices, games, and tournaments with smart conflict resolution."
                icon="📅"
              />
              <FeatureOutcome
                title="Simplified Payments"
                description="Manage team fees, coach payments, and expense tracking all in one place."
                icon="💳"
              />
            </div>
          </div>

          {/* Mockup Section */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">
                Features that will save you hours of valuable time
              </h2>
              <p className="text-xl">
                Experience the power of Golden Sports on your mobile device.
              </p>
            </div>
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative z-10 overflow-hidden flex justify-center items-center">
                <Image
                  src="/iphone-mockup.png"
                  alt="Golden Sports mobile app mockup"
                  width={300}
                  height={500}
                  className="mx-auto relative z-10 h-[575px]"
                />
                <div className="mx-auto absolute top-0 bottom-0 z-0 md:left-0 md:right-0 rounded-[52px] overflow-hidden w-[298px] px-1">
                  <Image
                    src="/mockup-bg.png"
                    alt="Golden Sports mobile app mockup"
                    width={300}
                    height={600}
                    className="h-full "
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to transform your sports management?
            </h2>
            <Link
              href="/signup"
              className="inline-block bg-[#00B3B6] hover:bg-[#00B3B6] text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const FeatureOutcome = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => {
  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default UsersPage;
