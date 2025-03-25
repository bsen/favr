import React from "react";

const PostCard = ({
  type,
  title,
  description,
  price,
  distance,
  image,
  author,
  time,
}) => {
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
              ${price}
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
            {distance} km away
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
                  ${price}
                </span>
              )}
              <span className="px-2 py-1 rounded bg-[#2a2a2a] text-white text-xs">
                {distance} km away
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-gray-400">
            <div className="h-8 w-8 rounded-full bg-[#25D366] flex items-center justify-center text-white text-sm font-bold mr-2">
              {author[0].toUpperCase()}
            </div>
            <div>
              <span className="text-white">{author}</span>
              <p className="text-gray-500 text-xs">{time}</p>
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
            <button className="flex items-center text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-[#2a2a2a] transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button className="flex items-center text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-[#2a2a2a] transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
