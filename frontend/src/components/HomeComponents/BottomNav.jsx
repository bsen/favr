import React from "react";

const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#2a2a2a] px-2">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => setActiveTab("feed")}
          className={`flex flex-col items-center justify-center w-1/5 ${
            activeTab === "feed" ? "text-[#25D366]" : "text-gray-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs mt-1">Feed</span>
        </button>

        <button
          onClick={() => setActiveTab("browse")}
          className={`flex flex-col items-center justify-center w-1/5 ${
            activeTab === "browse" ? "text-[#25D366]" : "text-gray-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-xs mt-1">Browse</span>
        </button>

        <button
          onClick={() => setActiveTab("post")}
          className="flex flex-col items-center justify-center w-1/5"
        >
          <div className="bg-[#25D366] rounded-full p-3 -mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <span className="text-xs mt-1 text-gray-400">Post</span>
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`flex flex-col items-center justify-center w-1/5 ${
            activeTab === "messages" ? "text-[#25D366]" : "text-gray-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="text-xs mt-1">Messages</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center w-1/5 ${
            activeTab === "profile" ? "text-[#25D366]" : "text-gray-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
