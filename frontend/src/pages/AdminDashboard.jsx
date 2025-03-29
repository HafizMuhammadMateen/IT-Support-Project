import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiList, FiBox, FiBook, FiLogOut } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import KnowledgeBase from "./admin-taps/KnowledgeBase";
import InventoryList from "./admin-taps/InventoryList";
import TicketsinQueue from "./admin-taps/TicketsinQueue";
import React from "react";

const menuItems = [
  { name: "Tickets in Queue", icon: <FiList /> },
  { name: "Inventory List", icon: <FiBox /> },
  { name: "Knowledge Base", icon: <FiBook /> },
];

// Default Profile Picture
const defaultProfilePic = "https://icon-library.com/images/admin-icon/admin-icon-10.jpg";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Tickets in Queue");
  const [user, setUser] = useState({ name: "Admin", profilePic: defaultProfilePic });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        name: storedUser.name || "Admin",
        profilePic: storedUser.profilePic || defaultProfilePic,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.clear(); 
    // setTimeout(() => {
    //     window.location.reload();
    // }, 100);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-50 p-6 fixed h-screen flex flex-col justify-between">
        <div>
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-white"
            />
            <h2 className="text-xl font-bold mt-2">{user.name}</h2>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex flex-col space-y-4">
            {menuItems.map(({ name, icon }) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition 
                  ${activeTab === name ? "bg-primary text-white" : "text-gray-700 hover:bg-primaryLight hover:text-white"}`}
              >
                {icon} <span>{name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 bg-gray-100 ml-64">
        {activeTab === "Tickets in Queue" && <TicketsinQueue />}
        {activeTab === "Inventory List" && <InventoryList />}
        {activeTab === "Knowledge Base" && <KnowledgeBase />}
      </main>
    </div>
  );
};

export default AdminDashboard;
