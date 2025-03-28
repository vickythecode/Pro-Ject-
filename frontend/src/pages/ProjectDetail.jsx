import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Chat from "../components/Chat";
import TaskManager from "../components/TaskManager";
import ProjectDashboard from "../components/ProjectDashboard";
import ProjectFiles from "../components/ProjectFiles";
import { Link } from "react-router-dom";

const ProjectDetail = () => {
  const { id } = useParams();
  const { user, loading } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [updatedProject, setUpdatedProject] = useState({
    name: "",
    description: "",
    deadline: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else {
      fetchProjectDetails();
    }
  }, [user, loading]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/projects/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch project details");
      const data = await response.json();
      setProject(data);
      setUpdatedProject({
        name: data.name,
        description: data.description,
        deadline: data.deadline ? data.deadline.split("T")[0] : "",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/projects/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) throw new Error("Failed to update project");
      const data = await response.json();
      setProject(data.project);
      setEditMode(false);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p>No project found</p>;

  return (
    <div
      className={`w-full p-6 space-y-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Project Overview */}
      <div
        className={`rounded-lg shadow p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {editMode ? (
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={updatedProject.name}
              onChange={(e) =>
                setUpdatedProject({ ...updatedProject, name: e.target.value })
              }
            />
            <textarea
              className="w-full p-2 border rounded"
              value={updatedProject.description}
              onChange={(e) =>
                setUpdatedProject({
                  ...updatedProject,
                  description: e.target.value,
                })
              }
            />
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={updatedProject.deadline}
              onChange={(e) =>
                setUpdatedProject({
                  ...updatedProject,
                  deadline: e.target.value,
                })
              }
            />
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold">{project.name}</h1>
            <p className="mt-4 text-lg">{project.description}</p>
            <p className="mt-2 text-sm">Team Leader: {project.owner.name}</p>
            <p className="mt-2 text-sm">
              📅 Deadline:{" "}
              {project.deadline
                ? project.deadline.split("T")[0]
                : "Not defined"}
            </p>
            

            {/* Edit Button - Only Visible to Project Owner */}
            {user._id === project.owner._id && (
              <div className="flex">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4 mr-2"
                >
                  Edit Project
                </button>
              </div>
            )}
            <div className="flex">
                  <Link
                    to={`/files/${id}`}
                    className={`px-4 py-2 text-white rounded mt-4 shadow-md transition-all duration-300 ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    📂 View Files
                  </Link>
                </div>
          </>
        )}
      </div>

      {/* Team Members Section */}
      <div
        className={`rounded-lg shadow p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.team.map((member) => (
            <li
              key={member._id}
              className={`p-4 border rounded-lg shadow-sm ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-900"
              }`}
            >
              <p className="font-medium">{member.name}</p>
              <p className="text-sm">{member.email}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Task Manager Section */}
      <div
        className={`rounded-lg shadow p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">Task Manager</h2>
        <TaskManager
          projectId={id}
          team={project.team}
          projectOwnerId={project.owner._id}
          project={project}
        />
      </div>

      {/* Project Overview Section */}
      <div
        className={`rounded-lg shadow p-6 mt-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
        <ProjectDashboard projectId={id} />
      </div>

      {/* Chat Section */}
      <div
        className={`rounded-lg shadow p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">Project Chat</h2>
        <Chat projectId={id} user={user} />
      </div>

      {/* Navigation Button */}
      <button
        onClick={() => navigate(-1)}
        className={`font-medium py-2 px-4 rounded ${
          darkMode
            ? "bg-gray-600 hover:bg-gray-500 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-white"
        }`}
      >
        Go Back
      </button>
    </div>
  );
};

export default ProjectDetail;
