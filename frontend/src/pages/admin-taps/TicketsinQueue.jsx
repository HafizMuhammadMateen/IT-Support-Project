import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react"; // ✅ For managing state and fetching data
import axios from "axios"; // ✅ For making API requests
import { FiChevronDown, FiChevronUp, FiTag, FiSend } from "react-icons/fi"; // ✅ Icons used in the UI
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaSearch } from "react-icons/fa"; // ✅ Status icons

const TicketsinQueue = () => {
  const [issues, setIssues] = useState([]);
  const [expandedIssue, setExpandedIssue] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // 🔹 Define state

  useEffect(() => {
    axios.get("http://localhost:8080/api/issues")
      .then((response) => setIssues(response.data))
      .catch((error) => console.error("Error fetching issues:", error));
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/issues");
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
      toast.error("Failed to load issues.");
    }
  };

  const updateIssueStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/issues/${id}/status`, { status: newStatus });

      if (response.status === 200) {
        toast.success(`Status updated to "${newStatus}"`);
        fetchIssues(); // Refresh the list after updating
      } else {
        toast.error("Failed to update issue status");
      }
    } catch (error) {
      console.error("Error updating issue status:", error);
      toast.error("Error updating issue status");
    }
  };

  const sendEmail = async (to, subject, text) => {
    try {
      const response = await fetch("http://localhost:8080/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, text }), // Send dynamic text
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (response.ok) {
        toast.success("Email sent successfully!");
        setReplyText(""); // Clear input field after sending
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Email request failed:", error);
      toast.error("Failed to send email.");
    }
  };
  
  const statusColors = {
    "Under Processing": "bg-blue-500",
    Closed: "bg-green-500",
    Pending: "bg-yellow-500",
  };

  return (
    <div className="bg-white h-full flex-grow shadow-lg rounded-xl p-6 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🎫 Tickets in Queue</h2>

      {/* Filters Row */}
      <div className="flex justify-between items-center w-full my-4">
        
        {/* Search Bar (Left) */}
        <div className="flex items-center border border-gray-300 rounded-lg shadow-md overflow-hidden w-1/3">
          <span className="bg-gray-200 text-gray-700 px-3 py-2 font-semibold">TKT-</span>
          <input
            type="text"
            placeholder="Enter Ticket Number..."
            className="w-full p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter (Right) */}
        <div className="flex items-center border border-gray-300 rounded-lg shadow-md overflow-hidden w-1/3">
          <span className="bg-gray-200 text-gray-700 px-3 py-2 font-semibold">Status:</span>
          <select
            className="w-full p-2 text-gray-700 focus:outline-none focus:border-l-2 focus:border-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Under Processing">Under Processing</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

      </div>

      {/* Scrollable Issues List */}
      <div className="space-y-6 max-h-[425px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200 p-2">
        {issues.length === 0 ? (
            <p className="text-gray-600 text-center">No issues found.</p>
          ) : (
            issues
            .filter((issue) => {
              // Ticket Number Filter
              const ticketNumber = issue.ticketNumber.replace("TKT-", ""); 
              const ticketMatch = /^\d{6}$/.test(ticketNumber) && ticketNumber.includes(searchTerm);
          
              // Status Filter (if selectedStatus is empty, show all issues)
              const statusMatch = selectedStatus ? issue.status === selectedStatus : true;
          
              return ticketMatch && statusMatch;
            })
            .map((issue) => (
            <div key={issue._id} className="bg-blue-50 p-4 rounded-lg shadow-md">
              {/* Issue Header */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedIssue(expandedIssue === issue._id ? null : issue._id)}
              >
                <p className="font-medium text-gray-800">{issue.title}</p>

                <span className="px-3 py-1 text-sm font-semibold bg-purple-500 text-white rounded-lg">
                  {issue.ticketNumber}
                </span>

                {/* Status */}
                <p className={`px-3 py-1 text-sm font-semibold text-white rounded-lg flex items-center gap-1 ${statusColors[issue.status]}`}>
                  {issue.status === "Under Processing" && <FaSpinner />}
                  {issue.status === "Closed" && <FaCheckCircle />}
                  {issue.status === "Pending" && <FaTimesCircle />}
                  {issue.status}
                </p>

                {expandedIssue === issue._id ? (
                  <FiChevronUp className="text-xl text-blue-700" />
                ) : (
                  <FiChevronDown className="text-xl text-blue-700" />
                )}
              </div>

              {/* Expanded Issue Details */}
              {expandedIssue === issue._id && (
                <div className="mt-4 bg-white p-3 rounded-lg border border-gray-300">
                  <p className="text-gray-700"><strong>User Name:</strong> {issue.userName}</p>
                  <p className="text-gray-700"><strong>Email:</strong> {issue.userEmail}</p>
                  <p className="text-gray-700"><strong>Reported Issue:</strong> {issue.description}</p>

                  {/* Status Update Buttons */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 h-10 flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition duration-200"
                        onClick={() => updateIssueStatus(issue._id, "Pending")}
                      >
                        <FaTimesCircle /> Pending
                      </button>

                      <button
                        className="px-3 py-1 h-10 flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition duration-200"
                        onClick={() => updateIssueStatus(issue._id, "Under Processing")}
                      >
                        <FaSpinner /> Under Processing
                      </button>

                      <button
                        className="px-3 py-1 h-10 flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition duration-200"
                        onClick={() => updateIssueStatus(issue._id, "Closed")}
                      >
                        <FaCheckCircle /> Closed
                      </button>
                    </div>

                    {/* View Asset Tag Button */}
                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className="px-4 py-1 h-10 flex items-center gap-2 bg-primary hover:bg-primaryDark text-white font-semibold rounded-lg shadow-md transition duration-100"
                    >
                      <FiTag /> View Asset Tag
                    </button>
                  </div>

                  {/* Reply Box */}
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)} // Update state dynamically
                    />
                    
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition duration-200"
                      onClick={() => sendEmail(issue.userEmail, "Your issue has been Updated!", replyText)}
                    > 
                      <FiSend className="text-lg" /> Send 
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {/* Asset Tag Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold">Hardware Details</h3>
            <p><strong>Brand:</strong> {selectedIssue.hardwareInfo.brand}</p>
            <p><strong>CPU:</strong> {selectedIssue.hardwareInfo.CPU}</p>
            <p><strong>RAM:</strong> {selectedIssue.hardwareInfo.RAM}</p>
            <p><strong>Location:</strong> {selectedIssue.hardwareInfo.location}</p>
            <p><strong>Owner:</strong> {selectedIssue.hardwareInfo.owner}</p>

            <button
              onClick={() => setSelectedIssue(null)}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsinQueue;