import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password);
    navigate("/login");
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-lg w-full max-w-md transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800 text-white shadow-gray-700"
            : "bg-white text-gray-900 shadow-gray-300"
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition duration-200 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-400"
                  : "bg-gray-100 border-gray-300 text-black focus:ring-gray-500"
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition duration-200 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-400"
                  : "bg-gray-100 border-gray-300 text-black focus:ring-gray-500"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition duration-200 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-400"
                  : "bg-gray-100 border-gray-300 text-black focus:ring-gray-500"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-3 rounded-lg text-lg font-semibold transition duration-300 bg-gradient-to-r from-green-500 to-green-700 text-white hover:opacity-90"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-green-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
