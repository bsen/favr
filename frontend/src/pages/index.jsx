import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NameModal from "../components/HomeComponents/Modals/NameModal";
import LocationModal from "../components/HomeComponents/Modals/LocationModal";
import AddressConfirmModal from "../components/HomeComponents/Modals/AddressConfirmModal";
import BottomNav from "../components/HomeComponents/BottomNav";
import PostCard from "../components/HomeComponents/PostCard";
import ProfileSection from "../components/HomeComponents/ProfileSection";

const SAMPLE_LISTINGS = [
  {
    id: 1,
    type: "offer",
    title: "Handyman Services",
    description:
      "Available for small repairs, furniture assembly, and general maintenance work. Experienced and reliable.",
    price: 25,
    distance: 0.8,
    author: "Mike Wilson",
    time: "10 mins ago",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 2,
    type: "request",
    title: "Need Help Moving Furniture",
    description:
      "Looking for someone to help move a couch and few boxes this weekend. Will pay for your time.",
    price: 50,
    distance: 1.2,
    author: "Sarah Chen",
    time: "25 mins ago",
  },
  {
    id: 3,
    type: "offer",
    title: "Fresh Homemade Cookies",
    description:
      "Baking chocolate chip and oatmeal raisin cookies. Can deliver within 2km radius.",
    price: 15,
    distance: 1.5,
    author: "Emma Baker",
    time: "1 hour ago",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 4,
    type: "request",
    title: "Dog Walker Needed",
    description:
      "Looking for someone to walk my friendly golden retriever 3 times a week.",
    price: 20,
    distance: 0.5,
    author: "James Lee",
    time: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 5,
    type: "offer",
    title: "Math Tutoring",
    description:
      "Experienced math teacher offering tutoring for high school students. Online or in-person.",
    price: 30,
    distance: 2.1,
    author: "Lisa Wang",
    time: "3 hours ago",
  },
];

const HomePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("feed");
  const [showNameModal, setShowNameModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAddressConfirmModal, setShowAddressConfirmModal] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [addressDetails, setAddressDetails] = useState(null);
  const [editableAddress, setEditableAddress] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [userData, setUserData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const checkAuth = async () => {
      if (
        typeof window !== "undefined" &&
        !localStorage.getItem("auth_token")
      ) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/user/details",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );
        const data = await response.json();

        if (data.user) {
          setUserData(data.user);
          setName(data.user.name || "");
          if (data.user.location) {
            setAddressDetails(data.user.location);
            setEditableAddress({
              address: data.user.location.address || "",
              city: data.user.location.city || "",
              state: data.user.location.state || "",
              postalCode: data.user.location.postalCode || "",
              country: data.user.location.country || "",
            });
          }
        }

        if (!data.user.name) {
          setShowNameModal(true);
        } else if (!data.user.location) {
          setShowLocationModal(true);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    checkAuth();
  }, [router]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/user/update-details",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUserData(data.user);
          setName(data.user.name);
        }
        setShowNameModal(false);
      }
    } catch (error) {
      console.error("Error updating name:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddressDetails = async (latitude, longitude) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/user/fetch-address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ latitude, longitude }),
        }
      );

      const data = await response.json();

      if (response.ok && data.addressDetails) {
        setAddressDetails(data.addressDetails);
        setEditableAddress({
          address: data.addressDetails.address,
          city: data.addressDetails.city,
          state: data.addressDetails.state,
          postalCode: data.addressDetails.postalCode,
          country: data.addressDetails.country,
        });
        setShowAddressConfirmModal(true);
        setShowLocationModal(false);
      } else {
        setLocationError("Failed to fetch address details. Please try again.");
      }
    } catch (error) {
      setLocationError(
        "Network error while fetching address. Please try again."
      );
    }
  };

  const getLocation = () => {
    setLoading(true);
    setLocationError("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          if (accuracy > 100) {
            setLocationError("Location accuracy is low. Please try again.");
            setLoading(false);
            return;
          }

          await fetchAddressDetails(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Please allow location access to continue.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out. Please try again.");
              break;
            default:
              setLocationError("An unknown error occurred. Please try again.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  const handleAddressConfirm = async () => {
    setLoading(true);
    try {
      const finalAddressDetails = {
        ...addressDetails,
        ...editableAddress,
      };

      const response = await fetch(
        "http://localhost:8000/api/v1/user/update-location",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ addressDetails: finalAddressDetails }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUserData(data.user);
          if (data.user.location) {
            setAddressDetails(data.user.location);
            setEditableAddress({
              address: data.user.location.address || "",
              city: data.user.location.city || "",
              state: data.user.location.state || "",
              postalCode: data.user.location.postalCode || "",
              country: data.user.location.country || "",
            });
          }
        }
        setShowAddressConfirmModal(false);
      } else {
        setLocationError("Failed to update location. Please try again.");
      }
    } catch (error) {
      setLocationError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userPhone");
    router.push("/login");
  };

  const handleGetNewLocation = () => {
    setShowAddressConfirmModal(false);
    setShowLocationModal(true);
  };

  const renderHeader = () => {
    if (activeTab === "feed" || activeTab === "browse") {
      return (
        <div className="bg-[#1e1e1e] sticky top-0 z-10 p-4 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-white text-xl font-bold">
              Favr
            </h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400">
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </button>
              <button className="p-2 text-gray-400">
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
              </button>
            </div>
          </div>
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide  -mx-4 px-4">
            <style jsx>{`
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-[#25D366] text-white"
                  : "bg-[#2a2a2a] text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory("requests")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === "requests"
                  ? "bg-[#25D366] text-white"
                  : "bg-[#2a2a2a] text-gray-300"
              }`}
            >
              Requests
            </button>
            <button
              onClick={() => setSelectedCategory("offers")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === "offers"
                  ? "bg-[#25D366] text-white"
                  : "bg-[#2a2a2a] text-gray-300"
              }`}
            >
              Offers
            </button>
            <button
              onClick={() => setSelectedCategory("services")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === "services"
                  ? "bg-[#25D366] text-white"
                  : "bg-[#2a2a2a] text-gray-300"
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setSelectedCategory("items")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === "items"
                  ? "bg-[#25D366] text-white"
                  : "bg-[#2a2a2a] text-gray-300"
              }`}
            >
              Items
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
      case "browse":
        return (
          <div className="space-y-4">
            {SAMPLE_LISTINGS.map((listing) => (
              <PostCard key={listing.id} {...listing} />
            ))}
          </div>
        );
      case "messages":
        return (
          <div className="p-4 text-white text-center">
            <h2 className="text-xl font-semibold mb-2">Messages</h2>
            <p className="text-gray-400">No messages yet</p>
          </div>
        );
      case "profile":
        return (
          <ProfileSection
            name={name}
            userData={userData}
            onUpdateName={() => setShowNameModal(true)}
            onUpdateLocation={() => setShowLocationModal(true)}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      {renderHeader()}
      <main className="p-4 pb-20">{renderContent()}</main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <NameModal
        show={showNameModal}
        name={name}
        setName={setName}
        loading={loading}
        onSubmit={handleUpdateName}
      />

      <LocationModal
        show={showLocationModal}
        loading={loading}
        locationError={locationError}
        onGetLocation={getLocation}
      />

      <AddressConfirmModal
        show={showAddressConfirmModal}
        loading={loading}
        locationError={locationError}
        editableAddress={editableAddress}
        setEditableAddress={setEditableAddress}
        onGetNewLocation={handleGetNewLocation}
        onConfirm={handleAddressConfirm}
      />
    </div>
  );
};

export default HomePage;
