import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationAlert, setNotificationAlert] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotificationAlert({ message, type });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotificationAlert(null);
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notificationAlert && (
        <Notification message={notificationAlert.message} type={notificationAlert.type} />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

// Improved Notification Component with Better UI
const Notification = ({ message, type }) => {
  return (
    <div className="fixed bottom-5 right-5 flex items-center gap-3 bg-opacity-90 p-4 rounded-lg shadow-lg 
      animate-slide-up transition-transform duration-300"
      style={{
        backgroundColor: type === "success" ? "#4CAF50" : "#FF4C4C",
        color: "white",
      }}
    >
      {/* Icon based on type */}
      {type === "success" ? (
        <span className="text-white text-lg">✅</span>
      ) : (
        <span className="text-white text-lg">⚠️</span>
      )}

      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
};
