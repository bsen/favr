import React from "react";

const LocationModal = ({ show, loading, locationError, onGetLocation }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-white text-xl mb-4">Location Access Required</h2>
        <p className="text-gray-400 mb-4">
          Please allow access to your location to continue using the app.
        </p>
        {locationError && (
          <div className="bg-red-900/30 text-red-400 p-3 rounded-md mb-4 border border-red-800">
            {locationError}
          </div>
        )}
        <button
          onClick={onGetLocation}
          disabled={loading}
          className="w-full bg-[#25D366] hover:bg-[#20bd59] text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Getting Location..." : "Share Location"}
        </button>
      </div>
    </div>
  );
};

export default LocationModal;
