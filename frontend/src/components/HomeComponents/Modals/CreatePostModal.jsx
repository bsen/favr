import React, { useState } from "react";

const CreatePostModal = ({ show, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "offer",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1e1e1e] rounded-lg w-full max-w-md p-6">
        <h2 className="text-white text-xl font-bold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Type</label>
              <select
                className="w-full bg-[#2a2a2a] text-white rounded p-2"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="offer">Offer</option>
                <option value="request">Request</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Title</label>
              <input
                type="text"
                className="w-full bg-[#2a2a2a] text-white rounded p-2"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                className="w-full bg-[#2a2a2a] text-white rounded p-2"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">
                Price (optional)
              </label>
              <input
                type="number"
                className="w-full bg-[#2a2a2a] text-white rounded p-2"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#25D366] text-white rounded hover:bg-[#1ea855]"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
