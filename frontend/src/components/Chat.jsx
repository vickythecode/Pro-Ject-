import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useTheme } from "../context/ThemeContext";

const socket = io("http://localhost:4000");

const Chat = ({ projectId, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);
  const {darkMode} = useTheme()

  useEffect(() => {
    if (!projectId) {
      console.error("Error: projectId is undefined!");
      return;
    }

    fetch("http://localhost:4000/api/chats/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ projectId }),
    })
      .then(() =>
        fetch(`http://localhost:4000/api/chats/${projectId}`, { credentials: "include" })
      )
      .then((res) => res.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : data.messages || []);
      })
      .catch((err) => console.error("Error fetching messages:", err));

    socket.emit("joinChat", projectId);

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket.off("receiveMessage");
  }, [projectId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!user || !user.name) {
      console.error("Error: user is undefined or missing name!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/chats/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ projectId, text: newMessage, sender: user.name }),
      });

      const messageData = await res.json();
      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      className={`max-w-2xl mx-auto p-4 rounded-lg shadow-lg flex flex-col h-[80vh] border 
        ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-gray-300"}`
      }
    >
      <h2 className="text-xl font-semibold text-center mb-4">Chat</h2>
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-3 rounded-lg 
          ${darkMode ? "bg-gray-800" : "bg-gray-100"}`
        }
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 max-w-[75%] rounded-lg break-words 
                ${msg.sender === user.name ? "bg-blue-500 text-white ml-auto" : darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`
              }
            >
              <div className="text-sm font-semibold">{msg.sender || "Unknown"}</div>
              <p className="text-md">{msg.text}</p>
              <span className={`text-xs  block text-right ${darkMode?"text-gray-100":"text-gray-500"}`}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Field */}
      <div className="flex gap-2 mt-4 flex-wrap">
  <input
    type="text"
    className={`flex-1 min-w-0 px-3 py-2 rounded-lg focus:outline-none border 
      ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-200 text-black border-gray-300"}`}
    placeholder="Type a message..."
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
  />
  <button
    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-fit"
    onClick={sendMessage}
  >
    Send
  </button>
</div>
    </div>
  );
};


export default Chat;
