import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // Import ThemeContext
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const { darkMode } = useTheme(); // Get dark mode state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/dashboard");
  };

  return (
    <div
      className={`flex items-center justify-center h-screen w-full transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`p-8 rounded-xl shadow-lg w-full max-w-md transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 focus:ring-gray-500"
                : "bg-white text-gray-800 border-gray-300 focus:ring-blue-500"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 focus:ring-gray-500"
                : "bg-white text-gray-800 border-gray-300 focus:ring-blue-500"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className={`w-full p-3 rounded-lg font-semibold transition-all ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link
            to={"/register"}
            className={`hover:underline ${
              darkMode ? "text-gray-300" : "text-blue-500"
            }`}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
