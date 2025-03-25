import React from "react";
import { formatDistanceToNow } from "date-fns";

const PostCard = ({
  type,
  title,
  description,
  price,
  distance,
  imageUrls,
  name,
  profilePicture,
  createdAt,
  onStatusUpdate,
}) => {
  const image = imageUrls?.[0];

  return (
    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg overflow-hidden mb-4">
      {image ? (
        <div className="relative h-48">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                type === "request" ? "bg-blue-500" : "bg-[#25D366]"
              } text-white`}
            >
              {type === "request" ? "Request" : "Offer"}
            </span>
          </div>
          {price && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white font-medium">
              ₹{price}
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
            {distance.toFixed(1)} km away
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-[#2a2a2a]">
          <div className="flex justify-between items-start mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                type === "request" ? "bg-blue-500" : "bg-[#25D366]"
              } text-white`}
            >
              {type === "request" ? "Request" : "Offer"}
            </span>
            <div className="flex items-center space-x-2">
              {price && (
                <span className="px-2 py-1 rounded bg-[#2a2a2a] text-white font-medium">
                  ₹{price}
                </span>
              )}
              <span className="px-2 py-1 rounded bg-[#2a2a2a] text-white text-xs">
                {distance.toFixed(1)} km away
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-gray-400">
            <div className="h-8 w-8 rounded-full bg-[#25D366] flex items-center justify-center text-white text-sm font-bold mr-2 overflow-hidden">
              {profilePicture ? (
                <img
                  src={`/avatars/${profilePicture}`}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                name?.[0]?.toUpperCase() || "?"
              )}
            </div>
            <div>
              <span className="text-white">{name}</span>
              <p className="text-gray-500 text-xs">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex justify-between items-center pt-2 border-t border-[#2a2a2a]">
          <button className="flex items-center text-[#25D366] hover:text-[#1ea855] px-3 py-2 rounded-lg hover:bg-[#25D366]/10 transition-colors">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Message
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onStatusUpdate("completed")}
              className="text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              Mark as Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
