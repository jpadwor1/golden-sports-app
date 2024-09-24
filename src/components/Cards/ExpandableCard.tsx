"use client";
import { useState } from "react";

const ExpandableCard = ({
  title,
  description,
  icon,
  outcomes,
}: {
  title: string;
  description: string;
  icon: string;
  outcomes: string[];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out max-h-fit">
      <div
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl text-gray-800 font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-blue-600 font-semibold">
          {isExpanded ? "Show less" : "Learn more"}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold mb-2">Featured Outcomes:</h4>
          <ul className="list-disc pl-5">
            {outcomes.map((outcome, index) => (
              <li key={index} className="text-gray-600 mb-1">
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;
