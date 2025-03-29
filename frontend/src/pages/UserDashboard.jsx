import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MyIssues from "./user-taps/MyIssues";
import MyProfile from "./user-taps/MyProfile";
import Settings from "./user-taps/Settings";
import Sidebar from "./user-taps/sidebar";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("My Issues"); // Default to My Issues

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // 🔹 Clear cache before storing new data
    localStorage.removeItem("user");
    localStorage.clear(); 
    //  setTimeout(() => {
    //      window.location.reload();
    //     }, 100);
    window.location.reload();
    toast.success("Logged out successfully!");
    navigate("/");
  }; 

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} handleLogout={handleLogout} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-8 ml-64">
        {activeTab === "My Issues" && <MyIssues user={user} />}
        {activeTab === "My Profile" && <MyProfile user={user} />}
        {activeTab === "Settings" && <Settings user={user} />}
      </div>
    </div>
  );
};

export default UserDashboard;
