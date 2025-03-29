import { useState } from "react";
import { FaSearch, FaChevronUp, FaChevronDown } from "react-icons/fa";

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I create a support ticket?",
      answer: "Go to the 'Tickets in Queue' section, click on 'New Ticket', and fill in the details.",
    },
    {
      question: "How can I check my ticket status?",
      answer: "Navigate to 'Tickets in Queue' and find your ticket number. The status is displayed next to it.",
    },
    {
      question: "What should I do if my issue is not resolved?",
      answer: "You can update your ticket with more details or contact an engineer via 'Connect with User'.",
    },
    {
      question: "How do I report hardware issues?",
      answer: "Use the 'Inventory List' section to find your device and report an issue related to it.",
    },
    {
      question: "Can I reopen a closed ticket?",
      answer: "Yes, go to 'Tickets in Queue', find the closed ticket, and click on 'Reopen'.",
    },
    {
      question: "How long does it take to resolve an issue?",
      answer: "The resolution time varies, but critical issues are addressed within 24 hours.",
    },
    {
      question: "Who can access my support tickets?",
      answer: "Only authorized personnel and admins have access to view your tickets.",
    },
    {
      question: "How do I update my contact details?",
      answer: "Go to 'Settings' in your profile and update your contact details.",
    },
    {
      question: "What happens if I don't respond to a support request?",
      answer: "Your ticket may be closed due to inactivity. You can reopen it if needed.",
    },
  ];

  return (
    // <div className="p-6 min-h-300 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center">
    <div className="p-6 shadow-lg h-full flex-grow bg-white flex flex-col items-center rounded-xl">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">📚 Knowledge Base</h2>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg mb-6">
        <input
          type="text"
          placeholder="Search for FAQs..."
          className="w-full p-3 pl-10 text-gray-700 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-3 text-gray-500" />
      </div>

      {/* FAQs Section (Scrollable) */}
      <div className="w-full max-w-3xl bg-blue-50 p-6 rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto">
        <h3 className="text-xl font-semibold text-primaryDark mb-4">Frequently Asked Questions</h3>
        
        {faqs
          .filter((faq) => faq.question.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className="w-full text-left text-lg font-medium text-gray-800 flex justify-between items-center p-4 bg-white rounded-lg shadow-sm transition-all hover:bg-primaryLight hover:text-white"
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
              >
                {faq.question}
                {expandedFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {expandedFAQ === index && (
                <div className="mt-2 p-4 bg-white text-primary rounded-lg shadow-md transition-all">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;
