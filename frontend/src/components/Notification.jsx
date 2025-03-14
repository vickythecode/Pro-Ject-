import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // Importing theme context

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useTheme(); // Get dark mode state
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/notifications", {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Remove notification after marking as read
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`w-full min-h-screen flex flex-col items-center p-6 transition-all duration-300 
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}
    `}>
      <div className="w-full max-w-4xl bg-opacity-90 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          Notifications {unreadCount > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 text-sm rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>

        {error && <p className="text-red-400">{error}</p>}

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No new notifications</p>
        ) : (
          <div className="w-full space-y-4">
            {notifications.map((notif) => (
              <div key={notif._id} className={`w-full flex flex-col md:flex-row justify-between items-center p-4 rounded-lg shadow-md transition-all duration-200
                ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-200"}
              `}>
                <span className={`text-lg ${notif.read ? "text-gray-400" : "font-semibold"}`}>
                  {notif.message}
                </span>

                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif._id)}
                    className="mt-3 md:mt-0 bg-blue-500 hover:bg-blue-600 px-4 py-2 text-sm rounded-md text-white transition-all"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
