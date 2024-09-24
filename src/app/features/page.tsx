import React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  Bell,
  FileText,
  MessageCircle,
  CreditCard,
  Gift,
  UserPlus,
  BarChart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navigation/Navbar";
import FeatureCarousel from "@/components/FeatureCarousel";
import Footer from "@/components/Navigation/Footer";
import MaxWidthWrapper from "@/components/Layout/MaxWidthWrapper";

const FeaturesPage = () => {
  const allFeatures = [
    {
      title: "Group Setup & Creation",
      description:
        "Easily create and customize groups for your teams, leagues, or sports organizations.",
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: "Activity & Event Management",
      description:
        "Organize practices, games, tournaments, and manage participant attendance effortlessly.",
      icon: <CalendarDays className="w-8 h-8" />,
    },
    {
      title: "Invites & Reminders",
      description:
        "Send automated invitations and reminders to keep everyone informed and on schedule.",
      icon: <Bell className="w-8 h-8" />,
    },
    {
      title: "File Storage",
      description:
        "Securely store and share important documents, photos, and videos with your team.",
      icon: <FileText className="w-8 h-8" />,
    },
    {
      title: "Integrated Messaging",
      description:
        "Communicate seamlessly with individual members, specific groups, or your entire organization.",
      icon: <MessageCircle className="w-8 h-8" />,
    },
    {
      title: "Payment Collection",
      description:
        "Easily collect and manage payments for equipment, travel, membership fees, and more.",
      icon: <CreditCard className="w-8 h-8" />,
    },
    {
      title: "Group Fundraising",
      description:
        "Organize and track fundraising campaigns to support your team's goals and activities.",
      icon: <Gift className="w-8 h-8" />,
    },
    {
      title: "Guardian Management",
      description:
        "Add and manage guardians for youth players, ensuring proper communication and permissions.",
      icon: <UserPlus className="w-8 h-8" />,
    },
    {
      title: "Smart Notifications",
      description:
        "Keep everyone in the loop with customizable notifications for important updates and events.",
      icon: <Bell className="w-8 h-8" />,
    },
    {
      title: "Team Polling",
      description:
        "Create polls to gather feedback and make decisions that work best for your entire team.",
      icon: <BarChart className="w-8 h-8" />,
    },
  ];

  const keyFeatures = allFeatures.slice(0, 3); // Adjust this to include your most important features

  return (
    <>
      <Navbar />
      <MaxWidthWrapper className="main-bg-gradient-to-bottom">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8 text-center text-white">
            Powerful Features for Seamless Sports Management
          </h1>
          <p className="text-xl mb-8 text-center max-w-3xl mx-auto text-white">
            Golden Sports offers a comprehensive suite of tools designed to
            streamline every aspect of sports team and group management.
          </p>

          {/* Top CTA */}
          <div className="bg-white/80 p-8 rounded-lg mb-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to elevate your team's performance?
            </h2>
            <Link href="/register">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Start For Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Key Features */}
          <h2 className="text-3xl font-bold mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {keyFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-white/60 p-8 rounded-lg my-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Experience the power of Golden Sports
            </h2>
            <p className="mb-6">
              Join thousands of teams already using our platform to streamline
              their sports management.
            </p>
            <div className="space-x-4">
              <Link href="/register">
                <Button className="bg-green-600 text-white hover:bg-green-700">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Contact Sales</Button>
              </Link>
            </div>
          </div>

          {/* All Features Carousel */}
          <h2 className="text-3xl font-bold mb-6 text-center">All Features</h2>
          <div className="md:max-w-2xlmax-w-md mx-auto">
            <FeatureCarousel features={allFeatures} />
          </div>
        </div>
      </MaxWidthWrapper>
      <Footer />
    </>
  );
};

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeaturesPage;
