import { FiLogOut, FiUser, FiClipboard, FiSettings } from "react-icons/fi";

const Sidebar = ({ user, handleLogout, activeTab, setActiveTab }) => {
  const menuItems = [
    { icon: <FiClipboard />, text: "My Issues" },
    { icon: <FiUser />, text: "My Profile" },
    { icon: <FiSettings />, text: "Settings" },
  ];

  // Default dummy profile image
  const defaultProfilePic = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

  return (
    <aside className="w-64 bg-primary text-white p-6 fixed h-screen flex flex-col justify-between">
      <div>
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.profilePic || defaultProfilePic}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <h2 className="text-xl font-bold mt-2">{user.name}</h2>
          <p className="text-sm text-gray-300">{user.email}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col space-y-4">
          {menuItems.map(({ icon, text }) => (
            <button
              key={text}
              onClick={() => setActiveTab(text)}
              className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition 
                ${activeTab === text ? "bg-blue-700 text-white" : "hover:bg-primaryDark hover:text-white"}`}
            >
              {icon} <span>{text}</span>
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
  );
};

export default Sidebar;