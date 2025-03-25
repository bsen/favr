import React from "react";

const AddressConfirmModal = ({
  show,
  loading,
  locationError,
  editableAddress,
  setEditableAddress,
  onGetNewLocation,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-white text-xl mb-4">Confirm Your Address</h2>
        <p className="text-gray-400 mb-4">
          Please verify or edit your address details below:
        </p>
        {locationError && (
          <div className="bg-red-900/30 text-red-400 p-3 rounded-md mb-4 border border-red-800">
            {locationError}
          </div>
        )}
        <div className="space-y-4 mb-4">
          <div>
            <label className="text-gray-400 text-sm">Street Address</label>
            <input
              type="text"
              value={editableAddress.address}
              onChange={(e) =>
                setEditableAddress({
                  ...editableAddress,
                  address: e.target.value,
                })
              }
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg p-2 mt-1"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">City</label>
            <input
              type="text"
              value={editableAddress.city}
              onChange={(e) =>
                setEditableAddress({
                  ...editableAddress,
                  city: e.target.value,
                })
              }
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg p-2 mt-1"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">State</label>
            <input
              type="text"
              value={editableAddress.state}
              onChange={(e) =>
                setEditableAddress({
                  ...editableAddress,
                  state: e.target.value,
                })
              }
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg p-2 mt-1"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Postal Code</label>
            <input
              type="text"
              value={editableAddress.postalCode}
              onChange={(e) =>
                setEditableAddress({
                  ...editableAddress,
                  postalCode: e.target.value,
                })
              }
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg p-2 mt-1"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Country</label>
            <input
              type="text"
              value={editableAddress.country}
              onChange={(e) =>
                setEditableAddress({
                  ...editableAddress,
                  country: e.target.value,
                })
              }
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg p-2 mt-1"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onGetNewLocation}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Get New Location
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-[#25D366] hover:bg-[#20bd59] text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Confirm Address"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressConfirmModal;
