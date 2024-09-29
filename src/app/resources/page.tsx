import Footer from "@/components/Navigation/Footer";
import Navbar from "@/components/Navigation/Navbar";
import React from "react";

const ResourcesPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Resources</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ResourceCard
            title="Getting Started Guide"
            description="Learn how to set up your account and start managing your team with Golden Sports."
            link="#"
          />
          <ResourceCard
            title="Video Tutorials"
            description="Watch step-by-step tutorials on how to use various features of our platform."
            link="#"
          />
          <ResourceCard
            title="FAQ"
            description="Find answers to commonly asked questions about Golden Sports."
            link="#"
          />
          <ResourceCard
            title="Blog"
            description="Read articles on sports management tips, success stories, and product updates."
            link="#"
          />
          <ResourceCard
            title="API Documentation"
            description="Integrate Golden Sports with your existing systems using our API."
            link="#"
          />
          <ResourceCard
            title="Community Forum"
            description="Connect with other users, share ideas, and get help from the Golden Sports community."
            link="#"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

const ResourceCard = ({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <a href={link} className="text-blue-500 hover:underline">
        Learn More →
      </a>
    </div>
  );
};

export default ResourcesPage;
