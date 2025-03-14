import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";

const TaskManager = ({ projectId, team, projectOwnerId, project }) => {
  const { showNotification } = useNotification();
  const {darkMode} = useTheme()
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [suggestedTasks, setSuggestedTasks] = useState([]); // Store AI-generated tasks
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tasks/${projectId}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) setTasks(data);
      else console.error("Error fetching tasks:", data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Create a new task
  const createTask = async () => {
    if (!newTask.title || !newTask.description)
      return alert("Title and Description are required!");
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...newTask, project: projectId }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setTasks([...tasks, data]);
        setNewTask({ title: "", description: "", assignedTo: "", dueDate: "" });
        showNotification("Task created successfully!", "success");
      } else console.error("Error creating task:", data.message);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/tasks/update-status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ taskId, status }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setTasks((prev) =>
          prev.map((task) => (task._id === taskId ? { ...task, status } : task))
        );
        showNotification("Task updated successfully!", "success");
      } else {
        const data = await response.json();
        alert(data.message || "Error updating status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
        showNotification("Task deleted successfully!", "success");
      } else {
        const data = await response.json();
        alert(data.message || "Error deleting task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const suggestTask = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/tasks/suggest-tasks",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectTitle: project.name,
            projectDescription: project.description,
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (Array.isArray(data.tasks)) {
        setSuggestedTasks(data.tasks); // Store AI-generated tasks
      } else {
        console.error("Invalid tasks format:", data.tasks);
      }
    } catch (error) {
      console.error("Error fetching AI tasks:", error);
    }
    setLoading(false);
  };

  // Filter tasks
  const newTasks = tasks.filter((task) => task.status !== "completed");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className={`p-8 min-h-screen rounded-lg text-gray-900 ${darkMode?"bg-gray-800 border border-gray-500 text-white" : "bg-gray-100 text-gray-900"}`}>
    <h2 className="text-4xl font-extrabold mb-6 text-blue-700">🚀 Task Manager</h2>

    <div className="grid md:grid-cols-2 gap-6 mb-8 items-center">
      <div className="space-y-4">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task Title"
          className={`p-3 w-full  border border-gray-300 rounded-lg focus:outline-blue-500 ${darkMode?"text-white":"bg-gray-100 text-black"}`}
        />
        <textarea
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          placeholder="Task Description"
          className={`p-3 w-full border border-gray-300 rounded-lg focus:outline-blue-500 ${darkMode?"text-white":"bg-gray-100 text-black"}`}
        />
        <select
          value={newTask.assignedTo}
          onChange={(e) =>
            setNewTask({ ...newTask, assignedTo: e.target.value })
          }
          className={`p-3 w-full border border-gray-300 rounded-lg ${darkMode?"text-white bg-gray-800":"bg-gray-100 text-black"}`}
        >
          <option value="">Assign to...</option>
          {team.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name} ({member.email})
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) =>
            setNewTask({ ...newTask, dueDate: e.target.value })
          }
          className={`p-3 w-full border border-gray-300 rounded-lg ${darkMode?"text-white bg-gray-800":"bg-gray-100 text-black"}`}
        />
        <button
          onClick={createTask}
          className="bg-green-500 hover:bg-green-400 text-white p-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
        <button
          onClick={suggestTask}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-400 ml-3"
        >
          Suggest AI Tasks
        </button>
      </div>
    </div>

      {/* AI-Suggested Tasks */}
      {suggestedTasks.length > 0 && (
        <div className={`mt-8 mb-8 p-6 rounded-lg shadow-lg ${darkMode?"bg-gray-900 text-white":"bg-white text-black "}`}>
          <h3 className="text-2xl font-bold mb-4 text-blue-400">
            🤖 AI-Suggested Tasks
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedTasks.map((task, index) => (
              <div
                key={index}
                className={` p-4 rounded-lg shadow-md border border-gray-700 ${darkMode?"bg-gray-800 text-white":"bg-white text-black"}`}
              >
                <h4 className={`text-lg font-semibold mb-2 ${darkMode?"text-white":"text-black"}`}>
                  {task.title}
                </h4>
                <p className={` text-sm ${darkMode?"text-white":"text-gray-700"}`}>{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Tasks Section */}
      <h3 className="text-2xl font-bold mb-4 ">🆕 New Tasks</h3>
      <div className={`space-y-6 ${darkMode?"bg-gray-900 border border-gray-500":""}`}>
        {newTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            user={user}
            updateTaskStatus={updateTaskStatus}
            deleteTask={deleteTask}
            isOwner={user._id === projectOwnerId}
          />
        ))}
      </div>

      {/* Completed Tasks Section */}
      <h3 className={`text-2xl font-bold mt-10 mb-4  ${darkMode?"text-gray-50":"text-gray-700"}`}>✅ Completed Tasks</h3>
      <div className={`space-y-6 ${darkMode?"bg-gray-900 border border-gray-500":""}`}>
        {completedTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            user={user}
            updateTaskStatus={updateTaskStatus}
            deleteTask={deleteTask}
            isOwner={user._id === projectOwnerId}
          />
        ))}
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, user, updateTaskStatus, deleteTask, isOwner }) => {
  const {darkMode} = useTheme()
  const formatDateToIST = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  };

  return (
    <div className="p-5 rounded-lg shadow-md">
      <h4 className="text-xl font-semibold mb-2">{task.title}</h4>
      <p className="mb-2">{task.description}</p>
      <p className={`text-sm  ${darkMode?"text-gray-300":"text-gray-800"}`}>
        Assigned to: {task.assignedTo?.name || "Unassigned"}
      </p>
      <p className={`text-sm  ${darkMode?"text-gray-300":"text-gray-800"}`}>
        Assigned By: {task.assignedBy?.name || "Unknown"}
      </p>
      <p className={`text-sm  ${darkMode?"text-gray-300":"text-gray-800"}`}>
        Due: {task.dueDate ? formatDateToIST(task.dueDate) : "No deadline"}
      </p>
      <p className={`text-sm mt-2 ${darkMode?"text-gray-300":"text-gray-800"}`}>
        Status:{" "}
        {task.status === "pending"
          ? "🟡 Pending"
          : task.status === "in progress"
          ? "🔵 In Progress"
          : "🟢 Completed"}
      </p>
      {task.assignedTo?._id === user?._id && updateTaskStatus && (
        <select
          value={task.status}
          onChange={(e) => updateTaskStatus(task._id, e.target.value)}
          className={`p-2 mr-3 bg-gray-100 rounded-lg mt-4 ${darkMode?"bg-gray-800":""}`}
        >
          <option value="pending">🟡 Pending</option>
          <option value="in progress">🔵 In Progress</option>
          <option value="completed">🟢 Completed</option>
        </select>
      )}
      {isOwner && (
        <button
          onClick={() => deleteTask(task._id)}
          className="bg-red-600 hover:bg-red-500 p-2 rounded-lg mt-4"
        >
          Delete Task
        </button>
      )}
    </div>
  );
};

export default TaskManager;
