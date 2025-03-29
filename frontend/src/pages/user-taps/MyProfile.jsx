import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FiEdit, FiSave, FiX } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const MyProfile = ({ user }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Default profile picture
  const defaultProfilePic = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setProfilePic(user.profilePic || defaultProfilePic);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Both name and email are required!");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:8080/api/users/${user._id}`, {
        name,
        email,
      });

      toast.success("Profile updated successfully! Relogin to see changes.");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-lg border border-gray-300">
        <h2 className="text-2xl font-semibold text-center mb-6">My Profile</h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={profilePic || defaultProfilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
        </div>

        {/* Full Name Input */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">Full Name</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editMode}
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">Email Address</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editMode}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-4 gap-4">
          {!editMode ? (
            <button
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark"
              onClick={() => setEditMode(true)}
            >
              <FiEdit /> Edit Profile
            </button>
          ) : (
            <>
              <button
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FiSave />} Save Changes
              </button>

              <button
                className="flex items-center gap-2 px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                onClick={() => setEditMode(false)}
              >
                <FiX /> Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;