import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";

const Projects = () => {
  const { user, loading } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const { darkMode } = useTheme();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [deadline, setDeadline] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else {
      fetchProjects();
      fetchUsers();
    }
  }, [user, loading]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/projects", {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      const userProjects = data.filter((project) => project.team.some((member) => member._id === user._id));
      setProjects(userProjects);
      setFilteredProjects(userProjects);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = (query) => {
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth", {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch users");
      setUsers(await response.json());
    } catch (error) {
      setError(error.message);
    }
  };

  const createProject = async () => {
    if (!user || !name || !description || !deadline) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/projects/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, description,deadline }),
      });

      if (response.ok) {
        fetchProjects();
        setName("");
        setDescription("");
        setDeadline("")
        showNotification("Project created successfully!", "success");
      } else {
        setError("Failed to create project");
        showNotification("Failed to create project!", "failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const addTeamMember = async () => {
    if (!user || !projectName || !selectedUser) {
      setError("Please select a project and user.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/projects/add-member", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ projectName, userName: selectedUser }),
      });

      if (response.ok) {
        fetchProjects();
        setProjectName("");
        setSelectedUser("");
        showNotification("Team member added !", "success");
      } else {
        setError("Failed to add team member");
        showNotification("Failed to add team member", "Failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteProject = async (projectId) => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:4000/api/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) fetchProjects();
      else setError("Failed to delete project");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p className="text-center text-xl font-semibold">Loading...</p>;

  return (
    <div className={`container mx-auto p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <h1 className="text-3xl font-bold text-center mb-6">📌 Your Projects</h1>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Display Projects */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div 
            key={project._id} 
            className={`p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
            }`}
          >
            <h3 className={`text-xl font-semibold text-gray-800 ${darkMode?"text-white":""}`}>{project.name}</h3>
            <p className={`${darkMode?"text-gray-300":"text-gray-600"}`}>{project.description}</p>
            <p className={`text-sm mt-2 ${darkMode?"text-gray-300":"text-gray-500"}`}>👤 {project.team.length} members</p>
            <p className={`"text-sm mt-2 ${darkMode?"text-gray-300":"text-gray-500"}`}>📅 Deadline: {project.deadline ? project.deadline.split("T")[0] : "Not defined"}</p>

            <div className="flex justify-between items-center mt-4">
              <Link 
                to={`/projects/${project._id}`} 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                📂 View Project
              </Link>

              {user && project.owner === user._id && (
                <button
                  onClick={() => deleteProject(project._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  ❌ Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create & Add Team Member Section */}
      <div className="flex flex-col md:flex-row gap-6 my-10">
        {/* Create Project */}
      <div className={`max-w-md mx-auto  p-6 rounded-lg shadow-lg ${darkMode?"bg-gray-900 text-white border border-gray-600" :"bg-white text-black"}`}>
        <h2 className="text-xl font-semibold mb-4">🎯 Create a New Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-3 rounded-md focus:ring-2 focus:ring-blue-400 transition border-gray-400"
        />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-3 rounded-md focus:ring-2 focus:ring-blue-400 transition border-gray-400"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border p-2 w-full mb-3 rounded-md focus:ring-2 focus:ring-blue-400 transition border-gray-400"
        />
        <button
          onClick={createProject}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          ➕ Set Deadline
        </button>
      </div>

        {/* Add Team Member */}
        <div className={`flex-1 p-6 rounded-lg shadow-lg ${darkMode?"bg-gray-900 text-white border border-gray-600" :"bg-white text-black"}`}>
          <h2 className="text-xl font-semibold mb-4">👥 Add Team Member</h2>
          <select
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={`border p-2 w-full mb-3 rounded-md focus:ring-2 focus:ring-green-400 transition ${darkMode?"bg-gray-800 border-gray-600":"border-gray-400"}`}
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className={`border p-2 w-full mb-3 rounded-md focus:ring-2 focus:ring-green-400 transition ${darkMode?"bg-gray-800 border-gray-600":"border-gray-400"}`}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
          <button
            onClick={addTeamMember}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            ✅ Add Member
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default Projects;
