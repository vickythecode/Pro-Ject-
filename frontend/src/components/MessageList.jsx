import { useEffect, useState } from "react";

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/contact", {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(`http://localhost:4000/api/contact/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to delete message");

      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading)
    return <p className="text-gray-300 text-center mt-4">Loading messages...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>

      {messages.length === 0 ? (
        <p className="text-gray-400 text-center">No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="w-full">
                  <h3 className="text-lg font-semibold text-white">{msg.subject}</h3>
                  <p className="text-sm text-gray-400">
                    From: <span className="text-gray-300 font-medium">{msg.user.name}</span> ({msg.user.email})
                  </p>
                  <p className="mt-2 text-gray-300">{msg.message}</p>
                </div>
                <button
                  onClick={() => deleteMessage(msg._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 mt-3 sm:mt-0 sm:ml-4 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesList;
