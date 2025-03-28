import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { io } from "socket.io-client";
const backendUrl = import.meta.env.VITE_backendUrl

const socket = io(backendUrl);

const Navbar = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const response = await fetch(`${backendUrl}/api/notifications`, {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    };

    fetchNotifications();

    socket.emit("join", user._id);
    socket.on("newNotification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user]);

  return (
    <nav
      className={`p-4 shadow-md transition-all duration-300 ${
        darkMode ? "bg-white text-gray-900" : "bg-gray-800 text-white"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Pro-Ject
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          {user ? (
            <>
              <NavItem to="/">Dashboard</NavItem>
              <NavItem to="/profile">Profile</NavItem>
              <NavItem to="/projects">Projects</NavItem>
              <NavItem to="/todo">Todo</NavItem>
              <NavItem to="/admin">Admin</NavItem>

              {/* Notifications */}
              <div className="relative">
                <Link to="/notifications" className="text-xl">
                  🔔
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 text-xs">
                      {notifications.length}
                    </span>
                  )}
                </Link>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Logout
              </button>   
            </>
          ) : (
            <>
              <NavItem to="/login">Login</NavItem>
              <NavItem to="/register">Sign up</NavItem>
            </>
          )}
        </ul>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg transition-all"
        >
          {darkMode ? "🌞" : "🌙"}
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="flex flex-col bg-gray-800 p-4 text-white rounded-lg">
          {user ? (
            <>
              <NavItem to="/" onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavItem>
              <NavItem to="/profile" onClick={() => setMenuOpen(false)}>
                Profile
              </NavItem>
              <NavItem to="/projects" onClick={() => setMenuOpen(false)}>
                Projects
              </NavItem>
              <NavItem to="/todo" onClick={() => setMenuOpen(false)}>
                Todo
              </NavItem>
              <NavItem to="/admin" onClick={() => setMenuOpen(false)}>
                Admin
              </NavItem>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 mt-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </NavItem>
              <NavItem to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </NavItem>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Reusable NavItem Component
const NavItem = ({ to, children, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 rounded-md hover:bg-gray-700 hover:text-white transition-all"
    >
      {children}
    </Link>
  );
};

export default Navbar;
