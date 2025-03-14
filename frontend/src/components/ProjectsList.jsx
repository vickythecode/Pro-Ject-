import { useEffect, useState } from "react";
import { useNotification } from "../context/NotificationContext";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/admin/projects", {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await fetch(`http://localhost:4000/api/admin/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setProjects(projects.filter((project) => project._id !== projectId));
      showNotification("Project deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading)
    return <p className="text-center text-white">Loading projects...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Projects List</h2>

      {/* Responsive Table for Large Screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
          <thead className="bg-gray-900">
            <tr>
              <th className="py-3 px-4 text-left">Project Name</th>
              <th className="py-3 px-4 text-left">Owner</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-b border-gray-700">
                <td className="py-3 px-4">{project.name}</td>
                <td className="py-3 px-4">{project.owner?.name || "Unknown"}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card Layout for Mobile Screens */}
      <div className="md:hidden">
        {projects.map((project) => (
          <div
            key={project._id}
            className="p-4 mb-3 bg-gray-800 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-white">{project.name}</h3>
              <p className="text-sm text-gray-400">
                Owned by {project.owner?.name || "Unknown"}
              </p>
            </div>
            <button
              onClick={() => deleteProject(project._id)}
              className="bg-red-600 px-3 py-1 mt-2 sm:mt-0 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No projects found.</p>
      )}
    </div>
  );
};

export default ProjectsList;
