import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FiPlus, FiEdit } from "react-icons/fi";
import { FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader"; // Import spinner

export const statusColors = {
  Pending: "bg-yellow-500",
  "Under Processing": "bg-blue-500",
  Closed: "bg-green-500",
};

const MyIssues = ({ user }) => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [currentIssue, setCurrentIssue] = useState(null);
    
    useEffect(() => {
        const fetchIssues = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/issues/user/${user.email}`);
            setIssues(response.data);
        } catch (error) {
            console.error("Error fetching issues:", error);
            toast.error("Failed to load issues.");
        } finally {
            setLoading(false);
        }
        };
    
        fetchIssues();
    }, [user]);
    
    const handleAddIssue = async () => {
        if (!newTitle.trim() || !newDescription.trim()) {
            toast.error("Both title and description are required!");
            return;
        }
    
        setLoading(true); // Start loading
    
        try {
            const response = await axios.post("http://localhost:8080/api/issues", {
                title: newTitle,
                description: newDescription,
                userName: user.name,
                userEmail: user.email,
                ticketNumber: user.ticketNumber,
                status: "Pending",
            });
    
            console.log("Response from backend:", response.data); // Debugging log
    
            if (response.data) {
                setIssues((prevIssues) => Array.isArray(prevIssues) ? [...prevIssues, response.data] : [response.data]);
                toast.success("Issue added successfully!");
                resetForm();
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            console.error("Error adding issue:", error);
            toast.error(error.response?.data?.message || "Failed to add issue.");
        } finally {
            setLoading(false); // Stop loading after request completes
        }
    };    
    
    const handleUpdateIssue = async () => {
        if (!newTitle.trim() || !newDescription.trim()) {
        toast.error("Both title and description are required!");
        return;
        }
    
        try {
        await axios.put(`http://localhost:8080/api/issues/${currentIssue._id}`, {
            title: newTitle,
            description: newDescription,
        });
    
        setIssues(
            issues.map((issue) =>
            issue._id === currentIssue._id ? { ...issue, title: newTitle, description: newDescription } : issue
            )
        );
        toast.success("Issue updated successfully!");
        } catch (error) {
        console.error("Error updating issue:", error);
        toast.error("Failed to update issue.");
        }
        resetForm();
    };
    
    const resetForm = () => {
        setShowModal(false);
        setNewTitle("");
        setNewDescription("");
        setEditMode(false);
    };
    
    const openEditModal = (issue) => {
        setCurrentIssue(issue);
        setNewTitle(issue.title);
        setNewDescription(issue.description);
        setEditMode(true);
        setShowModal(true);
    };
    
    return (
        <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Issues</h2>
    
            <button
                onClick={() => {
                    setEditMode(false);
                    setCurrentIssue(null);
                    setNewTitle("");
                    setNewDescription("");
                    setShowModal(true);
                    handleAddIssue;
                }}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primaryDark"} text-white`}
                disabled={loading} // Disable button while loading
                >
                {loading ? "Adding..." : "Add New Issue"}
                {loading ? <ClipLoader color="#fff" size={20} /> : <FiPlus />}
                {/* className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" */}
                {/* > */}
                {/* <FiPlus /> Add New Issue */}
            </button>

        </div>
    
        {loading ? (
            <p>Loading issues...</p>
        ) : issues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
                <IssueCard key={issue._id} issue={issue} onEdit={() => openEditModal(issue)} />
            ))}
            </div>
        ) : (
            <p>No issues reported yet.</p>
        )}
    
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4">{editMode ? "Edit Issue" : "Add Issue"}</h2>
                <input
                type="text"
                className="w-full p-2 border rounded-lg mb-3"
                placeholder="Issue Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea
                className="w-full p-3 border rounded-lg mb-4"
                placeholder="Describe your issue..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                ></textarea>
                <div className="flex justify-between">
                {editMode ? (
                    <button
                    onClick={handleUpdateIssue}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark"
                    >
                    Update
                    </button>
                ) : (
                    <button
                    onClick={handleAddIssue}
                    // className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primaryDark"} text-white`}
                    disabled={loading} // Disable button while loading
                    >
                    {loading ? "Submiting..." : "Submit"}
                    {loading ? <ClipLoader color="#fff" size={20} /> : <></>}

                    </button>
                )}
                <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
                >
                    Cancel
                </button>
                </div>
            </div>
            </div>
        )}
        </main>
    );
    };
    
    const IssueCard = ({ issue, onEdit }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-300 transition-all hover:shadow-xl">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{issue.title}</h3>
            <span className="px-3 py-1 text-sm font-semibold bg-purple-500 text-white rounded-lg">
            {issue.ticketNumber}
            </span>
        </div>
    
        <p className="text-gray-600 text-sm mb-3 truncate">{issue.description}</p>
    
        <div className="flex justify-between items-center mt-3">
            <p
            className={`px-3 py-1 text-sm font-semibold text-white rounded-lg flex items-center gap-1 ${
                statusColors[issue.status]
            }`}
            >
            {issue.status === "Under Processing" && <FaSpinner />}
            {issue.status === "Closed" && <FaCheckCircle />}
            {issue.status === "Pending" && <FaTimesCircle />}
            {issue.status}
            </p>
            <button
            onClick={onEdit}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primaryDark transition-all"
            >
            <FiEdit className="text-lg" />
            </button>
        </div>
        </div>
    );
};     

export default MyIssues;
