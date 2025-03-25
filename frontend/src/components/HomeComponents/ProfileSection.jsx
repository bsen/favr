import React, { useState } from "react";

const ProfileSection = ({
  name,
  userData,
  onUpdateName,
  onUpdateLocation,
  onLogout,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="relative">
      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-[#25D366] flex items-center justify-center text-white text-2xl font-bold">
              <img
                src={`/avatars/${userData?.profilePicture}`}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-white text-xl font-semibold">
                {name || "Guest"}
              </h2>
              <p className="text-gray-400">
                @{name?.toLowerCase().replace(/\s+/g, "") || "guest"}
              </p>
              {userData?.phone && (
                <p className="text-gray-500 text-sm mt-1">{userData.phone}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-400 p-2"
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
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>
        </div>

        {userData?.location && (
          <div className="mt-6 border-t border-[#2a2a2a] pt-4">
            <h3 className="text-white font-medium mb-2">Location</h3>
            <div className="text-gray-400 text-sm space-y-1">
              <p>{userData.location.address}</p>
              <p>
                {userData.location.city}, {userData.location.state}{" "}
                {userData.location.postalCode}
              </p>
              <p>{userData.location.country}</p>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="absolute right-4 top-20 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg py-2 w-48">
            <button
              onClick={() => {
                onUpdateName();
                setShowSettings(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-[#3a3a3a] flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              Update Name
            </button>
            <button
              onClick={() => {
                onUpdateLocation();
                setShowSettings(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-[#3a3a3a] flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Update Location
            </button>
            <button
              onClick={() => {
                onLogout();
                setShowSettings(false);
              }}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#3a3a3a] flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
