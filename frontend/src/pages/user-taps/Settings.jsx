import React from "react";

const Settings = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-300 flex flex-col items-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Settings</h2>
        
        <div className="relative">
          {/* Image with subtle animation */}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyytbMkZGFf5UOz-VvfElGKcCDtBu4Otxbyw&s"
            alt="Settings Placeholder"
            className="w-80 h-80 object-cover rounded-xl shadow-lg transform transition-all hover:scale-105"
          />
        </div>

        {/* Floating animated effect */}
        <div className="bg-primary text-white text-sm px-40 py-4 my-4 flex items-center justify-center rounded-full animate-pulse">
          Coming Soon...
        </div>
      </div>
    </div>
  );
};

export default Settings;
