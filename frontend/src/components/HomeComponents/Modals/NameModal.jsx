import React from "react";

const NameModal = ({ show, name, setName, loading, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-white text-xl mb-4">Please Enter Your Name</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg p-2 mb-4"
            placeholder="Enter your name"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#25D366] hover:bg-[#20bd59] text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Name"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameModal;
