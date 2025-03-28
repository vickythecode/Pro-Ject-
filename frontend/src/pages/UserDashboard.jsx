import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_backendUrl

const UserDashboard = () => {
  const { user, loading, handleLogout } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    profilePic: "",
    bio: "",
    skills: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [user, loading]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUserData(data);
      setFormData({
        name: data.name,
        profilePic: data.profilePic || "",
        bio: data.bio || "",
        skills: data.skills ? data.skills.join(", ") : "",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/api/auth/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(",").map((skill) => skill.trim()),
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();
      setUserData(updatedUser.user);
      setEditMode(false);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading)
    return (
      <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        Loading...
      </p>
    );

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center px-4 sm:px-8 lg:px-16 py-10 transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-3xl font-bold text-center mb-6">User Dashboard</h2>

      <div
        className={`w-full max-w-4xl p-6 shadow-md rounded-lg transition-all ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {error && <p className="text-red-500 text-center">{error}</p>}

        {userData ? (
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="flex items-center gap-6">
              {userData.profilePic ? (
                <img
                  src={userData.profilePic}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full text-xl font-bold ${
                    darkMode ? "bg-blue-400 text-gray-900" : "bg-blue-500 text-white"
                  }`}
                >
                  {userData.name[0]}
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold">{userData.name}</h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {userData.email}
                </p>
                <p className="text-sm text-gray-500">Role: {userData.role}</p>
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <h4 className="text-lg font-semibold">Bio:</h4>
              <p
                className={`text-md italic ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {userData.bio || "No bio available."}
              </p>
            </div>

            {/* Skills Section */}
            <div>
              <h4 className="text-lg font-semibold">Skills:</h4>
              {userData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-500 text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills added.</p>
              )}
            </div>

            {/* Edit Profile Section */}
            {editMode ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <label className="block">
                  <span>Name:</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span>Profile Picture URL:</span>
                  <input
                    type="text"
                    name="profilePic"
                    value={formData.profilePic}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span>Bio:</span>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </label>

                <label className="block">
                  <span>Skills (comma-separated):</span>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </label>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditMode(false)} className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition mt-2">
                  Cancel
                </button>
              </form>
            ) : (
              <button onClick={() => setEditMode(true)} className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Edit Profile
              </button>
            )}

            <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
