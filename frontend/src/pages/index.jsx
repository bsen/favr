import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const HomePage = () => {
  const router = useRouter();
  const [showNameModal, setShowNameModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

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
        setShowNameModal(false);
      }
    } catch (error) {
      console.error("Error updating name:", error);
    } finally {
      setLoading(false);
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

          try {
            const response = await fetch(
              "http://localhost:8000/api/v1/user/update-location",
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
                body: JSON.stringify({ latitude, longitude }),
              }
            );

            if (response.ok) {
              setShowLocationModal(false);
            } else {
              setLocationError("Failed to update location. Please try again.");
            }
          } catch (error) {
            setLocationError("Network error. Please try again.");
          } finally {
            setLoading(false);
          }
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

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userPhone");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="bg-[#1e1e1e] p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Home Page</h1>
        <button
          onClick={handleLogout}
          className="bg-[#25D366] hover:bg-[#20bd59] text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </header>

      <main className="p-4">
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-4 text-white">
          <h2 className="text-xl mb-2">Welcome to your account</h2>
          <p className="text-gray-400">You are successfully logged in!</p>
        </div>
      </main>

      {/* Name Update Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-white text-xl mb-4">Please Enter Your Name</h2>
            <form onSubmit={handleUpdateName}>
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
      )}

      {/* Location Update Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-white text-xl mb-4">
              Location Access Required
            </h2>
            <p className="text-gray-400 mb-4">
              Please allow access to your location to continue using the app.
            </p>
            {locationError && (
              <div className="bg-red-900/30 text-red-400 p-3 rounded-md mb-4 border border-red-800">
                {locationError}
              </div>
            )}
            <button
              onClick={getLocation}
              disabled={loading}
              className="w-full bg-[#25D366] hover:bg-[#20bd59] text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "Getting Location..." : "Share Location"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
