// Loading added
import React, { useState, useEffect } from "react";
import axios from "axios";

const HardwareConfig = () => {
  const [hardwareList, setHardwareList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHardware = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/hardware");
        setHardwareList(response.data);
      } catch (error) {
        console.error("Error fetching hardware:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHardware();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Hardware Description</h2>
      
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Device Name</th>
              <th className="border border-gray-300 p-2">Specifications</th>
            </tr>
          </thead>
          <tbody>
            {hardwareList.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border border-gray-300 p-2">{item.id}</td>
                <td className="border border-gray-300 p-2">{item.name}</td>
                <td className="border border-gray-300 p-2">{item.specs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HardwareConfig;
