import { useState, useEffect } from "react";
import axios from "axios";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null); // ✅ Fix: Add state for expanded items

  useEffect(() => {
    axios.get("http://localhost:8080/api/issues/inventory")
      .then((response) => {
        setInventory(response.data);
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }, []);

  return (
    <div className="bg-white h-full flex-grow shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 Inventory List</h2>

      {/* Scrollable List */}
      <div className="space-y-4 max-h-[475px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
        {inventory.length === 0 ? (
          <p className="text-gray-600 text-center">No inventory issues found.</p>
        ) : (
          inventory.map((item) => (
            <div key={item.id} className="bg-blue-50 p-4 rounded-lg shadow-md">
              {/* Header Bar */}
              <div
                className="flex justify-between items-center cursor-pointer p-3 bg-blue-100 rounded-lg"
                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 text-sm font-semibold bg-purple-500 text-white rounded-lg">
                    {item.ticketNumber}
                  </span>
                  <p className="font-medium text-grey-800">{item.issueTitle}</p>
                  <p className="text-gray-600">({item.issuerName})</p>
                </div>

                {expandedItem === item.id ? (
                  <FiChevronUp className="text-xl text-blue-700" />
                ) : (
                  <FiChevronDown className="text-xl text-blue-700" />
                )}
              </div>

              {/* Expanded Hardware Details */}
              {expandedItem === item.id && (
                <div className="mt-4 bg-white p-3 rounded-lg border border-gray-300">
                  <p className="text-gray-700">
                    <strong>Device:</strong> {item.hardwareDetails.device}
                  </p>
                  <p className="text-gray-700">
                    <strong>Processor:</strong> {item.hardwareDetails.processor}
                  </p>
                  <p className="text-gray-700">
                    <strong>RAM:</strong> {item.hardwareDetails.ram}
                  </p>
                  <p className="text-gray-700">
                    <strong>Location:</strong> {item.hardwareDetails.location}
                  </p>
                  <p className="text-gray-700">
                    <strong>Owner:</strong> {item.hardwareDetails.owner}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryList;
