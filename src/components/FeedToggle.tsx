"use client";

import { useState } from "react";

interface FeedToggleProps {
    onToggle: (tab: string) => void;
}

const FeedToggle = ({ onToggle }: FeedToggleProps) => {
    const [activeTab, setActiveTab] = useState("following");

    const handleToggle = (tab: string) => {
        setActiveTab(tab);
        onToggle(tab);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6 flex">
            <button
                onClick={() => handleToggle("following")}
                className={`flex-1 py-2 px-4 rounded-md text-center transition-colors ${activeTab === "following"
                        ? "bg-primary-100 text-primary-700 font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
            >
                Following
            </button>
            <button
                onClick={() => handleToggle("all")}
                className={`flex-1 py-2 px-4 rounded-md text-center transition-colors ${activeTab === "all"
                        ? "bg-primary-100 text-primary-700 font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
            >
                All Posts
            </button>
        </div>
    );
};

export default FeedToggle;